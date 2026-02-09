export const athleteImages = {
  // Gold Medalists
  "Michael Phelps": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Michael_Phelps_Rio_2016.jpg/320px-Michael_Phelps_Rio_2016.jpg",
  "Ray Ewry": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Ray_Ewry.jpg/320px-Ray_Ewry.jpg",
  "Paavo Nurmi": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Paavo_Nurmi_1920.jpg/320px-Paavo_Nurmi_1920.jpg",
  "Larysa Latynina": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Larisa_Latynina_1964.jpg/320px-Larisa_Latynina_1964.jpg",
  "Carl Lewis": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Carl_Lewis_1984.jpg/320px-Carl_Lewis_1984.jpg",
  
  // Silver/Bronze Medalists
  "Aleksandr Dityatin": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Alexander_Dityatin.jpg/320px-Alexander_Dityatin.jpg",
  "Yang Yang": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Yang_Yang_%28A%29.jpg/320px-Yang_Yang_%28A%29.jpg",
  "Mikhail Voronin": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mikhail_Voronin_1967.jpg/320px-Mikhail_Voronin_1967.jpg",
  "Aleksey Nemov": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Alexei_Nemov_2012.jpg/320px-Alexei_Nemov_2012.jpg",
  "Merlene Ottey": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Merlene_Ottey_2012.jpg/320px-Merlene_Ottey_2012.jpg",
  "Franziska van Almsick": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Franziska_van_Almsick_2013.jpg/320px-Franziska_van_Almsick_2013.jpg"
};

// Build a lowercase map for tolerant lookups (avoids rebuilding per call)
const _athleteImagesLower = Object.fromEntries(
  Object.entries(athleteImages).map(([k, v]) => [k.trim().toLowerCase(), v])
);

export function getAthleteImage(name) {
  if (!name) return undefined;
  const key = name.trim();
  if (athleteImages[key]) return athleteImages[key];
  const lower = key.toLowerCase();
  return _athleteImagesLower[lower];
}