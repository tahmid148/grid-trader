import { Table } from "react-bootstrap";

const ClosedOrdersTable = ({ closedOrders }) => {
  // Sort the quotesInfo array based on the time property in ascending order
  const sortedClosedOrders = closedOrders.sort((a, b) => a.time - b.time);
  // Reverse the sorted array to display the newest time at the top
  const reversedClosedOrders = sortedClosedOrders.reverse();
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
          {reversedClosedOrders.map((quote, index) => {
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

export default ClosedOrdersTable;
