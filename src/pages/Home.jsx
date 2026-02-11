import HeroSlider from "../components/HeroSlider";
import SectionRow from "../components/SectionRow";
import Footer from "../components/Footer";
import { countryImages } from "../utils/countryImages";
import { athleteImages, getAthleteImage } from "../utils/athleteImages";
import { sportImages } from "../utils/sportImages";
import { useEffect, useState } from "react";

import {
  getCountries,
  getTopGoldAthletes,
  getTopSilverAthletes,
  getTopBronzeAthletes,
  getSports,
} from "../services/api";

function Home() {
  const [countries, setCountries] = useState([]);
  const [goldAthletes, setGoldAthletes] = useState([]);
  const [silverAthletes, setSilverAthletes] = useState([]);
  const [bronzeAthletes, setBronzeAthletes] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCountries(),
      getTopGoldAthletes(),
      getTopSilverAthletes(),
      getTopBronzeAthletes(),
      getSports(),
    ])
      .then(([countriesRes, goldA, silverA, bronzeA, sportsRes]) => {
        if (Array.isArray(countriesRes)) setCountries(countriesRes);
        if (Array.isArray(goldA)) setGoldAthletes(goldA);
        if (Array.isArray(silverA)) setSilverAthletes(silverA);
        if (Array.isArray(bronzeA)) setBronzeAthletes(bronzeA);
        if (Array.isArray(sportsRes)) setSports(sportsRes);
      })
      .catch((err) => console.error("Home load error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Case-insensitive sport image match
  const getSportImage = (sport) => {
    if (!sport) return null;

    const match = Object.keys(sportImages).find(
      (key) => key.toLowerCase() === sport.toLowerCase()
    );

    return match ? sportImages[match] : null;
  };

  // ✅ Athlete image resolver with sport fallback
  const resolveAthleteImage = (athlete) => {
    // 1️⃣ Direct athlete image map
    if (athleteImages[athlete.name])
      return athleteImages[athlete.name];

    // 2️⃣ getAthleteImage helper
    const mapped = getAthleteImage(athlete.name);
    if (mapped && !mapped.includes("fallback-card"))
      return mapped;

    // 3️⃣ Sport fallback
    const sportFallback = getSportImage(athlete.sport);
    if (sportFallback) return sportFallback;

    // 4️⃣ Final fallback
    return "/images/fallback-card.png";
  };

  // ✅ FRONTEND SORTING FOR COUNTRIES
  const topGoldCountries = [...countries]
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 10);

  const topSilverCountries = [...countries]
    .sort((a, b) => b.silver - a.silver)
    .slice(0, 10);

  const topBronzeCountries = [...countries]
    .sort((a, b) => b.bronze - a.bronze)
    .slice(0, 10);

  return (
    <>
      <HeroSlider />

      <div style={{ padding: "40px" }}>
        {!loading && (
          <>
            {/* Countries */}
            <SectionRow
              title="Top Gold Medal Countries"
              items={topGoldCountries.map((c) => ({
                label: c.country,
                value: c.noc,
                image: countryImages[c.noc],
              }))}
              basePath="/countries"
              explorePath="/countries?sort=gold"
            />

            <SectionRow
              title="Top Silver Medal Countries"
              items={topSilverCountries.map((c) => ({
                label: c.country,
                value: c.noc,
                image: countryImages[c.noc],
              }))}
              basePath="/countries"
              explorePath="/countries?sort=silver"
            />

            <SectionRow
              title="Top Bronze Medal Countries"
              items={topBronzeCountries.map((c) => ({
                label: c.country,
                value: c.noc,
                image: countryImages[c.noc],
              }))}
              basePath="/countries"
              explorePath="/countries?sort=bronze"
            />

            {/* Gold Athletes */}
            <SectionRow
              title="Top Gold Medal Athletes"
              items={goldAthletes.map((a) => ({
                label: a.name,
                value: { name: a.name, sport: a.sport },
                image: resolveAthleteImage(a),
              }))}
              basePath="/athletes"
              explorePath="/athletes?sort=gold"
            />

            {/* Silver Athletes */}
            <SectionRow
              title="Top Silver Medal Athletes"
              items={silverAthletes.map((a) => ({
                label: a.name,
                value: { name: a.name, sport: a.sport },
                image: resolveAthleteImage(a),
              }))}
              basePath="/athletes"
              explorePath="/athletes?sort=silver"
            />

            {/* Bronze Athletes */}
            <SectionRow
              title="Top Bronze Medal Athletes"
              items={bronzeAthletes.map((a) => ({
                label: a.name,
                value: { name: a.name, sport: a.sport },
                image: resolveAthleteImage(a),
              }))}
              basePath="/athletes"
              explorePath="/athletes?sort=bronze"
            />

            {/* Sports Section */}
            <SectionRow
              title="Popular Sports"
              items={sports.map((s) => ({
                label: s.sport || s,
                value: s.sport || s,
                image:
                  getSportImage(s.sport || s) ||
                  "/images/fallback-card.png",
              }))}
              basePath="/sports"
              explorePath="/sports"
            />
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Home;