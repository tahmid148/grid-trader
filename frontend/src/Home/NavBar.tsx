import {
  Button,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Stack,
} from "react-bootstrap";

import * as logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand className="text-light title-text" href="/">
          <img
            alt="Logo"
            src={logo.default}
            width="55"
            height="60"
            className="d-inline-block"
            style={{ marginBottom: "0.5vh" }}
          />{" "}
          Gridify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto title">
            <Nav.Link className="text-light navbar-text" href="#features">
              About Us
            </Nav.Link>
            <Nav.Link className="text-light navbar-text" href="#pricing">
              Features
            </Nav.Link>
          </Nav>
          <Nav>
            <Stack direction="horizontal" gap={3}>
              <Button className="nav-button log-in" variant="light">
                Log In
              </Button>
              <Button className="nav-button sign-up" variant="primary">
                Sign Up
              </Button>
            </Stack>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
