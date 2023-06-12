import { useState } from "react";
import { Modal, Table } from "react-bootstrap";

const CompletedTrades = ({ data }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleTableRowClick = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="scrollable-table">
      <h2>Completed Trades</h2>
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
              buyOrder &&
              sellOrder &&
              buyOrder["status"] === "FILLED" &&
              sellOrder["status"] === "FILLED"
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
        <Modal.Body>Hi</Modal.Body>
        <Modal.Footer>
          <button onClick={handleModalClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompletedTrades;
