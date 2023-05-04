import { Container, Row, Nav, Col, Button, Image } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import * as relaxingImage from "../assets/relaxing.svg";
import * as logo from "../assets/logo.png";

// import Navigation from "./Navigation";

const TopRowWithNav = () => {
  const backgroundStyle = {
    height: "90vh",
    background: "linear-gradient(45deg, #21d4fd, #ae00ff)",
  };

  const outerContainerStyle = {
    marginTop: "1vh",
    marginLeft: "1vh",
  };

  const navbarStyle = {
    marginRight: "45vh",
    marginLeft: "10vh",
  };

  return (
    <Row style={backgroundStyle}>
      <Container fluid style={outerContainerStyle}>
        <Row>
          <Container fluid style={navbarStyle}>
            <Navbar expand="lg" style={navbarStyle}>
              <Navbar.Brand
                className="text-light"
                style={{ fontSize: "2.5rem" }}
                href="#home"
              >
                <img
                  src={logo.default}
                  height="65vh"
                  className="d-inline-block align-top"
                  alt="Gridify logo"
                />{" "}
                Gridify
              </Navbar.Brand>

              <Nav className="me-auto" style={{ marginLeft: "13vh" }}>
                <Nav.Link
                  href="#about-us"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "2.5vh",
                  }}
                >
                  About Us
                </Nav.Link>
                <Nav.Link
                  href="#features"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "2.5vh",
                  }}
                >
                  Features
                </Nav.Link>
              </Nav>

              <Nav className="justify-content-end">
                <Button
                  variant="light"
                  href="log-in"
                  style={{
                    marginRight: "1rem",
                    minWidth: "7rem",
                    padding: "10px 20px",
                  }}
                >
                  Log In
                </Button>{" "}
                <Button
                  variant="primary"
                  href="sign-up"
                  style={{
                    minWidth: "7rem",
                    padding: "10px 20px",
                  }}
                >
                  Sign Up
                </Button>{" "}
              </Nav>
            </Navbar>
          </Container>
        </Row>

        <Row style={{ marginLeft: "15vh" }}>
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
              src={relaxingImage.default}
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
