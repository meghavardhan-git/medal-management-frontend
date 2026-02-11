import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { getSportDetails } from "../services/api";
import { countryImages } from "../utils/countryImages";
import "../styles/cards.css";
import { color } from "chart.js/helpers";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function SportDetails() {
  const { sport } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSportDetails(sport)
      .then(setData)
      .catch((err) => console.error("Sport details error:", err))
      .finally(() => setLoading(false));
  }, [sport]);

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (!data) return null;

  // =======================
  // PIE: Medal distribution
  // =======================
  const totalGold = data.topCountries.reduce((a, c) => a + c.gold, 0);
  const totalSilver = data.topCountries.reduce((a, c) => a + c.silver, 0);
  const totalBronze = data.topCountries.reduce((a, c) => a + c.bronze, 0);

  const pieData = {
    labels: ["Gold", "Silver", "Bronze"],
    datasets: [
      {
        data: [totalGold, totalSilver, totalBronze],
        backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"],
        borderWidth: 0,
      },
    ],
  };

  // =======================
  // BAR: Country comparison
  // =======================
  const barData = {
    labels: data.topCountries.map((c) => c.country),
    datasets: [
      {
        label: "Gold",
        data: data.topCountries.map((c) => c.gold),
        backgroundColor: "#FFD700",
      },
      {
        label: "Silver",
        data: data.topCountries.map((c) => c.silver),
        backgroundColor: "#C0C0C0",
      },
      {
        label: "Bronze",
        data: data.topCountries.map((c) => c.bronze),
        backgroundColor: "#CD7F32",
      },
    ],
  };

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <h2 className="text-white mb-4">{sport}</h2>

      {/* =======================
           CHARTS
         ======================= */}
      <Row className="mb-5">
        <Col md={5}>
          <h5 className="text-center text-danger mb-3">
            Medal Distribution
          </h5>
          <Pie data={pieData} />
        </Col>

        <Col md={7}>
          <h5 className="text-center text-danger mb-3">
            Top Countries Comparison
          </h5>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </Col>
      </Row>

      {/* =======================
           TOP COUNTRIES
         ======================= */}
      <h4 className="text-white mb-3">Top Countries</h4>
      <Row className="mb-5">
        {data.topCountries.map((c) => (
          <Col md={3} sm={6} key={c.noc} className="mb-4 netflix-card-container">
            <Card
              className="netflix-zoom-card"
              onClick={() => navigate(`/countries/${c.noc}`)}
            >
              <Card.Img
                src={countryImages[c.noc]}
                onError={(e) =>
                  (e.target.src = "/images/fallback-flag.png")
                }
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-white text-center">
                  {c.country}
                </Card.Title>
                <p className="text-center mb-0" style={{ color: "chocolate" }}>
                  🥇 {c.gold} 🥈 {c.silver} 🥉 {c.bronze}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* =======================
           TOP ATHLETES
         ======================= */}
      <h4 className="text-white mb-3">Top Athletes</h4>
      <Row>
        {data.topAthletes.map((a) => (
          <Col md={3} sm={6} key={a.name} className="mb-4 netflix-card-container">
            <Card
              className="netflix-zoom-card"
              onClick={() =>
                navigate(
                  `/athletes/${encodeURIComponent(a.name)}/${encodeURIComponent(
                    sport
                  )}`
                )
              }
            >
              <Card.Img
                src={a.image || "/images/fallback-card.png"}
                onError={(e) =>
                  (e.target.src = "/images/fallback-card.png")
                }
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-white">
                  {a.name}
                </Card.Title>
                <p className="text-muted mb-1">{a.country}</p>
                <p className="mb-0" style={{ color: "chocolate" }}>
                  🥇 {a.gold} 🥈 {a.silver} 🥉 {a.bronze}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SportDetails;
