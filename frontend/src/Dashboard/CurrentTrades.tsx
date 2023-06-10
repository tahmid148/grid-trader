import { Table } from "react-bootstrap";
import "./CurrentTrades.css";
import { useState } from "react";

const CurrentTrades = ({ data }) => {
  console.log(data);
  return (
    <div className="scrollable-table">
      <h2>Current Trades</h2>
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
            var buyPrice = "";
            var buyQuantity = "";
            var sellPrice = "";
            var sellQuantity = "";
            const buyOrder = quote.buy_order;
            const sellOrder = quote.sell_order;

            if (buyOrder && buyOrder["status"] === "FILLED") {
              const filledOrder = buyOrder["fills"][0];
              buyPrice = filledOrder["price"];
              buyQuantity = filledOrder["qty"];
            } else if (buyOrder) {
              buyPrice = buyOrder["price"];
              buyQuantity = buyOrder["origQty"];
            }

            if (sellOrder && sellOrder["status"] === "FILLED") {
              const filledOrder = sellOrder["fills"][0];
              sellPrice = filledOrder["price"];
              sellQuantity = filledOrder["qty"];
            } else if (sellOrder) {
              sellPrice = sellOrder["price"];
              sellQuantity = sellOrder["origQty"];
            }

            return (
              <tr key={index}>
                <td>{"BUY"}</td>
                <td>{buyPrice}</td>
                <td>{buyQuantity}</td>
                <td>{"SELL"}</td>
                <td>{sellPrice}</td>
                <td>{sellQuantity}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrentTrades;
