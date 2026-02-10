import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5051/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Background Video */}
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/Login.mp4" type="video/mp4" />
      </video>

      <Container className="register-container">
        <div className="register-card">
          <h2 className="text-center mb-4">Register</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="danger"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Register;