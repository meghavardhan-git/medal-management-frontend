const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5051/api";

export async function fetchJson(path, options = {}) {
  const controller = new AbortController();
  const timeout = options.timeout ?? 8000; // default 8s
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal, ...options });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status} ${res.statusText} ${text}`);
    }
    // try json, but if empty return null
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      return null;
    }
  } catch (err) {
    clearTimeout(id);
    console.error(`fetchJson error for ${path}:`, err.message || err);
    // Bubble up a friendly error for components to handle
    throw new Error(`Network error while requesting ${path}: ${err.message}`);
  }
}

export const getCountries = async () => fetchJson('/countries');
export const getSports = async () => fetchJson('/sports');
export const getAthletes = async () => fetchJson('/athletes');

export const getTopGoldCountries = async () => fetchJson('/countries/top/gold');
export const getTopSilverCountries = async () => fetchJson('/countries/top/silver');
export const getTopBronzeCountries = async () => fetchJson('/countries/top/bronze');
export const getTopGoldAthletes = async () => fetchJson('/athletes/top/gold');
export const getTopSilverAthletes = async () => fetchJson('/athletes/top/silver');
export const getTopBronzeAthletes = async () => fetchJson('/athletes/top/bronze');
