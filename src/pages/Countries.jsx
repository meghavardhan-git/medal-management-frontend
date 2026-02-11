import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCountries } from "../services/api";
import CountryCard from "../components/CountryCard";
import Footer from "../components/Footer";
import "../styles/cards.css";
import "../styles/searchBar.css";

function Countries() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 20;

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

        console.log("Normalized countries:", normalized);
        setCountries(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
        setError("Could not load medal statistics.");
        setLoading(false);
      });
  }, []);

  // ✅ Sorting logic with search filter
  const sortedCountries = useMemo(() => {
    // First filter by search query
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered];

    if (sortBy === "gold") return sorted.sort((a, b) => b.gold - a.gold);
    if (sortBy === "silver") return sorted.sort((a, b) => b.silver - a.silver);
    if (sortBy === "bronze") return sorted.sort((a, b) => b.bronze - a.bronze);

    return sorted.sort((a, b) => b.total - a.total);
  }, [countries, sortBy, searchQuery]);

  const handleSortChange = (type) => {
    setSearchParams({ sort: type });
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search

    if (query.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      const suggestions = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(query.toLowerCase()) ||
          country.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (countryName) => {
    setSearchQuery(countryName);
    setShowSuggestions(false);
    setCurrentPage(1); 
  };

  const totalPages = Math.ceil(sortedCountries.length / countriesPerPage);
  const startIndex = (currentPage - 1) * countriesPerPage;
  const paginatedCountries = sortedCountries.slice(
    startIndex,
    startIndex + countriesPerPage
  );

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
    <>
    <Container style={{ paddingTop: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "white", margin: 0 }}>
          Countries & Medal Statistics
        </h2>

        {/* ✅ Search Bar - Right Side */}
        <div style={{ position: "relative", width: "250px" }}>
          <input
            type="text"
            placeholder="Search countries"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-bar-input"
            style={{
              width: "100%",
              backgroundColor: "#1a1a1a",
              color: "white",
              borderColor: "#444",
              border: "1px solid #444",
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "4px"
            }}
          />

          {/* ✅ Auto-fill Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              className="suggestions-dropdown"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000
              }}
            >
              {filteredSuggestions.slice(0, 5).map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleSelectSuggestion(country.name)}
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    cursor: "pointer",
                    borderBottom: "1px solid #333",
                    fontSize: "14px",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  {country.name} ({country.code})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
      {sortedCountries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#aaa", fontSize: "18px" }}>
            No countries found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <Row className="g-4" style={{ marginBottom: "30px" }}>
            {paginatedCountries.map((country) => (
              <Col
                key={country.code}
                lg={3}
                md={6}
                sm={12}
                xs={12}
              >
                <div className="netflix-card-container" style={{ height: "100%" }}>
                  <div
                    className="netflix-zoom-card"
                    onClick={() => navigate(`/countries/${country.code}`)}
                    style={{ height: "100%" }}
                  >
                    <CountryCard country={country} />
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "40px",
                marginBottom: "40px"
              }}
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline-light"
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                ← Previous
              </button>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn ${
                      currentPage === page ? "btn-light" : "btn-outline-light"
                    }`}
                    style={{
                      minWidth: "40px",
                      padding: "6px 10px",
                      fontSize: "14px"
                    }}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 10 && (
                  <span style={{ color: "#aaa", fontSize: "14px", margin: "0 5px" }}>
                    ...
                  </span>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline-light"
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next →
              </button>

              <span style={{ color: "#aaa", marginLeft: "20px", fontSize: "14px" }}>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </Container>
    <Footer />
    </>
  );
}

export default Countries;
