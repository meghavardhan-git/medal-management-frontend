import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCountries } from "../services/api";
import CountryCard from "../components/CountryCard";
import "../styles/cards.css";

function Countries() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") || "all";

  // ✅ Fetch & normalize backend data
  useEffect(() => {
    getCountries()
      .then((data) => {
        const normalized = data.map((c) => ({
          code: c.noc,                 // normalize noc → code
          name: c.country,             // normalize country → name
          gold: c.gold,
          silver: c.silver,
          bronze: c.bronze,
          total: c.gold + c.silver + c.bronze
        }));

        setCountries(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
        setError("Could not load medal statistics.");
        setLoading(false);
      });
  }, []);

  // ✅ Sorting logic
  const sortedCountries = useMemo(() => {
    const sorted = [...countries];

    if (sortBy === "gold") return sorted.sort((a, b) => b.gold - a.gold);
    if (sortBy === "silver") return sorted.sort((a, b) => b.silver - a.silver);
    if (sortBy === "bronze") return sorted.sort((a, b) => b.bronze - a.bronze);

    return sorted.sort((a, b) => b.total - a.total);
  }, [countries, sortBy]);

  const handleSortChange = (type) => {
    setSearchParams({ sort: type });
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: "100px" }}>
        <Spinner animation="border" variant="light" />
        <p style={{ color: "white", marginTop: "10px" }}>
          Loading countries...
        </p>
      </Container>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <Container className="text-center" style={{ paddingTop: "100px" }}>
        <p style={{ color: "red" }}>{error}</p>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px" }}>
      <h2 style={{ color: "white", marginBottom: "30px" }}>
        Countries & Medal Statistics
      </h2>

      {/* ✅ Sorting Controls */}
      <div style={{ marginBottom: "30px" }}>
        {["all", "gold", "silver", "bronze"].map((type) => (
          <button
            key={type}
            onClick={() => handleSortChange(type)}
            className={`btn me-2 ${
              sortBy === type ? "btn-light" : "btn-outline-light"
            }`}
            style={{ textTransform: "capitalize" }}
          >
            {type === "all"
              ? "All"
              : `${type === "gold" ? "🥇" : type === "silver" ? "🥈" : "🥉"} ${type}`}
          </button>
        ))}
      </div>

      {/* ✅ Country Cards Grid */}
      <Row>
        {sortedCountries.map((country) => (
          <Col
            key={country.code}
            md={3}
            sm={6}
            xs={12}
            style={{ marginBottom: "30px" }}
          >
            <div className="netflix-card-container">
              <div
                className="netflix-zoom-card"
                onClick={() => navigate(`/countries/${country.code}`)}
              >
                <CountryCard country={country} />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Countries;
