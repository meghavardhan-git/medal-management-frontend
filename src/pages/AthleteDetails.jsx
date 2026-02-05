import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { athletes } from "../data/athletes";

function AthleteDetails() {
  const { name } = useParams();
  const athlete = athletes.find((a) => a.name === name);

  if (!athlete) {
    return (
      <Container style={{ paddingTop: "100px", color: "white" }}>
        <h3>Athlete not found</h3>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <Row>
        <Col md={4}>
          <img
            src={athlete.image}
            alt={athlete.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Col>

        <Col md={8}>
          <h1>{athlete.name}</h1>
          <p>{athlete.sport} • {athlete.country}</p>

          <h4 style={{ marginTop: "20px" }}>Medals</h4>
          <p>🥇 Gold: {athlete.medals.gold}</p>
          <p>🥈 Silver: {athlete.medals.silver}</p>
          <p>🥉 Bronze: {athlete.medals.bronze}</p>

          <h4 style={{ marginTop: "20px" }}>Highlight</h4>
          <p>{athlete.highlight}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default AthleteDetails;
