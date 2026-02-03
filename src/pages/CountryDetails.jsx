import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFavourites } from "../context/FavouritesContext";

function CountryDetails() {
  const { name } = useParams();
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  // ✅ define country FIRST
  const country = {
    name,
    flag:
      name === "USA"
        ? "https://flagcdn.com/w640/us.png"
        : name === "India"
        ? "https://flagcdn.com/w640/in.png"
        : "https://flagcdn.com/w640/jp.png",
    gold: 10,
    silver: 8,
    bronze: 12,
    sports: ["Athletics", "Hockey", "Wrestling", "Shooting"],
  };

  // ✅ now safely use country
  const isFavourite = favourites.find((c) => c.name === country.name);

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <Row>
        <Col md={4}>
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Col>

        <Col md={8}>
          <h1>{country.name}</h1>

          <h4 style={{ marginTop: "20px" }}>Medals</h4>
          <p>🥇 Gold: {country.gold}</p>
          <p>🥈 Silver: {country.silver}</p>
          <p>🥉 Bronze: {country.bronze}</p>

          <h4 style={{ marginTop: "20px" }}>Sports</h4>
          <ul>
            {country.sports.map((sport, index) => (
              <li key={index}>{sport}</li>
            ))}
          </ul>

          <Button
            variant={isFavourite ? "secondary" : "danger"}
            onClick={() =>
              isFavourite
                ? removeFavourite(country.name)
                : addFavourite(country)
            }
          >
            {isFavourite ? "★ Remove from Favourites" : "☆ Add to Favourites"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default CountryDetails;
