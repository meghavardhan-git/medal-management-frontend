import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // mock JWT token
    localStorage.setItem("token", "mock-jwt-token");
    navigate("/");
  };

  return (
    <Container style={{ paddingTop: "120px", maxWidth: "400px", color: "white" }}>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required />
        </Form.Group>

        <Button type="submit" variant="danger" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
