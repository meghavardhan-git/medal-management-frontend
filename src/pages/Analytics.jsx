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
import { Container, Row, Col } from "react-bootstrap";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function Analytics() {
  const barData = {
    labels: ["USA", "China", "Japan", "India"],
    datasets: [
      {
        label: "Total Medals",
        data: [113, 88, 58, 27],
        backgroundColor: "#e50914",
      },
    ],
  };

  const pieData = {
    labels: ["Gold", "Silver", "Bronze"],
    datasets: [
      {
        data: [111, 96, 79],
        backgroundColor: ["#ffd700", "#c0c0c0", "#cd7f32"],
      },
    ],
  };

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2 style={{ marginBottom: "30px" }}>Medal Analytics</h2>

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
            <Bar data={barData} />
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
            <Pie data={pieData} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Analytics;
