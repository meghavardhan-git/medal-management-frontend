import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Scatter, Doughnut, Line } from "react-chartjs-2";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const API_BASE = "http://localhost:5051/api";

function Analytics() {
  const token = localStorage.getItem("token");

  // =======================
  // STATE
  // =======================
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [hostInfo, setHostInfo] = useState(null);

  const [summaryFilter, setSummaryFilter] = useState("top10");
  const [countries, setCountries] = useState([]);

  const [countrySearch, setCountrySearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);

  // =======================
  // FETCH YEARS
  // =======================
  const fetchYears = async () => {
    const res = await fetch(`${API_BASE}/analytics/years`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setYears(await res.json());
  };

  // =======================
  // FETCH HOST INFO
  // =======================
  const fetchHostInfo = async (year) => {
    if (!year) return setHostInfo(null);

    const res = await fetch(
      `${API_BASE}/analytics/host-info/${year}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setHostInfo(await res.json());
  };

  // =======================
  // COUNTRY SUMMARY
  // =======================
  const fetchCountrySummary = async () => {
    const yearQuery = selectedYear ? `&year=${selectedYear}` : "";

    const res = await fetch(
      `${API_BASE}/analytics/country-summary?filter=all${yearQuery}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return;

    const data = await res.json();
    setCountries(data.map((d) => d.country));

    const filtered =
      summaryFilter === "top5"
        ? data.slice(0, 5)
        : summaryFilter === "top10"
        ? data.slice(0, 10)
        : data;

    setBarData({
      labels: filtered.map((d) => d.country),
      datasets: [
        {
          label: "Total Medals",
          data: filtered.map((d) => d.totalMedals),
          backgroundColor: "#e50914",
        },
      ],
    });
  };

  // =======================
  // AUTOCOMPLETE
  // =======================
  const handleSearchChange = (value) => {
    setCountrySearch(value);
    if (!value) return setSuggestions([]);

    setSuggestions(
      countries
        .filter((c) => c.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10)
    );
  };

  // =======================
  // MEDAL DISTRIBUTION
  // =======================
  const loadMedalDistribution = async (country) => {
    if (!country) return;

    const yearQuery = selectedYear ? `?year=${selectedYear}` : "";
    const res = await fetch(
      `${API_BASE}/analytics/medal-distribution/${encodeURIComponent(
        country
      )}${yearQuery}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return alert("Country not found");

    const d = await res.json();
    setPieData({
      labels: ["Gold", "Silver", "Bronze"],
      datasets: [
        {
          data: [d.gold, d.silver, d.bronze],
          backgroundColor: ["#ffd700", "#c0c0c0", "#cd7f32"],
        },
      ],
    });

    setSuggestions([]);
  };

  // =======================
  // EFFECTS
  // =======================
  useEffect(() => {
    if (token) fetchYears();
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCountrySummary();
      fetchHostInfo(selectedYear);
    }
  }, [summaryFilter, selectedYear, token]);

  // =======================
  // X-FACTOR ANALYTICS
  // =======================

  // 🏎️ Medal Efficiency Index
  const efficiencyData =
    barData && {
      datasets: [
        {
          label: "Efficiency Score",
          data: barData.datasets[0].data.map((m, i) => ({
            x: i + 1,
            y: m / (i + 1),
          })),
          backgroundColor: "#00e676",
        },
      ],
    };

  // ⚖️ Medal Concentration Index
  const concentration =
    barData &&
    (barData.datasets[0].data.slice(0, 5).reduce((a, b) => a + b, 0) /
      barData.datasets[0].data.reduce((a, b) => a + b, 0)) *
      100;

  const concentrationData =
    concentration && {
      labels: ["Top 5 Countries", "Others"],
      datasets: [
        {
          data: [concentration, 100 - concentration],
          backgroundColor: ["#ff5252", "#424242"],
        },
      ],
    };

  // 📉 Dominance Drop Curve
  const dominanceCurve =
    barData && {
      labels: barData.labels,
      datasets: [
        {
          label: "Medal Power Drop",
          data: barData.datasets[0].data,
          borderColor: "#ff9800",
          tension: 0.4,
        },
      ],
    };

  // =======================
  // UI
  // =======================
  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Medal Analytics</h2>

      {/* HOST INFO */}
      {hostInfo && (
        <div className="bg-dark p-3 rounded mb-4">
          <strong>Host:</strong> {hostInfo.hostCountry} –{" "}
          {hostInfo.hostCity}
        </div>
      )}

      {/* FILTERS */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Label>Year</Form.Label>
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label>Country Summary</Form.Label>
          <Form.Select
            value={summaryFilter}
            onChange={(e) => setSummaryFilter(e.target.value)}
          >
            <option value="top5">Top 5</option>
            <option value="top10">Top 10</option>
            <option value="all">All Countries</option>
          </Form.Select>
        </Col>

        <Col md={4} style={{ position: "relative" }}>
          <Form.Label>Search Country (Medal Distribution)</Form.Label>
          <Form.Control
            value={countrySearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Button
            variant="danger"
            className="w-100 mt-2"
            onClick={() => loadMedalDistribution(countrySearch)}
          >
            Search
          </Button>

          {suggestions.length > 0 && (
            <div className="bg-dark rounded mt-1">
              {suggestions.map((c) => (
                <div
                  key={c}
                  className="p-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setCountrySearch(c);
                    loadMedalDistribution(c);
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>

      {/* EXISTING CHARTS (UNCHANGED) */}
      <Row className="mb-5">
        <Col md={7} className="bg-dark p-3 rounded">
          <h5>Total Medals by Country</h5>
          {barData && <Bar data={barData} />}
        </Col>

        <Col md={5} className="bg-dark p-3 rounded">
          <h5>Medal Distribution</h5>
          {pieData ? <Pie data={pieData} /> : <p>No country selected</p>}
        </Col>
      </Row>

      {/* =======================
          X-FACTOR ANALYTICS
         ======================= */}
      <h3 className="mb-4">Advanced Insights (X-Factor)</h3>

      <Row className="mb-4">
        <Col md={6} className="bg-dark p-3 rounded">
          <h5>🏎️ Medal Efficiency Index</h5>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Higher score = more medals per rank position
          </p>
          {efficiencyData && <Scatter data={efficiencyData} />}
        </Col>

        <Col md={6} className="bg-dark p-3 rounded">
          <h5>⚖️ Medal Concentration Index</h5>
          {concentrationData && <Doughnut data={concentrationData} />}
          <p className="text-center mt-2">
            Top 5 countries hold{" "}
            <strong>{concentration?.toFixed(1)}%</strong> of total medals
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="bg-dark p-3 rounded">
          <h5>📉 Dominance Drop Curve</h5>
          {dominanceCurve && <Line data={dominanceCurve} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Analytics;
