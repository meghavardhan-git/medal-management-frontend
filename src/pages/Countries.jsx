import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCountries } from "../services/api"; 

function Countries() {
  // 1. Initialize Hooks
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Data from API
  useEffect(() => {
    getCountries()
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
        setError("Could not load medal statistics.");
        setLoading(false);
      });
  }, []);

  // 3. Handle Loading and Error States
  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: "100px" }}>
        <Spinner animation="border" variant="light" />
        <p style={{ color: "white", marginTop: "10px" }}>Loading countries...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ paddingTop: "100px" }}>
        <h3 style={{ color: "#ff4d4d" }}>{error}</h3>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px" }}>
      <h2 style={{ color: "white", marginBottom: "30px" }}>
        Countries & Medal Statistics
      </h2>

      {/* 4. Filter Buttons UI */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          className={`btn me-2 ${filter === "all" ? "btn-light" : "btn-outline-light"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("gold")}
          className={`btn me-2 ${filter === "gold" ? "btn-warning" : "btn-outline-warning"}`}
        >
          🥇 Gold
        </button>
        <button
          onClick={() => setFilter("silver")}
          className={`btn me-2 ${filter === "silver" ? "btn-secondary" : "btn-outline-secondary"}`}
        >
          🥈 Silver
        </button>
        <button
          onClick={() => setFilter("bronze")}
          className={`btn ${filter === "bronze" ? "btn-danger" : "btn-outline-danger"}`}
        >
          🥉 Bronze
        </button>
      </div>

      <Row>
        {/* 5. Sorting and Mapping Logic */}
        {[...countries] // Spread into new array to avoid mutating state during sort
          .sort((a, b) => {
            if (filter === "gold") return b.gold - a.gold;
            if (filter === "silver") return b.silver - a.silver;
            if (filter === "bronze") return b.bronze - a.bronze;
            return b.total - a.total; // Default sort by total medals
          })
          .map((country, index) => (
            <Col md={3} key={country.id || index} style={{ marginBottom: "20px" }}>
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
                <Card.Img
                  variant="top"
                  src={country.flag}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{country.name}</Card.Title>
                  <p>🥇 {country.gold}</p>
                  <p>🥈 {country.silver}</p>
                  <p>🥉 {country.bronze}</p>
                  <hr style={{ borderColor: "#555" }} />
                  <p style={{ fontWeight: "bold" }}>Total: {country.total}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default Countries;