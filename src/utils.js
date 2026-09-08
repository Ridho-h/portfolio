/**
 * Formats image URLs from external cloud storage providers (Google Drive, Dropbox, etc.)
 * into direct raw image links that can be rendered in <img> tags.
 * 
 * @param {string} url 
 * @returns {string} Direct image link
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  url = url.trim();

  // Convert Google Drive share/preview links to direct image CDN links
  // Supported patterns:
  // - https://drive.google.com/file/d/{id}/view...
  // - https://drive.google.com/open?id={id}
  // - https://drive.google.com/uc?id={id}
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  // Dropbox share links (convert ?dl=0 to ?raw=1)
  if (url.includes('dropbox.com')) {
    return url.replace(/[?&]dl=0/, '?raw=1');
  }

  return url;
}
