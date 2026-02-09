import { useEffect, useState } from "react";
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
import { Container, Row, Col, Form, Button } from "react-bootstrap";

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
    if (!year) {
      setHostInfo(null);
      return;
    }

    const res = await fetch(
      `${API_BASE}/analytics/host-info/${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) setHostInfo(await res.json());
  };

  // =======================
  // FETCH BAR CHART DATA
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
  // AUTOCOMPLETE SEARCH
  // =======================
  const handleSearchChange = (value) => {
    setCountrySearch(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = countries.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 10));
  };

  // =======================
  // LOAD PIE CHART
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

    if (!res.ok) {
      alert("Country not found in dataset");
      return;
    }

    const data = await res.json();

    setPieData({
      labels: ["Gold", "Silver", "Bronze"],
      datasets: [
        {
          data: [data.gold, data.silver, data.bronze],
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
  // UI
  // =======================
  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 className="mb-4">Medal Analytics</h2>

      {/* HOST INFO */}
      {hostInfo && (
        <div
          style={{
            background: "#1f1f1f",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
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
              <option key={y} value={y}>
                {y}
              </option>
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
            type="text"
            placeholder="Type country name"
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
            <div
              style={{
                position: "absolute",
                background: "#1f1f1f",
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 10,
                borderRadius: "4px",
                marginTop: "4px",
              }}
            >
              {suggestions.map((c) => (
                <div
                  key={c}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #333",
                  }}
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

      {/* CHARTS */}
      <Row>
        <Col md={7}>
          <div
            style={{
              backgroundColor: "#1f1f1f",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h5>Total Medals by Country</h5>
            {barData && <Bar data={barData} />}
          </div>
        </Col>

        <Col md={5}>
          <div
            style={{
              backgroundColor: "#1f1f1f",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h5>Medal Distribution</h5>
            {pieData ? <Pie data={pieData} /> : <p>No country selected</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Analytics;
