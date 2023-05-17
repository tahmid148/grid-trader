import { Table } from "react-bootstrap";

const OpenOrdersTable = ({ openOrders }) => {
  return (
    <div className="scrollable-table">
      <h2>Open Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((quote, index) => {
            return (
              <tr key={index}>
                <td>{quote.side}</td>
                <td>{quote.price}</td>
                <td>{quote.origQty}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OpenOrdersTable;
