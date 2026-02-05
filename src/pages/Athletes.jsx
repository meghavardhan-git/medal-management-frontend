import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { athletes } from "../data/athletes";
import { sports } from "../data/sports";
import { countries } from "../data/countries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Athletes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  const filteredAthletes = athletes.filter((a) => {
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (sportFilter === "All" || a.sport === sportFilter) &&
      (countryFilter === "All" || a.country === countryFilter)
    );
  });

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2>Athletes</h2>

      {/* Filters */}
      <Row style={{ marginBottom: "20px" }}>
        <Col md={4}>
          <Form.Control
            placeholder="Search athlete"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option>All</option>
            {sports.map((s, i) => (
              <option key={i}>{s.name}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option>All</option>
            {countries.map((c, i) => (
              <option key={i}>{c.code}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filteredAthletes.map((athlete, index) => (
          <Col md={3} key={index} style={{ marginBottom: "20px" }}>
            <Card
              onClick={() => navigate(`/athletes/${athlete.name}`)}
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
                src={athlete.image}
                style={{ height: "160px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {athlete.name}
                </Card.Title>
                <p style={{ color: "#aaa" }}>
                  {athlete.sport} • {athlete.country}
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
