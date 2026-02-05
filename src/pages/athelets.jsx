import { Container, Row, Col, Card } from "react-bootstrap";
import { athletes } from "../data/athelets";
import { useNavigate } from "react-router-dom";

function Athletes() {
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2>Athelets</h2>

      <Row>
        {athelets.map((athletes, index) => (
          <Col md={3} key={index} style={{ marginTop: "20px" }}>
            <Card
              onClick={() => navigate(`/atheletes/${athletes.name}`)}
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
                src={athletes.image}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {athelets.name}
                </Card.Title>
                <p style={{ color: "#aaa" }}>
                  Dominant Countries: {athletes.countries.length}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Athletes;
