import { Row, Col, Stack, Image } from "react-bootstrap";
import * as chart from "../assets/charticon.svg";

const InfoBox = (props) => (
  <Stack direction="horizontal">
    <Image
      className="image-background"
      alt=""
      src={chart.default}
      width="65"
      height="65"
    />
    <div className="infobox-text">
      <b>Connect Your Crypto Wallet</b>
      <br />
      Easily connect your Binance account to start grid trading on ETH/USD and
      other cryptocurrency pairs.
    </div>
  </Stack>
);

export default InfoBox;
