const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5051/api";

export async function fetchJson(path, options = {}) {
  const controller = new AbortController();
  const timeout = options.timeout ?? 8000;
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      signal: controller.signal,
      ...options,
    });

    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`API ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.error(`fetchJson error for ${path}:`, err);
    throw err;
  }
}

export const getCountries = () => fetchJson("/countries");
export const getTopGoldAthletes = () => fetchJson("/athletes/top/gold");
export const getTopSilverAthletes = () => fetchJson("/athletes/top/silver");
export const getTopBronzeAthletes = () => fetchJson("/athletes/top/bronze");
export const getSports = () => fetchJson("/sports");

export const getAthletes = async ({
  page = 1,
  pageSize = 20,
  search = "",
  sort = ""
} = {}) => {
  const params = new URLSearchParams({ page, pageSize });

  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  return fetchJson(`/athletes?${params.toString()}`);
};

export const getCountrySummary = (noc) =>
  fetchJson(`/countries/${noc}/summary`);

export const getSportDetails = (sport) =>
  fetchJson(`/sports/${encodeURIComponent(sport)}`);

// ✅ Fixed Wiki API
export const fetchAthleteWiki = (name) =>
  fetchJson(`/wiki/athlete/${encodeURIComponent(name)}`);