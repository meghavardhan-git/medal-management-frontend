import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { sports } from "../data/sports";
import { countries } from "../data/countries";
import { useState, useEffect, useMemo } from "react"; // Fixed duplicate imports
import { useNavigate, useSearchParams } from "react-router-dom"; // Combined here
import { getAthletes } from "../services/api";

function Athletes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort"); // gold | silver | bronze | null

  const [athletes, setAthletes] = useState([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // 1. Fetch athletes from backend
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const data = await getAthletes();
        setAthletes(data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      }
    };
    fetchAthletes();
  }, []);

  // 2. Sort and Filter Logic (Combined for performance)
  const processedAthletes = useMemo(() => {
    // Start with a copy to avoid mutating state
    let result = [...athletes];

    // Apply Sorting based on Query Param
    if (sortBy === "gold") {
      result.sort((a, b) => (b.gold || 0) - (a.gold || 0));
    } else if (sortBy === "silver") {
      result.sort((a, b) => (b.silver || 0) - (a.silver || 0));
    } else if (sortBy === "bronze") {
      result.sort((a, b) => (b.bronze || 0) - (a.bronze || 0));
    }

    // Apply Search and Category Filters
    return result.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportFilter === "All" || a.sport === sportFilter;
      const matchesCountry = countryFilter === "All" || a.country === countryFilter;
      return matchesSearch && matchesSport && matchesCountry;
    });
  }, [athletes, sortBy, search, sportFilter, countryFilter]);

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Athletes</h2>

      {/* Filters */}
      <Row style={{ marginBottom: "30px" }}>
        <Col md={4} className="mb-2">
          <Form.Control
            placeholder="Search athlete..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          />
        </Col>

        <Col md={4} className="mb-2">
          <Form.Select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          >
            <option>All Sports</option>
            {sports.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4} className="mb-2">
          <Form.Select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          >
            <option>All Countries</option>
            {countries.map((c, i) => (
              <option key={i} value={c.code}>{c.code}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Athletes Grid */}
      <Row>
        {processedAthletes.length > 0 ? (
          processedAthletes.map((athlete) => (
            <Col md={3} sm={6} key={athlete.id} style={{ marginBottom: "25px" }}>
              <Card
                className="netflix-card" // Added the hover class
                onClick={() => navigate(`/athletes/${encodeURIComponent(athlete.name)}`)}
                style={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                <Card.Img
                  variant="top"
                  src={athlete.image || "/images/fallback-athlete.png"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "white", fontSize: "1.1rem" }}>
                    {athlete.name}
                  </Card.Title>
                  <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "5px" }}>
                    {athlete.sport} • {athlete.country}
                  </p>
                  <div style={{ fontSize: "0.85rem" }}>
                    🥇 {athlete.gold || 0} 🥈 {athlete.silver || 0} 🥉 {athlete.bronze || 0}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center mt-5">
            <p style={{ color: "#777" }}>No athletes found matching your criteria.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Athletes;