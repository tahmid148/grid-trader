import { Row, Col, Container } from "react-bootstrap";
import InfoBox from "./InfoBox";

const Body = () => {
  return (
    <Container className="row-2">
      <Row>
        <Col>
          <InfoBox props={{}} />
        </Col>
        <Col>
          <InfoBox props={{}} />
        </Col>
        <Col>
          <InfoBox props={{}} />
        </Col>
      </Row>
    </Container>
  );
};

export default Body;
