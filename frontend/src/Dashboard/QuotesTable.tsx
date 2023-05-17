import { Table } from "react-bootstrap";

const QuotesTable = ({ quotesInfo }) => {
  // Sort the quotesInfo array based on the time property in ascending order
  const sortedQuotesInfo = quotesInfo.sort((a, b) => a.time - b.time);
  // Reverse the sorted array to display the newest time at the top
  const reversedQuotesInfo = sortedQuotesInfo.reverse();
  return (
    <div className="scrollable-table">
      <h2>Quotes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Bid Price</th>
            <th>Ask Price</th>
          </tr>
        </thead>
        <tbody>
          {reversedQuotesInfo.map((quote, index) => {
            return (
              <tr key={index}>
                <td>{quote.time}</td>
                <td>{quote.bidPrice}</td>
                <td>{quote.askPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default QuotesTable;
