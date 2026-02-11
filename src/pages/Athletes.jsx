import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAthletes } from "../services/api";

function Athletes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort");

  // State
  const [athletes, setAthletes] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const response = await getAthletes({
          page,
          search,
          sort: sortBy,
        });

        const newAthletes = response.data;

        setAthletes((prev) =>
          page === 1 ? newAthletes : [...prev, ...newAthletes]
        );

        setHasMore(newAthletes.length >= 10);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [page, search, sortBy]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Athletes</h2>

      {/* Big Search Bar */}
      <Row className="mb-4">
        <Col md={12}>
          <Form.Control
            placeholder="Search athletes by name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              color: "#000",
              border: "1px solid #ccc",
              padding: "14px 18px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          />
        </Col>
      </Row>

      {/* Athlete Grid */}
      <Row>
        {athletes.map((athlete, idx) => (
          <Col
            md={3}
            sm={6}
            key={athlete.id || athlete.name || idx}
            className="mb-4"
          >
            <Card
              className="netflix-card"
              onClick={() =>
                navigate(
                  `/athletes/${encodeURIComponent(
                    athlete.name
                  )}/${encodeURIComponent(athlete.sport)}`
                )
              }
              style={{
                backgroundColor: "#1f1f1f",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Card.Img
                variant="top"
                src={athlete.image || "/images/fallback-card.png"}
                alt={athlete.name}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/fallback-card.png";
                }}
              />

              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {athlete.name}
                </Card.Title>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                  {athlete.sport} • {athlete.country}
                </p>
                <div style={{ display: "flex", gap: "12px", fontWeight: "600" }}>
                    <span style={{ color: "#FFD700" }}>
                      🥇 {athlete.gold || 0}
                    </span>
                    <span style={{ color: "#C0C0C0" }}>
                      🥈 {athlete.silver || 0}
                    </span>
                    <span style={{ color: "#CD7F32" }}>
                      🥉 {athlete.bronze || 0}
                    </span>
                  </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Loading / Pagination */}
      <div className="text-center mt-4 mb-5">
        {loading && (
          <Spinner animation="border" variant="danger" className="mb-3" />
        )}

        {!loading && hasMore && (
          <Button
            variant="outline-light"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </Button>
        )}

        {!hasMore && athletes.length > 0 && (
          <p style={{ color: "#777" }}>
            You've reached the end of the list.
          </p>
        )}

        {!loading && athletes.length === 0 && (
          <p style={{ color: "#777" }}>No athletes found.</p>
        )}
      </div>
    </Container>
  );
}

export default Athletes;