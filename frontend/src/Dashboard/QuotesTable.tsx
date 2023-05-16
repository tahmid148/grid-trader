import { Table } from "react-bootstrap";

const QuotesTable = () => {
  return (
    <div className="scrollable-table">
      <h2>Scrollable Table</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Bid Price</th>
            <th>Ask Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Column 1</td>
            <td>Row 1, Column 2</td>
            <td>Row 1, Column 3</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default QuotesTable;
