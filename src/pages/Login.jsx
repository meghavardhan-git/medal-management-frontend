import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5051/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Invalid login credentials");
        return;
      }

      const data = await response.json();

      // ✅ STORE REAL JWT
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <Container style={{ paddingTop: "120px", maxWidth: "400px", color: "white" }}>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
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

        <Button type="submit" variant="danger" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
