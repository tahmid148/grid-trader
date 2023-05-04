import { Container, Row, Nav, Col, Button, Image } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import * as logo from "../assets/relaxing.svg";
import "./styles.css";

// import Navigation from "./Navigation";

const TopRowWithNav = () => {
  const backgroundStyle = {
    height: "90vh",
    background: "linear-gradient(45deg, #21d4fd, #ae00ff)",
  };

  const outerContainerStyle = {
    marginTop: "5vh",
    marginLeft: "15vh",
  };

  const navbarStyle = {
    marginRight: "45vh",
  };

  return (
    <Row style={backgroundStyle}>
      <Container fluid style={outerContainerStyle}>
        <Row>
          <Container fluid style={navbarStyle}>
            <Navbar expand="lg" style={navbarStyle}>
              <Navbar.Brand>Gridify</Navbar.Brand>

              <Nav className="me-auto">
                <Nav.Link href="#about-us">About Us</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
              </Nav>

              <Nav className="justify-content-end">
                <Nav.Link href="log-in">Log In</Nav.Link>
                <Nav.Link href="sign-up">Sign Up</Nav.Link>
              </Nav>
            </Navbar>
          </Container>
        </Row>

        <Row>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Row
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                marginTop: "3vh",
              }}
            >
              Grid trading made easy for crypto investors
            </Row>
            <Row style={{ width: "47vh", marginBottom: "10vh" }}>
              <Col>
                <Button variant="primary" size="lg" style={{ width: "20vh" }}>
                  Get Started
                </Button>{" "}
              </Col>
              <Col>
                <Button variant="secondary" size="lg" style={{ width: "20vh" }}>
                  Learn More
                </Button>{" "}
              </Col>
            </Row>
          </Col>
          <Col>
            <Image
              alt=""
              src={logo.default}
              width="550vh"
              height="550vh"
              className="d-inline-block align-top"
            />
          </Col>
        </Row>
      </Container>
    </Row>
  );
};

export default TopRowWithNav;
