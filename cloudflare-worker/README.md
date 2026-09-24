# Cloudflare Worker: Portfolio Gemini AI Proxy

This worker proxies chat queries from your GitHub Pages portfolio to **Google Gemini 1.5 Flash**, keeping your `GEMINI_API_KEY` 100% private and protected from public exposure.

---

## 🚀 Setup Guide (Takes ~2 Minutes)

### 1. Create a Free Cloudflare Account
If you don't have one yet, sign up for free at [dash.cloudflare.com](https://dash.cloudflare.com/).

### 2. Create the Worker
1. Go to **Compute (Workers & Pages)** in the left sidebar.
2. Click **Create Application** $\to$ **Create Worker**.
3. Name it (for example: `mrh-portfolio-agent`) and click **Deploy**.
4. Click **Edit code**.
5. Delete the default template code, copy the entire content of [`worker.js`](./worker.js), paste it in, and click **Deploy**.

### 3. Add Your Gemini API Key as an Environment Secret
1. Go back to your Worker's dashboard.
2. Click **Settings** $\to$ **Variables and Secrets**.
3. Under **Environment Variables**, click **Add**.
4. Set:
   * **Variable name**: `GEMINI_API_KEY`
   * **Value**: Your actual Gemini API key (from [aistudio.google.com](https://aistudio.google.com/))
   * Click **Encrypt** to keep it hidden and secure.
5. Click **Save and Deploy**.

### 4. Connect to Your Portfolio
1. Copy the Worker URL shown at the top of your worker page (e.g., `https://mrh-portfolio-agent.<your-subdomain>.workers.dev`).
2. In your local portfolio project, create a `.env` file (or copy `.env.example` to `.env`):
   ```env
   VITE_CHAT_API_URL=https://mrh-portfolio-agent.<your-subdomain>.workers.dev
   ```
3. Run `npm run dev` to test locally, or push to GitHub (and configure `VITE_CHAT_API_URL` in your GitHub Actions build or directly in `.env.production`).

---

## 🛡️ What happens if the API is offline or not set?
The portfolio has a built-in seamless fallback: if `VITE_CHAT_API_URL` is empty, down, or rate-limited, it automatically falls back to the client-side grounded retrieval engine without crashing.
