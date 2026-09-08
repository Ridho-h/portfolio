/* ═══════════════════════════════════════════════════════
 *  ADMIN.JS — Dashboard Logic
 *  Firebase Auth + Firestore CRUD for Projects & Certs
 * ═══════════════════════════════════════════════════════ */

import './admin.css';
import { db, auth, firebaseReady } from './firebase-config.js';
import { formatImageUrl } from './utils.js';

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

/* ──────────────────────────────────
 *  DOM REFS
 * ────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const loginScreen = $('#login-screen');
const dashboard = $('#admin-dashboard');
const loginForm = $('#login-form');
const loginError = $('#login-error');

/* ──────────────────────────────────
 *  TOAST NOTIFICATIONS
 * ────────────────────────────────── */
function toast(msg, type = 'success') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast'; }, 3000);
}

/* ──────────────────────────────────
 *  FIREBASE CHECK
 * ────────────────────────────────── */
if (!firebaseReady) {
  loginError.textContent = '⚠ Firebase not configured. See src/firebase-config.js';
  loginForm.querySelector('button').disabled = true;
}

/* ──────────────────────────────────
 *  AUTH
 * ────────────────────────────────── */
if (firebaseReady) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginScreen.style.display = 'none';
      dashboard.style.display = 'grid';
      loadAllData();
    } else {
      loginScreen.style.display = 'flex';
      dashboard.style.display = 'none';
    }
  });
}

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!firebaseReady) return;

  const email = $('#login-email').value;
  const password = $('#login-password').value;
  loginError.textContent = '';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = err.code === 'auth/invalid-credential'
      ? 'Invalid email or password.'
      : `Error: ${err.message}`;
  }
});

$('#logout-btn')?.addEventListener('click', () => {
  if (firebaseReady) signOut(auth);
});

/* ──────────────────────────────────
 *  TAB SWITCHING
 * ────────────────────────────────── */
$$('.sidebar-link').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.sidebar-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $(`#tab-${btn.dataset.tab}`).classList.add('active');
  });
});

/* ──────────────────────────────────
 *  LOAD DATA
 * ────────────────────────────────── */
async function loadAllData() {
  await Promise.all([loadProjects(), loadCertificates()]);
}

async function loadProjects() {
  const list = $('#projects-list');
  if (!firebaseReady) {
    list.innerHTML = '<p class="empty-state">Firebase not configured.</p>';
    return;
  }

  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = '<p class="empty-state">No projects yet. Click "+ Add Project" to start.</p>';
      return;
    }

    list.innerHTML = snap.docs.map(d => {
      const p = d.data();
      return `
        <div class="item-card" data-id="${d.id}">
          <div class="item-info">
            <div class="item-title">
              ${p.title}
              ${p.featured ? '<span class="item-badge">Featured</span>' : ''}
            </div>
            <div class="item-meta">${(p.tags || []).join(' · ')} — Order: ${p.order || '-'}</div>
          </div>
          <div class="item-actions">
            <button class="btn-edit" onclick="editProject('${d.id}')">Edit</button>
            <button class="btn-delete" onclick="removeProject('${d.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    list.innerHTML = `<p class="empty-state">Error loading projects: ${e.message}</p>`;
  }
}

async function loadCertificates() {
  const list = $('#certs-list');
  if (!firebaseReady) {
    list.innerHTML = '<p class="empty-state">Firebase not configured.</p>';
    return;
  }

  try {
    const snap = await getDocs(collection(db, 'certificates'));

    if (snap.empty) {
      list.innerHTML = '<p class="empty-state">No certificates yet. Click "+ Add Certificate" to start.</p>';
      return;
    }

    list.innerHTML = snap.docs.map(d => {
      const c = d.data();
      const imgUrl = formatImageUrl(c.imageUrl);
      return `
        <div class="item-card" data-id="${d.id}" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            ${imgUrl ? `
              <div style="width: 48px; height: 34px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                <img src="${imgUrl}" alt="${c.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
              </div>
            ` : ''}
            <div class="item-info">
              <div class="item-title">${c.name}</div>
              <div class="item-meta">${c.issuer || ''}</div>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-edit" onclick="editCert('${d.id}')">Edit</button>
            <button class="btn-delete" onclick="removeCert('${d.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    list.innerHTML = `<p class="empty-state">Error loading certificates: ${e.message}</p>`;
  }
}

/* ──────────────────────────────────
 *  PROJECTS CRUD
 * ────────────────────────────────── */
const projectForm = $('#project-form');
const projectPanel = $('#project-form-panel');

$('#btn-add-project')?.addEventListener('click', () => {
  projectForm.reset();
  $('#project-id').value = '';
  $('#project-form-title').textContent = 'Add New Project';
  projectPanel.style.display = 'block';
  projectPanel.scrollIntoView({ behavior: 'smooth' });
});

$('#cancel-project')?.addEventListener('click', () => {
  projectPanel.style.display = 'none';
});

projectForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!firebaseReady) return;

  const id = $('#project-id').value;
  const data = {
    title: $('#project-title').value,
    description: $('#project-desc').value,
    tags: $('#project-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    url: $('#project-url').value,
    featured: $('#project-featured').checked,
    order: parseInt($('#project-order').value) || 1,
  };

  try {
    if (id) {
      await updateDoc(doc(db, 'projects', id), data);
      toast('Project updated!');
    } else {
      await addDoc(collection(db, 'projects'), data);
      toast('Project added!');
    }
    projectPanel.style.display = 'none';
    await loadProjects();
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
});

window.editProject = async function (id) {
  if (!firebaseReady) return;
  try {
    const snap = await getDocs(collection(db, 'projects'));
    const d = snap.docs.find(d => d.id === id);
    if (!d) return;
    const p = d.data();

    $('#project-id').value = id;
    $('#project-title').value = p.title || '';
    $('#project-desc').value = p.description || '';
    $('#project-tags').value = (p.tags || []).join(', ');
    $('#project-url').value = p.url || '';
    $('#project-featured').checked = !!p.featured;
    $('#project-order').value = p.order || 1;
    $('#project-form-title').textContent = 'Edit Project';

    projectPanel.style.display = 'block';
    projectPanel.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
};

window.removeProject = async function (id) {
  if (!confirm('Delete this project?')) return;
  try {
    await deleteDoc(doc(db, 'projects', id));
    toast('Project deleted.');
    await loadProjects();
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
};

/* ──────────────────────────────────
 *  CERTIFICATES CRUD
 * ────────────────────────────────── */
const certForm = $('#cert-form');
const certPanel = $('#cert-form-panel');
const certImgInput = $('#cert-image-url');

function updateCertPreview() {
  const box = $('#cert-img-preview-box');
  const img = $('#cert-img-preview');
  const text = $('#cert-img-preview-text');
  if (!certImgInput || !box) return;

  const raw = certImgInput.value.trim();
  if (!raw) {
    box.style.display = 'none';
    return;
  }

  const directUrl = formatImageUrl(raw);
  box.style.display = 'flex';
  img.src = directUrl;
  img.onload = () => {
    text.textContent = '✓ Image loaded successfully!';
    text.style.color = 'var(--accent)';
  };
  img.onerror = () => {
    text.textContent = '⚠ Failed to load image. Make sure Google Drive sharing is set to "Anyone with the link".';
    text.style.color = '#ef4444';
  };
}

certImgInput?.addEventListener('input', updateCertPreview);
certImgInput?.addEventListener('change', updateCertPreview);

$('#btn-add-cert')?.addEventListener('click', () => {
  certForm.reset();
  $('#cert-id').value = '';
  $('#cert-image-url').value = '';
  $('#cert-file-type').value = '';
  updateCertPreview();
  $('#cert-form-title').textContent = 'Add New Certificate';
  certPanel.style.display = 'block';
  certPanel.scrollIntoView({ behavior: 'smooth' });
});

$('#cancel-cert')?.addEventListener('click', () => {
  certPanel.style.display = 'none';
  updateCertPreview();
});

certForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!firebaseReady) return;

  const submitBtn = certForm.querySelector('.btn-save');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    const id = $('#cert-id').value;
    const rawImageUrl = ($('#cert-image-url').value || '').trim();
    const imageUrl = formatImageUrl(rawImageUrl);
    
    // Infer fileType from URL (basic check for .pdf or pdf in url)
    let fileType = 'image';
    if (rawImageUrl.toLowerCase().includes('pdf') || rawImageUrl.endsWith('.pdf')) {
      fileType = 'pdf';
    }

    const data = {
      name: $('#cert-name').value,
      issuer: $('#cert-issuer').value,
      url: $('#cert-url').value,
      imageUrl: imageUrl || rawImageUrl,
      fileType: fileType
    };

    if (id) {
      await updateDoc(doc(db, 'certificates', id), data);
      toast('Certificate updated!');
    } else {
      await addDoc(collection(db, 'certificates'), data);
      toast('Certificate added!');
    }
    certPanel.style.display = 'none';
    await loadCertificates();
  } catch (err) {
    toast(`Error: ${err.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Certificate';
  }
});

window.editCert = async function (id) {
  if (!firebaseReady) return;
  try {
    const snap = await getDocs(collection(db, 'certificates'));
    const d = snap.docs.find(d => d.id === id);
    if (!d) return;
    const c = d.data();

    $('#cert-id').value = id;
    $('#cert-name').value = c.name || '';
    $('#cert-issuer').value = c.issuer || '';
    $('#cert-url').value = c.url || '';
    $('#cert-image-url').value = c.imageUrl || '';
    $('#cert-file-type').value = c.fileType || '';
    updateCertPreview();
    $('#cert-form-title').textContent = 'Edit Certificate';

    certPanel.style.display = 'block';
    certPanel.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
};

window.removeCert = async function (id) {
  if (!confirm('Delete this certificate?')) return;
  try {
    await deleteDoc(doc(db, 'certificates', id));
    toast('Certificate deleted.');
    await loadCertificates();
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
};
