import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import * as logo from "../logo.svg";

const Navigation = () => {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo.default}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Grid Trading
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
export default Navigation;
