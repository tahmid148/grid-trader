import { Table } from "react-bootstrap";
import "./CurrentTrades.css";

const CurrentTrades = () => {
  return (
    <div className="scrollable-table">
      <h2>Open Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </div>
  );
};

export default CurrentTrades;
