import { Table } from "react-bootstrap";
import "./CurrentTrades.css";

const CurrentTrades = ({ data }) => {
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
        <tbody>
          {data.map((quote, index) => {
            const buyOrder = quote.buy_order;
            const sellOrder = quote.sell_order;

            if (sellOrder === null) {
              return (
                <tr key={index}>
                  <td>{buyOrder.side}</td>
                  <td>{buyOrder.price}</td>
                  <td>{buyOrder.origQty}</td>
                </tr>
              );
            }
            return (
              <tr key={index}>
                <td>{buyOrder.side}</td>
                <td>{buyOrder.price}</td>
                <td>{buyOrder.origQty}</td>
                <td>{sellOrder.side}</td>
                <td>{sellOrder.price}</td>
                <td>{sellOrder.origQty}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrentTrades;
