import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { sports } from "../data/sports";
import { athletes } from "../data/athelets";

function SportDetails() {
  const { name } = useParams();

  const sport = sports.find((s) => s.name === name);
  const sportAthletes = athletes.filter(
    (a) => a.sport === name
  );

  if (!sport) {
    return (
      <Container style={{ paddingTop: "100px", color: "white" }}>
        <h3>Sport not found</h3>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h1>{sport.name}</h1>

      <h4 style={{ marginTop: "20px" }}>Dominant Countries</h4>
      <ul>
        {sport.countries.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      <h4 style={{ marginTop: "30px" }}>Athletes</h4>

      <Row>
        {sportAthletes.map((athlete, index) => (
          <Col md={3} key={index} style={{ marginTop: "20px" }}>
            <Card
              style={{
                backgroundColor: "#1f1f1f",
                border: "none",
                color: "white",
              }}
            >
              <Card.Img
                variant="top"
                src={athlete.image}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{athlete.name}</Card.Title>
                <p>{athlete.country}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SportDetails;
