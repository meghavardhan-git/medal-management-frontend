import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Spinner, Button, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { getCountries, getCountrySummary, getCountryMedalTimeline } from "../services/api";
import { countryImages } from "../utils/countryImages";
import "../styles/CountryDetails.css";
import MedalTimelineModal from "../components/MedalTimelineModal";

ChartJS.register(ArcElement, Tooltip, Legend);

// ------------------
// Favorites helpers
// ------------------
const FAVORITES_KEY = "favoriteCountries";

const getFavorites = () =>
  JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

const isFavorite = (noc) =>
  getFavorites().some((c) => c.noc === noc);

const toggleFavorite = (country) => {
  const favorites = getFavorites();
  const exists = favorites.some((c) => c.noc === country.noc);

  const updated = exists
    ? favorites.filter((c) => c.noc !== country.noc)
    : [...favorites, country];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
};

function CountryDetails() {
  const { noc } = useParams();

  const [country, setCountry] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal & Timeline State
  const [showModal, setShowModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState("");

  // ------------------
  // Load country data
  // ------------------
  useEffect(() => {
    async function loadCountry() {
      try {
        setLoading(true);
        const countries = await getCountries();

        const found = countries.find(
          (c) => c.noc.toUpperCase() === noc.toUpperCase()
        );

        if (!found) {
          setError("Country not found");
          return;
        }

        setCountry(found);
        setFavorite(isFavorite(found.noc));
      } catch (err) {
        console.error(err);
        setError("Failed to load country details");
      } finally {
        setLoading(false);
      }
    }

    loadCountry();
  }, [noc]);

  // ------------------
  // Actions
  // ------------------
  const handleLoadSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummary("");
      const res = await getCountrySummary(noc);
      setSummary(res.summary);
    } catch (err) {
      console.error(err);
      setSummary("AI summary is currently unavailable.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const openMedalTimeline = async (medal) => {
    try {
      setSelectedMedal(medal);
      setShowModal(true);
      setTimelineLoading(true);

      const data = await getCountryMedalTimeline(noc, medal);
      setTimelineData(data);
    } catch (err) {
      console.error(err);
      setTimelineData([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;
  if (!country) return null;

  const pieData = {
    labels: ["Gold", "Silver", "Bronze"],
    datasets: [
      {
        data: [country.gold, country.silver, country.bronze],
        backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Container className="country-details-container">
      <Card className="details-card">
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start">
            <img
              src={countryImages[country.noc]}
              alt={country.country}
              className="country-flag"
              onError={(e) => (e.target.src = "/images/fallback-flag.png")}
            />
          </Col>

          <Col md={8}>
            <div className="info-section">
              <h2 className="country-name">{country.country}</h2>
              <p className="noc-tag">NOC Code: {country.noc}</p>

              {/* 3.4 Clickable Medal Section */}
              <div className="medal-count">
                <span className="medal clickable" onClick={() => openMedalTimeline("gold")}>
                  🥇 {country.gold}
                </span>
                <span className="medal clickable" onClick={() => openMedalTimeline("silver")}>
                  🥈 {country.silver}
                </span>
                <span className="medal clickable" onClick={() => openMedalTimeline("bronze")}>
                  🥉 {country.bronze}
                </span>
              </div>

              <Button
                variant={favorite ? "outline-danger" : "outline-light"}
                className="me-3 mb-3 py-2"
                onClick={() => {
                  const newState = toggleFavorite(country);
                  setFavorite(newState);
                }}
              >
                {favorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
              </Button>

              <Button
                variant="danger"
                className="ai-button mb-3"
                onClick={handleLoadSummary}
                disabled={summaryLoading}
              >
                {summaryLoading ? "Analyzing Data..." : "Generate AI Insights"}
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={5} className="mx-auto">
            <div className="chart-wrapper">
              <h5 className="text-center mb-4" style={{ color: "#e71414" }}>
                Medal Distribution
              </h5>
              <Pie data={pieData} options={{ maintainAspectRatio: true }} />
            </div>
          </Col>

          {summary && (
            <Col lg={7}>
              <div className="summary-box">
                <h5>AI Summary</h5>
                <p className="summary-text">{summary}</p>
              </div>
            </Col>
          )}
        </Row>
      </Card>

      {/* 3.5 Medal Timeline Modal */}
      <MedalTimelineModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={`${country.country} – ${selectedMedal.toUpperCase()} Medal History`}
        data={timelineData}
        loading={timelineLoading}
      />
    </Container>
  );
}

export default CountryDetails;