import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  Table
} from "react-bootstrap";
import {
  fetchJson,
  fetchAthleteWiki,
  getAthleteMedalTimeline
} from "../services/api";
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
   Image Helper
-------------------*/
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
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState(null);

  // Medal Timeline State
  const [showModal, setShowModal] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState("");

  useEffect(() => {
    const loadAthleteData = async () => {
      try {
        setLoading(true);
        const path =
          encodeURIComponent(name) +
          (sport ? `/${encodeURIComponent(sport)}` : "");

        const athleteData = await fetchJson(`/athlete-details/${path}`);
        setAthlete(athleteData);
        setFavorite(isFavorite(athleteData));

        try {
          const wiki = await fetchAthleteWiki(athleteData.name);
          setWikiData(wiki);
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

  const openTimeline = async (medalType) => {
    setSelectedMedal(medalType);
    setShowModal(true);
    setTimeline([]);
    setTimelineLoading(true);

    try {
      const data = await getAthleteMedalTimeline(name, medalType);
      setTimeline(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimelineLoading(false);
    }
  };

  if (error) {
    return (
      <div className="athlete-detail-page">
        <Container className="text-center">
          <h3 style={{ color: "#ff4d4d" }}>Error: {error}</h3>
          <Button className="back-button" onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
        <Footer />
      </div>
    );
  }

  if (loading || !athlete) {
    return (
      <div className="athlete-detail-page">
        <Container className="text-center">
          <Spinner animation="border" variant="danger" />
        </Container>
        <Footer />
      </div>
    );
  }

  const resolvedImage =
    wikiData?.image ||
    athlete.image ||
    getSportImage(athlete.sport) ||
    "/images/fallback-card.png";

  return (
    <>
      <div className="athlete-detail-page">
        <Container>
          <Button variant="link" className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </Button>

          <div className="athlete-hero-section">
            <Row className="align-items-center">
              <Col md={4} className="text-center">
                <div className="athlete-image-wrapper">
                  <img
                    src={resolvedImage}
                    alt={athlete.name}
                    className="athlete-profile-img"
                  />
                </div>
              </Col>

              <Col md={8}>
                <h1 className="athlete-name-title">{athlete.name}</h1>
                
                <div className="athlete-meta-info">
                  <span className="sport-badge">{athlete.sport}</span>
                  <span className="country-text">• {athlete.country}</span>
                </div>

                <Button
                  variant={favorite ? "danger" : "outline-light"}
                  onClick={() => setFavorite(toggleFavorite(athlete))}
                  className="mb-3"
                >
                  {favorite ? "❤️ Favorite" : "🤍 Add Favorite"}
                </Button>

                <div className="medal-grid">
                  <div className="medal-item gold" onClick={() => openTimeline("gold")} style={{cursor: 'pointer'}}>
                    🥇 {athlete.medals.gold}
                  </div>
                  <div className="medal-item silver" onClick={() => openTimeline("silver")} style={{cursor: 'pointer'}}>
                    🥈 {athlete.medals.silver}
                  </div>
                  <div className="medal-item bronze" onClick={() => openTimeline("bronze")} style={{cursor: 'pointer'}}>
                    🥉 {athlete.medals.bronze}
                  </div>
                </div>

                <h3 className="section-label">Biography</h3>
                <p className="bio-text">
                  {wikiData?.summary || athlete.highlight}
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMedal.toUpperCase()} Medal Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {timelineLoading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : timeline.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Sport</th>
                  <th>Event</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((t, i) => (
                  <tr key={i}>
                    <td>{t.year}</td>
                    <td>{t.sport}</td>
                    <td>{t.event}</td>
                    <td>{t.country}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}

export default AthleteDetails;