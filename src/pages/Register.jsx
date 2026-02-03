import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <Container style={{ paddingTop: "120px", maxWidth: "400px", color: "white" }}>
      <h2>Register</h2>

      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required />
        </Form.Group>

        <Button type="submit" variant="danger" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
