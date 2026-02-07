import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCountries } from "../services/api"; 
import CountryCard from "../components/CountryCard";
import "../styles/cards.css"; // Ensure path is correct

function Countries() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Manage Sorting via URL Query Params
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") || "all"; 

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

  // 2. Derived Sorting Logic (Efficiency & Immutability)
  const sortedCountries = useMemo(() => {
    const sorted = [...countries]; // Create copy to avoid mutation
    if (sortBy === "gold") return sorted.sort((a, b) => b.gold - a.gold);
    if (sortBy === "silver") return sorted.sort((a, b) => b.silver - a.silver);
    if (sortBy === "bronze") return sorted.sort((a, b) => b.bronze - a.bronze);
    return sorted.sort((a, b) => b.total - a.total); 
  }, [countries, sortBy]);

  const handleSortChange = (type) => {
    setSearchParams({ sort: type });
  };

  if (loading) return (
    <Container className="text-center" style={{ paddingTop: "100px" }}>
      <Spinner animation="border" variant="light" />
      <p style={{ color: "white", marginTop: "10px" }}>Loading countries...</p>
    </Container>
  );

  return (
    <Container style={{ paddingTop: "100px" }}>
      <h2 style={{ color: "white", marginBottom: "30px" }}>Countries & Medal Statistics</h2>

      {/* Sorting Controls */}
      <div style={{ marginBottom: "30px" }}>
        {["all", "gold", "silver", "bronze"].map((type) => (
          <button
            key={type}
            onClick={() => handleSortChange(type)}
            className={`btn me-2 ${sortBy === type ? "btn-light" : "btn-outline-light"}`}
            style={{ textTransform: 'capitalize' }}
          >
            {type === "all" ? "All" : `${type === "gold" ? "🥇" : type === "silver" ? "🥈" : "🥉"} ${type}`}
          </button>
        ))}
      </div>

      <Row>
        {sortedCountries.map((country) => (
          <Col md={3} sm={6} xs={12} key={country.id || country.code} style={{ marginBottom: "30px" }}>
            <div className="netflix-card-container">
              <div className="netflix-zoom-card">
                 <CountryCard
                  country={country}
                  onClick={() => navigate(`/countries/${country.code || country.name}`)}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Countries;