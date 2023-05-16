import { Container, Button } from "react-bootstrap";
import Head from "./Head";
import Footer from "./Footer";
import Body from "./Body";
import "./Home.css";

const Home = () => {
  return (
    <Container fluid>
      <Head />
      <Body />
      <Footer />
    </Container>
  );
};

export default Home;
