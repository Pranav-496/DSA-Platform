// API base URL for AlgoNova Platform
// Points to Render production backend (https://dsa-platform-rxfd.onrender.com) or custom environment URL
let API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://dsa-platform-c7t8.onrender.com" : "");

if (API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.slice(0, -4);
}

export default API_BASE;
