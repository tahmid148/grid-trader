import { Modal, Table } from "react-bootstrap";
import "./CurrentTrades.css";
import { useState } from "react";

const CurrentTrades = ({ data }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleTableRowClick = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
    console.log("ENTRY");
    console.log(entry);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="scrollable-table">
      <h2>Current Trades</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Side</th>
            <th>Status</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Side</th>
            <th>Status</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((quote, index) => {
            var buyPrice = "";
            var buyQuantity = "";
            var buyStatus = "";
            var sellPrice = "";
            var sellQuantity = "";
            var sellStatus = "";
            const buyOrder = quote?.buy_order;
            const sellOrder = quote?.sell_order;

            if (
              !(
                buyOrder &&
                sellOrder &&
                buyOrder["status"] === "FILLED" &&
                sellOrder["status"] === "FILLED"
              )
            ) {
              if (
                buyOrder &&
                buyOrder["status"] === "FILLED" &&
                buyOrder["type"] === "LIMIT"
              ) {
                buyPrice = buyOrder["price"];
                buyQuantity = buyOrder["origQty"];
                buyStatus = buyOrder["status"];
              } else if (
                buyOrder &&
                buyOrder["status"] === "FILLED" &&
                buyOrder["type"] === "MARKET"
              ) {
                const buyOrderFills = buyOrder["fills"];
                buyPrice = buyOrderFills[0]["price"];
                buyQuantity = buyOrderFills[0]["qty"];
                buyStatus = buyOrder["status"];
              } else if (buyOrder) {
                buyPrice = buyOrder["price"];
                buyQuantity = buyOrder["origQty"];
                buyStatus = "OPEN";
              }

              if (
                sellOrder &&
                sellOrder["status"] === "FILLED" &&
                sellOrder["type"] === "LIMIT"
              ) {
                sellPrice = sellOrder["price"];
                sellQuantity = sellOrder["origQty"];
                sellStatus = sellOrder["status"];
              } else if (
                sellOrder &&
                sellOrder["status"] === "FILLED" &&
                sellOrder["type"] === "MARKET"
              ) {
                const sellOrderFills = sellOrder["fills"];
                sellPrice = sellOrderFills[0]["price"];
                sellQuantity = sellOrderFills[0]["qty"];
                sellStatus = sellOrder["status"];
              } else if (sellOrder) {
                sellPrice = sellOrder["price"];
                sellQuantity = sellOrder["origQty"];
                sellStatus = "OPEN";
              }

              return (
                <tr key={index} onClick={() => handleTableRowClick(quote)}>
                  <td>{quote.id}</td>
                  <td>{"BUY"}</td>
                  <td>{buyStatus}</td>
                  <td>{buyPrice}</td>
                  <td>{buyQuantity}</td>
                  <td>{"SELL"}</td>
                  <td>{sellStatus}</td>
                  <td>{sellPrice}</td>
                  <td>{sellQuantity}</td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Profit: {selectedEntry?.profit}</p>
          {selectedEntry?.buy_order &&
            selectedEntry?.buy_order.status !== "FILLED" && (
              <div>
                <p>Buy Order:</p>
                <p>Side: {selectedEntry?.buy_order?.side}</p>
                <p>Price: {selectedEntry?.buy_order?.price}</p>
                <p>Quantity: {selectedEntry?.buy_order?.origQty}</p>
                <p>Type: {selectedEntry?.buy_order?.type}</p>
                <p>Status: {selectedEntry?.buy_order?.status}</p>
              </div>
            )}
          {selectedEntry?.buy_order &&
            selectedEntry?.buy_order.status === "FILLED" && (
              <div>
                <p>Buy Order:</p>
                <p>Side: {selectedEntry?.buy_order?.side}</p>
                <p>Price: {selectedEntry?.buy_order?.fills[0].price}</p>
                <p>Quantity: {selectedEntry?.buy_order?.fills[0].qty}</p>
                <p>Type: {selectedEntry?.buy_order?.type}</p>
                <p>Status: {selectedEntry?.buy_order?.status}</p>
              </div>
            )}
          {selectedEntry?.sell_order &&
            selectedEntry?.sell_order.status !== "FILLED" && (
              <div>
                <p>Sell Order:</p>
                <p>Side: {selectedEntry?.sell_order?.side}</p>
                <p>Price: {selectedEntry?.sell_order?.price}</p>
                <p>Quantity: {selectedEntry?.sell_order?.origQty}</p>
                <p>Type: {selectedEntry?.sell_order?.type}</p>
                <p>Status: {selectedEntry?.sell_order?.status}</p>
              </div>
            )}
          {selectedEntry?.sell_order &&
            selectedEntry?.sell_order.status === "FILLED" && (
              <div>
                <p>Sell Order:</p>
                <p>Side: {selectedEntry?.sell_order?.side}</p>
                <p>Price: {selectedEntry?.sell_order?.price}</p>
                <p>Quantity: {selectedEntry?.sell_order?.origQty}</p>
                <p>Type: {selectedEntry?.sell_order?.type}</p>
                <p>Status: {selectedEntry?.sell_order?.status}</p>
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleModalClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CurrentTrades;

const example = {
  symbol: "ETHUSDT",
  orderId: "7554303",
  orderListId: "-1",
  clientOrderId: "x-R4BD3S8283838fe62a4dc602e8ae8",
  price: "1901.03000000",
  origQty: "0.01000000",
  executedQty: "0.00000000",
  cummulativeQuoteQty: "0.00000000",
  status: "NEW",
  timeInForce: "GTC",
  type: "LIMIT",
  side: "BUY",
  stopPrice: "0.00000000",
  icebergQty: "0.00000000",
  time: "1687733636001",
  updateTime: "1687733636001",
  isWorking: true,
  workingTime: "1687733636001",
  origQuoteOrderQty: "0.00000000",
  selfTradePreventionMode: "NONE",
};
