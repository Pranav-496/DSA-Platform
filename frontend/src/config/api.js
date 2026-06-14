// API base URL
// In production on Vercel, point to the Render backend
// In development, the Vite proxy handles /api -> localhost:5000
let API_BASE = import.meta.env.VITE_API_URL || "";
if (API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.slice(0, -4);
}

export default API_BASE;
