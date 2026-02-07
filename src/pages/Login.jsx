import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://localhost:5051/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // ✅ Store JWT token
      localStorage.setItem("token", data.token);

      // 🔥 IMPORTANT: redirect to root
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center"
      style={{
        paddingTop: "160px",
        maxWidth: "400px",
        color: "white",
      }}
    >
      <div style={{ width: "100%" }}>
        <h2 className="mb-4 text-center">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        {/* Forgot password */}
        <div className="text-center mt-3">
          <span
            style={{
              color: "#ff4d4d",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        {/* Register */}
        <div className="text-center mt-2">
          <span
            style={{
              color: "#ccc",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Register
          </span>
        </div>
      </div>
    </Container>
  );
}

export default Login;
