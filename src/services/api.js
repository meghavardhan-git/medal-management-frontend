const BASE_URL = "http://localhost:5051/api";

export const getCountries = async () => {
  const res = await fetch(`${BASE_URL}/countries`);
  return res.json();
};

export const getSports = async () => {
  const res = await fetch(`${BASE_URL}/sports`);
  return res.json();
};
