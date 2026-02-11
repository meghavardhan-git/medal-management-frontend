import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJson, fetchAthleteWiki } from "../services/api";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "../styles/AthleteDetails.css";

function AthleteDetails() {
  const { name, sport } = useParams();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAthleteData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ===== 1️⃣ Fetch Kaggle athlete data =====
        const pathName =
          encodeURIComponent(name || "") +
          (sport ? `/${encodeURIComponent(sport)}` : "");

        const athleteData = await fetchJson(
          `/athlete-details/${pathName}`
        );

        setAthlete(athleteData);

        // ===== 2️⃣ Fetch Wikipedia data using shared API function =====
        try {
          const wikiJson = await fetchAthleteWiki(athleteData.name);
          setWikiData(wikiJson);
        } catch {
          // Wiki failing should NOT break page
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
    );
  }

  /* ===== Loading State ===== */
  if (loading || !athlete) {
    return (
      <Container className="text-center" style={{ paddingTop: "150px" }}>
        <Spinner animation="border" variant="danger" />
        <p className="mt-3" style={{ color: "white" }}>
          Loading athlete profile...
        </p>
      </Container>
    );
  }

  return (
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
                src={
                  wikiData?.image ||
                  athlete.image ||
                  "/images/fallback-image.png"
                }
                alt={athlete.name}
                className="athlete-profile-img"
                onError={(e) => {
                  e.target.src = "/images/fallback-card.png";
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
  );
}

export default AthleteDetails;