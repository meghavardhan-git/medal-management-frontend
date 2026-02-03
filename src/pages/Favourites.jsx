import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useFavourites } from "../context/FavouritesContext";
import { useNavigate } from "react-router-dom";

function Favourites() {
  const { favourites, removeFavourite } = useFavourites();
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2>⭐ Favourite Countries</h2>

      {favourites.length === 0 ? (
        <p style={{ color: "#aaa" }}>No favourites added yet.</p>
      ) : (
        <Row>
          {favourites.map((country, index) => (
            <Col md={3} key={index} style={{ marginTop: "20px" }}>
              <Card
                onClick={() => navigate(`/countries/${country.name}`)}
                style={{
                  backgroundColor: "#1f1f1f",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Card.Body>
                  <Card.Title>{country.name}</Card.Title>
                  <p>🥇 {country.gold}</p>
                  <p>🥈 {country.silver}</p>
                  <p>🥉 {country.bronze}</p>

                  {/* ❌ Remove button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // 🚫 prevent card click
                      removeFavourite(country.name);
                    }}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Favourites;
