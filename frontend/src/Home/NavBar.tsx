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
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo.default}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Gridify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">About Us</Nav.Link>
            <Nav.Link href="#pricing">Features</Nav.Link>
          </Nav>
          <Nav>
            <Stack direction="horizontal" gap={3}>
              <Button className="nav-button log-in" variant="light">
                Log In
              </Button>
              <Button className=" nav-button sign-up" variant="primary">
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
