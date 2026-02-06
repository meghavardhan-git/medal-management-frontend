const iso3ToIso2 = {
  IND: "in",
  USA: "us",
  CHN: "cn",
  AUS: "au",
  GBR: "gb",
  JPN: "jp",
};

export const getFlagUrl = (iso3) => {
  const iso2 = iso3ToIso2[iso3];
  return iso2
    ? `https://flagcdn.com/w320/${iso2}.png`
    : "/images/fallback-flag.png";
};
