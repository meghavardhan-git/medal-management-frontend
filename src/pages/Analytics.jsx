import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Container, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const API_BASE = "http://localhost:5051/api";

function Analytics() {
  const token = localStorage.getItem("token");

  // -----------------------------
  // STATE
  // -----------------------------
  const [summaryFilter, setSummaryFilter] = useState("top10");
  const [summaryData, setSummaryData] = useState([]);

  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [pieData, setPieData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // FETCH BAR CHART DATA
  // -----------------------------
  const fetchCountrySummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/analytics/country-summary?filter=${summaryFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load country summary");

      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FETCH ALL COUNTRIES (FOR PIE DROPDOWN)
  // -----------------------------
  const fetchAllCountries = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/analytics/country-summary?filter=all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load country list");

      const data = await res.json();
      setAllCountries(data);

      if (data.length > 0) {
        setSelectedCountry(data[0].country);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // FETCH PIE CHART DATA
  // -----------------------------
  const fetchMedalDistribution = async (country) => {
    try {
      const res = await fetch(
        `${API_BASE}/analytics/medal-distribution/${encodeURIComponent(
          country
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load medal distribution");

      const data = await res.json();

      setPieData({
        labels: ["Gold", "Silver", "Bronze"],
        datasets: [
          {
            data: [data.gold, data.silver, data.bronze],
            backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"],
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    fetchCountrySummary();
  }, [summaryFilter]);

  useEffect(() => {
    fetchAllCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchMedalDistribution(selectedCountry);
    }
  }, [selectedCountry]);

  // -----------------------------
  // CHART DATA
  // -----------------------------
  const barChartData = {
    labels: summaryData.map((c) => c.country),
    datasets: [
      {
        label: "Total Medals",
        data: summaryData.map((c) => c.totalMedals),
        backgroundColor: "#e50914",
      },
    ],
  };

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: "150px" }}>
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ paddingTop: "120px" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4 text-center">Olympic Medal Analytics</h2>

      {/* BAR CHART FILTER */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Select
            value={summaryFilter}
            onChange={(e) => setSummaryFilter(e.target.value)}
          >
            <option value="top5">Top 5 Countries</option>
            <option value="top10">Top 10 Countries</option>
            <option value="all">All Countries</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {/* BAR CHART */}
        <Col md={7}>
          <div className="bg-dark p-3 rounded">
            <h5>Total Medals by Country</h5>
            <Bar data={barChartData} />
          </div>
        </Col>

        {/* PIE CHART */}
        <Col md={5}>
          <div className="bg-dark p-3 rounded">
            <Form.Select
              className="mb-3"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {allCountries.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.country}
                </option>
              ))}
            </Form.Select>

            <h5>Medal Distribution — {selectedCountry}</h5>
            {pieData && <Pie data={pieData} />}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Analytics;
