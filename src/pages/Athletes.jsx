import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
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
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    if (athlete.image) return athlete.image;

    const athleteImg = getAthleteImage(athlete.name);
    if (athleteImg && !athleteImg.includes("fallback-card")) {
      return athleteImg;
    }

    const sportImg = getSportImage(athlete.sport);
    if (sportImg) return sportImg;

    return "/images/fallback-card.png";
  };

  // 🔥 Fetch athletes
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

  // 🔥 Generate unique suggestions (Name, Country, Sport)
  const suggestions = useMemo(() => {
    if (!search) return [];

    const lowerSearch = search.toLowerCase();

    const nameMatches = athletes
      .filter((a) => a.name.toLowerCase().includes(lowerSearch))
      .map((a) => ({ type: "name", value: a.name }));

    const countryMatches = [
      ...new Set(
        athletes
          .filter((a) =>
            a.country?.toLowerCase().includes(lowerSearch)
          )
          .map((a) => a.country)
      ),
    ].map((country) => ({ type: "country", value: country }));

    const sportMatches = [
      ...new Set(
        athletes
          .filter((a) =>
            a.sport?.toLowerCase().includes(lowerSearch)
          )
          .map((a) => a.sport)
      ),
    ].map((sport) => ({ type: "sport", value: sport }));

    return [...nameMatches, ...countryMatches, ...sportMatches].slice(0, 8);
  }, [search, athletes]);

  // 🔥 Filtered athletes display logic
  const filteredAthletes = useMemo(() => {
    if (!selectedFilter) return athletes;

    if (selectedFilter.type === "country") {
      return athletes.filter(
        (a) => a.country === selectedFilter.value
      );
    }

    if (selectedFilter.type === "sport") {
      return athletes.filter(
        (a) => a.sport === selectedFilter.value
      );
    }

    if (selectedFilter.type === "name") {
      return athletes.filter(
        (a) => a.name === selectedFilter.value
      );
    }

    return athletes;
  }, [selectedFilter, athletes]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setSelectedFilter(null);
    setShowSuggestions(true);
    setPage(1);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedFilter(suggestion);
    setSearch(suggestion.value);
    setShowSuggestions(false);
  };

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Athletes</h2>

      {/* 🔥 Search Bar */}
      <Row className="mb-3">
        <Col md={12} style={{ position: "relative" }}>
          <Form.Control
            placeholder="Search by name, country or sport..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            style={{
              backgroundColor: "#ffffff",
              color: "#000",
              padding: "14px 18px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          />

          {/* 🔥 Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ListGroup
              style={{
                position: "absolute",
                width: "100%",
                zIndex: 999,
              }}
            >
              {suggestions.map((s, idx) => (
                <ListGroup.Item
                  key={idx}
                  action
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.type === "country" && "🌍 "}
                  {s.type === "sport" && "🏅 "}
                  {s.type === "name" && "👤 "}
                  {s.value}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Athlete Grid */}
      <Row>
        {filteredAthletes.map((athlete, idx) => (
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

      {/* Pagination */}
      <div className="text-center mt-4 mb-5">
        {loading && (
          <Spinner animation="border" variant="danger" className="mb-3" />
        )}

        {!loading && hasMore && !selectedFilter && (
          <Button
            variant="outline-light"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </Button>
        )}

        {!loading && filteredAthletes.length === 0 && (
          <p style={{ color: "#777" }}>No athletes found.</p>
        )}
      </div>
    </Container>
  );
}

export default Athletes;