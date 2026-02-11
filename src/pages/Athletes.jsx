import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAthletes } from "../services/api";
import { getAthleteImage } from "../utils/athleteImages";
import { sportImages } from "../utils/sportImages";

function Athletes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort");

  const [athletes, setAthletes] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Case-insensitive sport fallback
  const getSportImage = (sport) => {
    if (!sport) return null;

    const match = Object.keys(sportImages).find(
      (key) => key.toLowerCase() === sport.toLowerCase()
    );

    return match ? sportImages[match] : null;
  };

  // ✅ Image priority logic
  const resolveImage = (athlete) => {
    // 1️⃣ If backend provides image
    if (athlete.image) return athlete.image;

    // 2️⃣ Try athlete image map
    const athleteImg = getAthleteImage(athlete.name);
    if (athleteImg && !athleteImg.includes("fallback-card")) {
      return athleteImg;
    }

    // 3️⃣ Try sport fallback
    const sportImg = getSportImage(athlete.sport);
    if (sportImg) return sportImg;

    // 4️⃣ Final fallback
    return "/images/fallback-card.png";
  };

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const response = await getAthletes({
          page,
          search,
          sort: sortBy,
        });

        const newAthletes = response.data || response;

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
                src={resolveImage(athlete)}
                alt={athlete.name}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    getSportImage(athlete.sport) ||
                    "/images/fallback-card.png";
                }}
              />

              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {athlete.name}
                </Card.Title>

                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                  {athlete.sport} • {athlete.country}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontWeight: "600",
                  }}
                >
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