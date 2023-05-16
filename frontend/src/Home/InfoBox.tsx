import { Row, Col, Stack, Image } from "react-bootstrap";

const InfoBox = ({ image, header, text, name }) => (
  <Stack direction="horizontal">
    <Image
      className="image-background"
      alt=""
      src={`${image}.${name}.default`}
      width="65"
      height="65"
    />
    <div className="infobox-text">
      <b>{header}</b>
      <br />
      {text}
    </div>
  </Stack>
);

export default InfoBox;
