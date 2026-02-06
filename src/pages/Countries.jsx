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
  
  // URL Search Params for sorting
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

  //  Derived sorting using useMemo
  const sortedCountries = useMemo(() => {
    const sorted = [...countries];
    if (sortBy === "gold") return sorted.sort((a, b) => b.gold - a.gold);
    if (sortBy === "silver") return sorted.sort((a, b) => b.silver - a.silver);
    if (sortBy === "bronze") return sorted.sort((a, b) => b.bronze - a.bronze);
    return sorted.sort((a, b) => b.total - a.total); // Default/All
  }, [countries, sortBy]);

  // Helper to change sort via URL
  const handleSortChange = (type) => {
    setSearchParams({ sort: type });
  };

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

      {/* Filter Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => handleSortChange("all")}
          className={`btn me-2 ${sortBy === "all" ? "btn-light" : "btn-outline-light"}`}
        >
          All
        </button>
        <button
          onClick={() => handleSortChange("gold")}
          className={`btn me-2 ${sortBy === "gold" ? "btn-warning" : "btn-outline-warning"}`}
        >
          🥇 Gold
        </button>
        <button
          onClick={() => handleSortChange("silver")}
          className={`btn me-2 ${sortBy === "silver" ? "btn-secondary" : "btn-outline-secondary"}`}
        >
          🥈 Silver
        </button>
        <button
          onClick={() => handleSortChange("bronze")}
          className={`btn ${sortBy === "bronze" ? "btn-danger" : "btn-outline-danger"}`}
        >
          🥉 Bronze
        </button>
      </div>

      <Row>
        {/* Render sortedCountries */}
        {sortedCountries.map((country) => (
          <Col md={3} sm={6} xs={12} key={country.id || country.code} style={{ marginBottom: "30px" }}>
            <div className="netflix-card-wrapper">
               <CountryCard
                country={country}
                onClick={() => navigate(`/countries/${country.code || country.name}`)}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Countries;