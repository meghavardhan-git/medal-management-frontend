import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { countryImages } from "../utils/countryImages";

function Favorites() {
  const navigate = useNavigate();
  const favorites = JSON.parse(localStorage.getItem("favoriteCountries")) || [];

  if (favorites.length === 0) {
    return (
      <Container style={{ paddingTop: "100px", color: "#777" }}>
        <h4>No favorite countries added.</h4>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px" }}>
      <h2 className="mb-4 text-white">❤️ Favorites</h2>

      <Row>
        {favorites.map((c) => (
          <Col md={3} sm={6} key={c.noc} className="mb-4">
            <Card
              className="netflix-card"
              style={{ cursor: "pointer", background: "#1f1f1f", border: "none" }}
              onClick={() => navigate(`/countries/${c.noc}`)}
            >
              <Card.Img
                src={countryImages[c.noc]}
                onError={(e) => (e.target.src = "/images/fallback-flag.png")}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-white">
                  {c.country}
                </Card.Title>
                <p style={{ color: "#aaa" }}>
                  🥇 {c.gold} 🥈 {c.silver} 🥉 {c.bronze}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Favorites;
