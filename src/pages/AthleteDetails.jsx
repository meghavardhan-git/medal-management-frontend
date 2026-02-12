import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJson, fetchAthleteWiki } from "../services/api";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import Footer from "../components/Footer";
import { sportImages } from "../utils/sportImages";
import "../styles/AthleteDetails.css";

/* ------------------
   Favorites Helpers
-------------------*/
const FAVORITES_KEY = "favoriteAthletes";

const getFavorites = () =>
  JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

const isFavorite = (athlete) =>
  getFavorites().some(
    (a) => a.name === athlete.name && a.sport === athlete.sport
  );

const toggleFavorite = (athlete) => {
  const favorites = getFavorites();

  const exists = favorites.some(
    (a) => a.name === athlete.name && a.sport === athlete.sport
  );

  const updated = exists
    ? favorites.filter(
        (a) => !(a.name === athlete.name && a.sport === athlete.sport)
      )
    : [...favorites, athlete];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
};

/* ------------------
   Image Helpers
-------------------*/

// ✅ Case-insensitive sport image resolver
const getSportImage = (sport) => {
  if (!sport) return null;

  const match = Object.keys(sportImages).find(
    (key) => key.toLowerCase() === sport.toLowerCase()
  );

  return match ? sportImages[match] : null;
};

function AthleteDetails() {
  const { name, sport } = useParams();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const loadAthleteData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pathName =
          encodeURIComponent(name || "") +
          (sport ? `/${encodeURIComponent(sport)}` : "");

        const athleteData = await fetchJson(
          `/athlete-details/${pathName}`
        );

        setAthlete(athleteData);
        setFavorite(isFavorite(athleteData));

        try {
          const wikiJson = await fetchAthleteWiki(athleteData.name);
          setWikiData(wikiJson);
        } catch {
          setWikiData(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAthleteData();
  }, [name, sport]);

  /* ===== Error State ===== */
  if (error) {
    return (
      <>
        <Container className="text-center" style={{ paddingTop: "150px" }}>
          <h3 style={{ color: "#ff4d4d" }}>Error: {error}</h3>
          <Button
            variant="outline-light"
            className="mt-3"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  /* ===== Loading State ===== */
  if (loading || !athlete) {
    return (
      <>
        <Container className="text-center" style={{ paddingTop: "150px" }}>
          <Spinner animation="border" variant="danger" />
          <p className="mt-3" style={{ color: "white" }}>
            Loading athlete profile...
          </p>
        </Container>
        <Footer />
      </>
    );
  }

  // ✅ FINAL IMAGE RESOLUTION ORDER
  const resolvedImage =
    wikiData?.image ||
    athlete.image ||
    getSportImage(athlete.sport) ||
    "/images/fallback-card.png";

  return (
    <>
      <div className="athlete-detail-page">
        <Container>
          {/* Back Button */}
          <Button
            variant="link"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back to Athletes
          </Button>

          <Row className="athlete-hero-section align-items-center">
            {/* Image */}
            <Col md={5} lg={4} className="text-center mb-4 mb-md-0">
              <div className="athlete-image-wrapper">
                <img
                  src={resolvedImage}
                  alt={athlete.name}
                  className="athlete-profile-img"
                  onError={(e) => {
                    e.target.src =
                      getSportImage(athlete.sport) ||
                      "/images/fallback-card.png";
                  }}
                />
              </div>
            </Col>

            {/* Info */}
            <Col md={7} lg={8}>
              <h1 className="athlete-name-title">{athlete.name}</h1>

              <div className="athlete-meta-info">
                <span className="sport-badge">{athlete.sport}</span>
                <span>|</span>
                <span className="country-text">{athlete.country}</span>
              </div>

              {/* ⭐ FAVORITE BUTTON */}
              <Button
                variant={favorite ? "outline-danger" : "outline-light"}
                className="mt-3 mb-4 px-4 py-2"
                onClick={() => {
                  const newState = toggleFavorite(athlete);
                  setFavorite(newState);
                }}
              >
                {favorite
                  ? "❤️ Remove from Favorites"
                  : "🤍 Add to Favorites"}
              </Button>

              {/* Medals */}
              <div className="medal-grid">
                <div className="medal-item gold">
                  <span>🥇</span>
                  <span>{athlete.medals?.gold ?? 0}</span>
                </div>

                <div className="medal-item silver">
                  <span>🥈</span>
                  <span>{athlete.medals?.silver ?? 0}</span>
                </div>

                <div className="medal-item bronze">
                  <span>🥉</span>
                  <span>{athlete.medals?.bronze ?? 0}</span>
                </div>
              </div>

              {/* Biography */}
              <div className="biography-section">
                <h3 className="section-label">Biography</h3>
                <p className="bio-text">
                  {wikiData?.summary ||
                    athlete.highlight ||
                    "Olympic medalist with outstanding international performance."}
                </p>

                {wikiData?.pageUrl && (
                  <a
                    href={wikiData.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="wiki-link"
                  >
                    View Full Profile on Wikipedia →
                  </a>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ Footer Added */}
      <Footer />
    </>
  );
}

export default AthleteDetails;
