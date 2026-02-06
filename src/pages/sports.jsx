import { useState, useEffect } from "react"; // Added hooks
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSports } from "../services/api"; 

function Sports() {
  const navigate = useNavigate();
  
  // 1. Setup State for dynamic data
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from backend on component mount
  useEffect(() => {
    getSports()
      .then((data) => {
        setSports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sports:", err);
        setLoading(false);
      });
  }, []);

  // Handle Loading State
  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: "100px" }}>
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", color: "white" }}>
      <h2>Sports</h2>

      <Row>
        {sports.map((sport, index) => (
          <Col md={3} key={sport.id || index} style={{ marginTop: "20px" }}>
            <Card
              /* DYNAMIC ROUTING UPDATE: 
                 This uses the sport's name (or ID) to change the URL. 
                 Ensure your Route in App.js is defined as: path="/sports/:sportName"
              */
              onClick={() => navigate(`/sports/${sport.name}`)} 
              
              style={{
                backgroundColor: "#1f1f1f",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Card.Img
                variant="top"
                src={sport.image}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  {sport.name}
                </Card.Title>
                <p style={{ color: "#aaa" }}>
                  {/* Ensure your API returns 'countries' as an array */}
                  Dominant Countries: {sport.countries ? sport.countries.length : 0}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Sports;