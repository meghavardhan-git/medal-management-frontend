import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5051/api";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                setError("Something went wrong. Try again.");
                setLoading(false);
                return;
            }

            setMessage("If the email exists, a reset link has been sent.");
        } catch (err) {
            console.error(err);
            setError("Server error. Please try later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-start"
            style={{ minHeight: "100vh", paddingTop: "160px" }}
        >
            <Card style={{ width: "400px", backgroundColor: "#1f1f1f", color: "white" }}>
                <Card.Body>
                    <h4 className="text-center mb-4">Forgot Password</h4>

                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="danger"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <Button 
  variant="link" 
  className="text-danger text-decoration-none" 
  onClick={() => navigate('/login')}
>
  Back to Login
</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ForgotPassword;
