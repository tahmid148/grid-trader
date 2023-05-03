import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import * as logo from "../logo.svg";

const Navigation = () => {
  const linkStyle = {
    color: "white",
    backgroundColor: "blue",
    borderRadius: "5px",
    marginLeft: "15px",
  };

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
        <Nav className="justify-content-end">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#faq">FAQ</Nav.Link>
          <Nav.Link style={linkStyle}>Sign in</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default Navigation;
