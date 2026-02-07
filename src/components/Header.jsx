import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand style={{ color: "#e50914", fontWeight: "bold" }}>
          <Nav.Link as={Link} to="/">Medal Trotters</Nav.Link>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/countries">Countries</Nav.Link>
            <Nav.Link as={Link} to="/athletes">Athletes</Nav.Link>
            <Nav.Link as={Link} to="/sports">Sports</Nav.Link>
            <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
            <Nav.Link as={Link} to="/globe">Globe</Nav.Link>
            <Nav.Link as={Link} to="/favourites">Favourites</Nav.Link>
          </Nav>

          <Nav>
  {isLoggedIn ? (
    <Nav.Link
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      Logout
    </Nav.Link>
  ) : (
    <>
      <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
      <Nav.Link onClick={() => navigate("/register")}>Register</Nav.Link>
    </>
  )}
</Nav>


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
