import { Row, Stack } from "react-bootstrap";
import NavBar from "./NavBar";

const Head = () => {
  return (
    <Row className="row-1">
      <Stack className="stack-1" gap={3}>
        <NavBar />
      </Stack>
    </Row>
  );
};

export default Head;
