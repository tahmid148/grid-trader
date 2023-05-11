import Button from "react-bootstrap/Button";

const Home = () => {
  const handleSubmit = async (event) => {
    const alpaca_oauth =
      `https://app.alpaca.markets/oauth/authorize` +
      `?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=account:write%20trading%20data`;
    document.location.href = alpaca_oauth;
  };

  return (
    <div>
      <Button variant="primary" onClick={handleSubmit}>
        Connect To Alpaca
      </Button>{" "}
    </div>
  );
};

export default Home;
