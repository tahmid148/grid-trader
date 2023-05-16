import { Row, Col, Container } from "react-bootstrap";
import InfoBox from "./InfoBox";
import chart from "../assets/charticon.svg";
import cake from "../assets/cakeicon.svg";
import plane from "../assets/planeicon.svg";

const Body = () => {
  const box1 = {
    header: "Connect Your Crypto Wallet",
    image: chart,
    text: "Easily connect your Binance account to start grid trading on ETH/USD and other cryptocurrency pairs.",
  };

  const box2 = {
    header: "Customizable Trading Strategies",
    image: cake,
    text: "Tailor your trading strategy to fit your preferences and risk tolerance with adjustable grid sizes, trading frequencies, and buy/sell thresholds.",
  };

  const box3 = {
    header: "Real-Time Dashboard",
    image: plane,
    text: "Stay informed with a real-time dashboard that displays your trading activities, including profit/loss, order history, and account balances.",
  };

  return (
    <Container className="row-2">
      <Row>
        <Col>
          <InfoBox
            header={box1.header}
            image={box1.image}
            text={box1.text}
            name="chart"
          />
        </Col>
        <Col>
          <InfoBox
            header={box2.header}
            image={box2.image}
            text={box2.text}
            name="cake"
          />
        </Col>
        <Col>
          <InfoBox
            header={box3.header}
            image={box3.image}
            text={box3.text}
            name="plane"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Body;
