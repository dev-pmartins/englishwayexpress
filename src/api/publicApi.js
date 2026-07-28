const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function get(path) {
  const res = await fetch(`${API_BASE}/api${path}`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export const publicApi = {
  getLanguages: () => get('/languages'),
  getLevels:    () => get('/levels'),
  getModules:   (langCode = '') => get(`/modules/${langCode}`),
  getMaterials: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/materials${qs ? `?${qs}` : ''}`);
  },
};
