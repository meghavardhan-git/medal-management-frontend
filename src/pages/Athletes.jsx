import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { sports } from "../data/sports";
import { countries } from "../data/countries";
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
  const [sportFilter, setSportFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const response = await getAthletes({ 
          page, 
          search, 
          sport: sportFilter, 
          country: countryFilter,
          sort: sortBy 
        });

        const newAthletes = response.data;

        setAthletes(prev => (page === 1 ? newAthletes : [...prev, ...newAthletes]));
        
        if (newAthletes.length < 10) setHasMore(false);
        else setHasMore(true);

      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [page, search, sportFilter, countryFilter, sortBy]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1); 
  };

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Athletes</h2>

      {/* Filters */}
      <Row style={{ marginBottom: "30px" }}>
        <Col md={4} className="mb-2">
          <Form.Control
            placeholder="Search athlete..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          />
        </Col>

        <Col md={4} className="mb-2">
          <Form.Select
            value={sportFilter}
            onChange={(e) => handleFilterChange(setSportFilter, e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          >
            <option value="All">All Sports</option>
            {sports.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4} className="mb-2">
          <Form.Select
            value={countryFilter}
            onChange={(e) => handleFilterChange(setCountryFilter, e.target.value)}
            style={{ backgroundColor: "#2a2a2a", border: "none", color: "white" }}
          >
            <option value="All">All Countries</option>
            {countries.map((c, i) => (
              <option key={i} value={c.code}>{c.code}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Grid */}
      <Row>
        {athletes.map((athlete, idx) => (
          <Col md={3} sm={6} key={athlete.id || athlete.name || idx} style={{ marginBottom: "25px" }}>
            <Card
              className="netflix-card"
              onClick={() => navigate(`/athletes/${encodeURIComponent(athlete.name)}/${encodeURIComponent(athlete.sport)}`)}
              style={{ backgroundColor: "#1f1f1f", border: "none", cursor: "pointer" }}
            >
              <Card.Img 
                variant="top" 
                src={athlete.image || "/images/fallback-athlete.png"} 
                style={{ height: "200px", objectFit: "cover" }} 
              />
              <Card.Body>
                <Card.Title style={{ color: "white" }}>{athlete.name}</Card.Title>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>{athlete.sport} • {athlete.country}</p>
                <div>🥇 {athlete.gold || 0} 🥈 {athlete.silver || 0} 🥉 {athlete.bronze || 0}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Loading & Pagination */}
      <div className="text-center mt-4 mb-5">
        {loading && <Spinner animation="border" variant="danger" className="mb-3" />}
        
        {!loading && hasMore && (
          <Button 
            variant="outline-light" 
            onClick={() => setPage(prev => prev + 1)}
          >
            Load More
          </Button>
        )}

        {!hasMore && athletes.length > 0 && (
          <p style={{ color: "#777" }}>You've reached the end of the list.</p>
        )}
        
        {!loading && athletes.length === 0 && (
          <p style={{ color: "#777" }}>No athletes found.</p>
        )}
      </div>
    </Container>
  );
}

export default Athletes;