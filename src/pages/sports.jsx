import { Container, Row, Col, Card } from "react-bootstrap";
import { sports } from "../data/sports";
import { useNavigate } from "react-router-dom";

function Sports() {
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2>Sports</h2>

      <Row>
        {sports.map((sport, index) => (
          <Col md={3} key={index} style={{ marginTop: "20px" }}>
            <Card
              onClick={() => navigate(`/sports/${sport.name}`)}
              style={{
                backgroundColor: "#1f1f1f",
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
              <Card.Img
                variant="top"
                src={sport.image}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {sport.name}
                </Card.Title>
                <p style={{ color: "#aaa" }}>
                  Dominant Countries: {sport.countries.length}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Sports;
