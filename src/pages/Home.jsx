import HeroSlider from "../components/HeroSlider";
//file rename chesinanduku vs code error to fix notes->11th line
import CategoryRow from "../components/CategoryRow";
import {
  goldCountries,
  silverCountries,
  sports,
  athletes,
} from "../data/mockData";

function Home() {
  return (
    <div>
      <HeroSlider />

      <CategoryRow title="🥇 Top Gold Medal Countries" items={goldCountries} />
      <CategoryRow title="🥈 Top Silver Medal Countries" items={silverCountries} />
      <CategoryRow title="🏃 Popular Athletes" items={athletes} />
      <CategoryRow title="🏟️ Sports Categories" items={sports} />
    </div>
  );
}

export default Home;
