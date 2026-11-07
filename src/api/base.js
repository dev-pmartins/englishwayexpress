const configured = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// HTTPS pages cannot call an HTTP API (mixed content). In production, use
// same-origin `/api` and let Vercel proxy to the backend.
export const API_BASE =
  import.meta.env.PROD && configured.startsWith("http://") ? "" : configured;
