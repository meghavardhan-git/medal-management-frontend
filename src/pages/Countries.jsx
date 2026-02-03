import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// 1. Updated Data with 'total' field
const countries = [
  {
    name: "USA",
    flag: "https://flagcdn.com/w320/us.png",
    gold: 39,
    silver: 41,
    bronze: 33,
    total: 113,
  },
  {
    name: "China",
    flag: "https://flagcdn.com/w320/cn.png",
    gold: 38,
    silver: 32,
    bronze: 18,
    total: 88,
  },
  {
    name: "Japan",
    flag: "https://flagcdn.com/w320/jp.png",
    gold: 27,
    silver: 14,
    bronze: 17,
    total: 58,
  },
  {
    name: "India",
    flag: "https://flagcdn.com/w320/in.png",
    gold: 7,
    silver: 9,
    bronze: 11,
    total: 27,
  },
];

function Countries() {
  // 2. Initialize Hooks
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  return (
    <Container style={{ paddingTop: "100px" }}>
      <h2 style={{ color: "white", marginBottom: "30px" }}>
        Countries & Medal Statistics
      </h2>

      {/* 3. Filter Buttons UI */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          className="btn btn-outline-light me-2"
        >
          All
        </button>
        <button
          onClick={() => setFilter("gold")}
          className="btn btn-outline-warning me-2"
        >
          🥇 Gold
        </button>
        <button
          onClick={() => setFilter("silver")}
          className="btn btn-outline-secondary me-2"
        >
          🥈 Silver
        </button>
        <button
          onClick={() => setFilter("bronze")}
          className="btn btn-outline-danger"
        >
          🥉 Bronze
        </button>
      </div>

      <Row>
        {/* 4. Sorting and Mapping Logic */}
        {countries
          .sort((a, b) => {
            if (filter === "gold") return b.gold - a.gold;
            if (filter === "silver") return b.silver - a.silver;
            if (filter === "bronze") return b.bronze - a.bronze;
            return b.total - a.total; // Default sort by total medals
          })
          .map((country, index) => (
            <Col md={3} key={index} style={{ marginBottom: "20px" }}>
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