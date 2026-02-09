import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJson } from "../services/api";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "../styles//AthleteDetails.css"; 

function AthleteDetails() {
  const { name, sport } = useParams();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pathName = encodeURIComponent(name || "") + (sport ? `/${encodeURIComponent(sport)}` : "");
    fetchJson(`/athlete-details/${pathName}`)
      .then(setAthlete)
      .catch(err => setError(err.message));
  }, [name, sport]);

  if (error) return (
    <Container className="text-center" style={{ paddingTop: "150px" }}>
      <h3 style={{ color: "#ff4d4d" }}>Error: {error}</h3>
      <Button variant="outline-light" onClick={() => navigate(-1)}>Go Back</Button>
    </Container>
  );

  if (!athlete) return (
    <Container className="text-center" style={{ paddingTop: "150px" }}>
      <Spinner animation="border" variant="danger" />
      <p className="mt-3" style={{ color: "white" }}>Loading athlete profile...</p>
    </Container>
  );

  return (
    <div className="athlete-detail-page">
      <Container>
        <Button 
          variant="link" 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          ← Back to Athletes
        </Button>

        <Row className="athlete-hero-section align-items-center">
          <Col md={5} lg={4} className="text-center mb-4 mb-md-0">
            <div className="athlete-image-wrapper">
              <img 
                src={athlete.image || "/images/fallback-athlete.png"} 
                alt={athlete.name} 
                className="athlete-profile-img" 
              />
            </div>
          </Col>
          
          <Col md={7} lg={8} className="athlete-info-text">
            <h1 className="athlete-name-title">{athlete.name}</h1>
            <div className="athlete-meta-info">
              <span className="sport-badge">{athlete.sport}</span>
              <span className="meta-divider">|</span>
              <span className="country-text">{athlete.country}</span>
            </div>

            <div className="medal-grid">
              <div className="medal-item gold">
                <span className="medal-icon">🥇</span> 
                <span className="medal-count">{athlete.medals?.gold ?? 0}</span>
              </div>
              <div className="medal-item silver">
                <span className="medal-icon">🥈</span> 
                <span className="medal-count">{athlete.medals?.silver ?? 0}</span>
              </div>
              <div className="medal-item bronze">
                <span className="medal-icon">🥉</span> 
                <span className="medal-count">{athlete.medals?.bronze ?? 0}</span>
              </div>
            </div>

            <div className="biography-section">
              <h3 className="section-label">Biography</h3>
              <p className="bio-text">{athlete.highlight || "Olympic medalist with outstanding international performance."}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AthleteDetails;