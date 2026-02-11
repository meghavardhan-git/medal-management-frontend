import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSports } from "../services/api";
import { sportImages } from "../utils/sportImages";
import "../styles/cards.css";
import "../styles/searchBar.css";

function Sports() {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔹 Fetch sports
  useEffect(() => {
    getSports()
      .then((data) => {
        if (Array.isArray(data)) {
          setSports(data);
          setFilteredSports(data);
        }
      })
      .catch((err) => console.error("Failed to load sports:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const filtered = sports.filter((s) =>
      s.sport.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSports(filtered);
  }, [search, sports]);

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <h2 className="text-white mb-4">Sports</h2>

      {/* 🔍 Search bar */}
      <Form.Control
        placeholder="Search sport..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
        style={{
          backgroundColor: "#2a2a2a",
          border: "none",
          color: "white",
        }}
      />

      <Row>
        {filteredSports.map((s) => (
          <Col
            md={3}
            sm={6}
            xs={12}
            key={s.sport}
            className="mb-4 netflix-card-container"
          >
            {/* 🎬 Netflix-style zoom card */}
            <Card
              className="netflix-zoom-card"
              onClick={() =>
                navigate(`/sports/${encodeURIComponent(s.sport)}`)
              }
            >
              <Card.Img
                src={sportImages[s.sport] || "/images/fallback-card.png"}
                alt={s.sport}
                style={{
                  height: "160px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "/images/fallback-card.png";
                }}
              />

              <Card.Body
                style={{
                  backgroundColor: "#1f1f1f",
                  padding: "12px",
                }}
              >
                <Card.Title
                  className="text-white text-center"
                  style={{
                    fontSize: "1rem",
                    marginBottom: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.sport}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {filteredSports.length === 0 && (
          <p className="text-muted mt-4">No sports found.</p>
        )}
      </Row>
    </Container>
  );
}

export default Sports;
