import { useState } from "react";
import { Modal, Table } from "react-bootstrap";

const ClosedOrdersTable = ({ closedOrders }) => {
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
      <h2>Closed Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {closedOrders.map((quote, index) => {
            return (
              <tr key={index} onClick={() => handleTableRowClick(quote)}>
                <td>{quote.side}</td>
                <td>{quote.price}</td>
                <td>{quote.origQty}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Side: {selectedEntry?.side}</p>
          <p>Price: {selectedEntry?.price}</p>
          <p>Quantity: {selectedEntry?.origQty}</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleModalClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClosedOrdersTable;
