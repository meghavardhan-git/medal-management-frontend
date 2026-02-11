import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { countryImages } from "../utils/countryImages";
import { athleteImages, getAthleteImage } from "../utils/athleteImages";
import { sportImages } from "../utils/sportImages";

function Favorites() {
  const navigate = useNavigate();

  const favoriteCountries =
    JSON.parse(localStorage.getItem("favoriteCountries")) || [];

  const favoriteAthletes =
    JSON.parse(localStorage.getItem("favoriteAthletes")) || [];

  const favoriteSports =
    JSON.parse(localStorage.getItem("favoriteSports")) || [];

  const isEmpty =
    favoriteCountries.length === 0 &&
    favoriteAthletes.length === 0 &&
    favoriteSports.length === 0;

  /* =========================
     IMAGE FALLBACK HELPERS
  ==========================*/

  // Case-insensitive sport image match
  const getSportImage = (sport) => {
    if (!sport) return null;

    const match = Object.keys(sportImages).find(
      (key) => key.toLowerCase() === sport.toLowerCase()
    );

    return match ? sportImages[match] : null;
  };

  // Athlete fallback strategy (same as Home)
  const resolveAthleteImage = (athlete) => {
    // 1️⃣ Direct athlete map
    if (athleteImages[athlete.name])
      return athleteImages[athlete.name];

    // 2️⃣ getAthleteImage helper
    const mapped = getAthleteImage(athlete.name);
    if (mapped && !mapped.includes("fallback-card"))
      return mapped;

    // 3️⃣ Sport fallback
    const sportFallback = getSportImage(athlete.sport);
    if (sportFallback) return sportFallback;

    // 4️⃣ Final fallback
    return "/images/fallback-card.png";
  };

  if (isEmpty) {
    return (
      <Container style={{ paddingTop: "100px", color: "#777" }}>
        <h4>No favorites added yet.</h4>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <h2 className="mb-5 text-white">❤️ Favorites</h2>

      {/* =======================
           COUNTRIES
         ======================= */}
      {favoriteCountries.length > 0 && (
        <>
          <h4 className="text-white mb-3">Countries</h4>
          <Row className="mb-5">
            {favoriteCountries.map((c) => (
              <Col md={3} sm={6} key={c.noc} className="mb-4">
                <Card
                  className="netflix-card"
                  style={{
                    cursor: "pointer",
                    background: "#1f1f1f",
                    border: "none",
                  }}
                  onClick={() => navigate(`/countries/${c.noc}`)}
                >
                  <Card.Img
                    src={countryImages[c.noc]}
                    onError={(e) =>
                      (e.target.src = "/images/fallback-flag.png")
                    }
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="text-white">
                      {c.country}
                    </Card.Title>
                    <p style={{ color: "#aaa" }}>
                      🥇 {c.gold} 🥈 {c.silver} 🥉 {c.bronze}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* =======================
           ATHLETES
         ======================= */}
      {favoriteAthletes.length > 0 && (
        <>
          <h4 className="text-white mb-3">Athletes</h4>
          <Row className="mb-5">
            {favoriteAthletes.map((a, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <Card
                  className="netflix-card"
                  style={{
                    cursor: "pointer",
                    background: "#1f1f1f",
                    border: "none",
                  }}
                  onClick={() =>
                    navigate(
                      `/athletes/${encodeURIComponent(
                        a.name
                      )}/${encodeURIComponent(a.sport)}`
                    )
                  }
                >
                  <Card.Img
                    src={resolveAthleteImage(a)}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="text-white">
                      {a.name}
                    </Card.Title>
                    <p style={{ color: "#aaa" }}>{a.country}</p>
                    <p style={{ color: "chocolate" }}>
                      🥇 {a.medals?.gold ?? 0} 🥈{" "}
                      {a.medals?.silver ?? 0} 🥉{" "}
                      {a.medals?.bronze ?? 0}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* =======================
           SPORTS
         ======================= */}
      {favoriteSports.length > 0 && (
        <>
          <h4 className="text-white mb-3">Sports</h4>
          <Row>
            {favoriteSports.map((sport, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <Card
                  className="netflix-card"
                  style={{
                    cursor: "pointer",
                    background: "#1f1f1f",
                    border: "none",
                  }}
                  onClick={() =>
                    navigate(`/sports/${encodeURIComponent(sport)}`)
                  }
                >
                  <Card.Img
                    src={
                      getSportImage(sport) ||
                      "/images/fallback-card.png"
                    }
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="text-white text-center">
                      {sport}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Favorites;