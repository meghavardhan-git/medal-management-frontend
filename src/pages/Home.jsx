import HeroSlider from "../components/HeroSlider";
import SectionRow from "../components/SectionRow";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getTopGoldCountries } from "../services/api";
import { getTopSilverCountries} from "../services/api";
import { getTopBronzeCountries} from "../services/api";
import { getTopGoldAthletes} from "../services/api";
import { getTopSilverAthletes} from "../services/api";
import { getTopBronzeAthletes} from "../services/api";

function Home() {
  // Static featured data (no images here)
  const featuredCountries = [
    { label: "India", value: "IND" },
    { label: "United States", value: "USA" },
    { label: "China", value: "CHN" },
  ];

  const featuredSports = [
    { label: "Athletics", value: "Athletics" },
    { label: "Swimming", value: "Swimming" },
    { label: "Badminton", value: "Badminton" },
  ];

  const featuredAthletes = [
    { label: "Neeraj Chopra", value: "Neeraj Chopra" },
    { label: "Usain Bolt", value: "Usain Bolt" },
    { label: "PV Sindhu", value: "PV Sindhu" },
  ];

  const [goldCountries, setGoldCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [silverCountries, setSilverCountries] = useState([]);
const [bronzeCountries, setBronzeCountries] = useState([]);
const [goldAthletes, setGoldAthletes] = useState([]);
const [silverAthletes, setSilverAthletes] = useState([]);
const [bronzeAthletes, setBronzeAthletes] = useState([]);



  useEffect(() => {
    Promise.all([
      getTopGoldCountries(),
      getTopSilverCountries(),
      getTopBronzeCountries(),
      getTopGoldAthletes(),
      getTopSilverAthletes(),
      getTopBronzeAthletes(),
    ])
      .then(([
        goldCountriesRes,
        silverCountriesRes,
        bronzeCountriesRes,
        goldAthletesRes,
        silverAthletesRes,
        bronzeAthletesRes,
      ]) => {
        if (Array.isArray(goldCountriesRes)) setGoldCountries(goldCountriesRes);
        if (Array.isArray(silverCountriesRes)) setSilverCountries(silverCountriesRes);
        if (Array.isArray(bronzeCountriesRes)) setBronzeCountries(bronzeCountriesRes);

        if (Array.isArray(goldAthletesRes)) setGoldAthletes(goldAthletesRes);
        if (Array.isArray(silverAthletesRes)) setSilverAthletes(silverAthletesRes);
        if (Array.isArray(bronzeAthletesRes)) setBronzeAthletes(bronzeAthletesRes);
      })
      .catch((err) => console.error('Failed to load top lists:', err))
      .finally(() => setLoading(false));
  }, []);


  return (
    <>
      {/* Hero section */}
      <HeroSlider />

      {/* Main content */}
      <div style={{ padding: "40px" }}>
                {!loading && (
          <SectionRow
            title="Top Gold Medal Countries"
            items={goldCountries.map(c => ({
              label: c.name,
              value: c.code
            }))}
            basePath="/countries"
            explorePath="/countries?sort=gold"
          />
        )}

        <SectionRow
  title="Top Silver Medal Countries"
  items={silverCountries.map(c => ({
    label: c.name,
    value: c.code
  }))}
  basePath="/countries"
  explorePath="/countries?sort=silver"
/>

<SectionRow
  title="Top Bronze Medal Countries"
  items={bronzeCountries.map(c => ({
    label: c.name,
    value: c.code
  }))}
  basePath="/countries"
  explorePath="/countries?sort=bronze"
/>
<SectionRow
  title="Top Gold Medal Athletes"
  items={goldAthletes.map(a => ({
    label: a.name,
    value: a.name,   // IMPORTANT: name, not id
    image: a.image
  }))}
  basePath="/athletes"
  explorePath="/athletes?sort=gold"
/>


<SectionRow
  title="Top Silver Medal Athletes"
  items={silverAthletes.map(a => ({
    label: a.name,
    value: a.name,
    image: a.image
  }))}
  basePath="/athletes"
  explorePath="/athletes?sort=silver"
/>

<SectionRow
  title="Top Bronze Medal Athletes"
  items={bronzeAthletes.map(a => ({
    label: a.name,
    value: a.name,
    image: a.image
  }))}
  basePath="/athletes"
  explorePath="/athletes?sort=bronze"
/>

        <SectionRow
          title="Popular Sports"
          items={featuredSports}
          basePath="/sports"
          explorePath="/sports"
        />

      
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
