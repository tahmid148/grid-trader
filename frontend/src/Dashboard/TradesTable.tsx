import { Table } from "react-bootstrap";

const TradesTable = ({ tradesInfo }) => {
  // Sort the quotesInfo array based on the time property in ascending order
  const sortedTradesInfo = tradesInfo.sort((a, b) => a.time - b.time);
  // Reverse the sorted array to display the newest time at the top
  const reversedTradesInfo = sortedTradesInfo.reverse();
  return (
    <div className="scrollable-table">
      <h2>Trades</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Price</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {reversedTradesInfo.map((quote, index) => {
            return (
              <tr key={index}>
                <td>{quote.time}</td>
                <td>{quote.price}</td>
                <td>{quote.size}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TradesTable;
