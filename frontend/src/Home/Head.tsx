import { Button, Col, Container, Row, Stack, Image } from "react-bootstrap";
import NavBar from "./NavBar";
import GetStarted from "./GetStarted";

const Head = () => {
  return (
    <Row className="row-1">
      <Stack className="stack-1" gap={3}>
        <NavBar />
        <GetStarted />
      </Stack>
    </Row>
  );
};

export default Head;
