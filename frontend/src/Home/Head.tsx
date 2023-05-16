import { Button, Col, Container, Row, Stack, Image } from "react-bootstrap";
import NavBar from "./NavBar";
import * as relaxingImage from "../assets/relaxing.svg";

const Head = () => {
  return (
    <Row className="row-1">
      <Stack className="stack-1" gap={3}>
        <NavBar />
        <Container>
          <Row>
            <Col xs={8} md={8} lg={8}>
              <Row className="catchphrase">
                Grid trading made<br></br> easy for crypto <br></br> investors
              </Row>
              <Row>
                <Stack
                  direction="horizontal"
                  gap={5}
                  style={{ marginTop: "40px" }}
                >
                  <Button className="nav-button sign-up" variant="primary">
                    Get Started
                  </Button>
                  <Button className="nav-button log-in" variant="light">
                    Learn More
                  </Button>
                </Stack>
              </Row>
            </Col>
            <Col>
              <Image
                alt=""
                src={relaxingImage.default}
                width="415vh"
                height="600vh"
                className="d-inline-block align-top"
              />
            </Col>
          </Row>
        </Container>
      </Stack>
    </Row>
  );
};

export default Head;
