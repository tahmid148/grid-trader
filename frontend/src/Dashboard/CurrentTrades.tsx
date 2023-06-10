import { Table } from "react-bootstrap";
import "./CurrentTrades.css";
import { useState } from "react";

const CurrentTrades = ({ data }) => {
  const sampleData = [
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152759",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82eaa36a7656d713d9c4038a",
        transactTime: "1686426316354",
        price: "1742.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: "1686426316354",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      sell_order: null,
      open_buy: true,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152764",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82e2a03ac9e095ea72eaa11d",
        transactTime: "1686426317220",
        price: "0.00000000",
        origQty: "0.01000000",
        executedQty: "0.01000000",
        cummulativeQuoteQty: "17.42700000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "MARKET",
        side: "BUY",
        workingTime: "1686426317220",
        fills: [
          {
            price: "1742.70000000",
            qty: "0.01000000",
            commission: "0.00000000",
            commissionAsset: "ETH",
            tradeId: "173569",
          },
        ],
        selfTradePreventionMode: "NONE",
      },
      sell_order: {
        symbol: "ETHUSDT",
        orderId: "1152762",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82584cabf20da906a0047e98",
        transactTime: "1686426317002",
        price: "1743.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "SELL",
        workingTime: "1686426317002",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      open_buy: false,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152765",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82f025c08aa9db45375c79ce",
        transactTime: "1686426317859",
        price: "1741.63000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: "1686426317859",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      sell_order: null,
      open_buy: true,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152771",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82dca2374440d400b2ca441",
        transactTime: "1686426318717",
        price: "0.00000000",
        origQty: "0.01000000",
        executedQty: "0.01000000",
        cummulativeQuoteQty: "17.42700000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "MARKET",
        side: "BUY",
        workingTime: "1686426318717",
        fills: [
          {
            price: "1742.70000000",
            qty: "0.01000000",
            commission: "0.00000000",
            commissionAsset: "ETH",
            tradeId: "173570",
          },
        ],
        selfTradePreventionMode: "NONE",
      },
      sell_order: {
        symbol: "ETHUSDT",
        orderId: "1152770",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82b4fd6767e113fcd8e00dfd",
        transactTime: "1686426318497",
        price: "1743.63000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "SELL",
        workingTime: "1686426318497",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      open_buy: false,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152773",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S821a173d17d8bcbf40dd0136",
        transactTime: "1686426319361",
        price: "1741.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: "1686426319361",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      sell_order: null,
      open_buy: true,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152779",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S829e00ac4f30b4481b25b067",
        transactTime: "1686426320430",
        price: "0.00000000",
        origQty: "0.01000000",
        executedQty: "0.01000000",
        cummulativeQuoteQty: "17.42700000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "MARKET",
        side: "BUY",
        workingTime: "1686426320430",
        fills: [
          {
            price: "1742.70000000",
            qty: "0.01000000",
            commission: "0.00000000",
            commissionAsset: "ETH",
            tradeId: "173572",
          },
        ],
        selfTradePreventionMode: "NONE",
      },
      sell_order: {
        symbol: "ETHUSDT",
        orderId: "1152778",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S821d05e6f3a0eade61097a76",
        transactTime: "1686426320212",
        price: "1744.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "SELL",
        workingTime: "1686426320212",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      open_buy: false,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152782",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S8283c4dc2d778178ada1318d",
        transactTime: "1686426321275",
        price: "1740.63000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: "1686426321275",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      sell_order: null,
      open_buy: true,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152784",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82497875e67d36eb66fccec1",
        transactTime: "1686426321728",
        price: "0.00000000",
        origQty: "0.01000000",
        executedQty: "0.01000000",
        cummulativeQuoteQty: "17.42700000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "MARKET",
        side: "BUY",
        workingTime: "1686426321728",
        fills: [
          {
            price: "1742.70000000",
            qty: "0.01000000",
            commission: "0.00000000",
            commissionAsset: "ETH",
            tradeId: "173573",
          },
        ],
        selfTradePreventionMode: "NONE",
      },
      sell_order: {
        symbol: "ETHUSDT",
        orderId: "1152783",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82c0bd5ef74289ec00aa02d3",
        transactTime: "1686426321496",
        price: "1744.63000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "SELL",
        workingTime: "1686426321496",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      open_buy: false,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152785",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82ba5edad3f312648ae8ea2b",
        transactTime: "1686426321965",
        price: "1740.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: "1686426321965",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      sell_order: null,
      open_buy: true,
      open_sell: true,
    },
    {
      buy_order: {
        symbol: "ETHUSDT",
        orderId: "1152791",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S82b47a8fada866dfec89f9f5",
        transactTime: "1686426322409",
        price: "0.00000000",
        origQty: "0.01000000",
        executedQty: "0.01000000",
        cummulativeQuoteQty: "17.42700000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "MARKET",
        side: "BUY",
        workingTime: "1686426322409",
        fills: [
          {
            price: "1742.70000000",
            qty: "0.01000000",
            commission: "0.00000000",
            commissionAsset: "ETH",
            tradeId: "173574",
          },
        ],
        selfTradePreventionMode: "NONE",
      },
      sell_order: {
        symbol: "ETHUSDT",
        orderId: "1152786",
        orderListId: "-1",
        clientOrderId: "x-R4BD3S829186f9b3e78c2cdbfa9114",
        transactTime: "1686426322191",
        price: "1745.13000000",
        origQty: "0.01000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "NEW",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "SELL",
        workingTime: "1686426322191",
        fills: [],
        selfTradePreventionMode: "NONE",
      },
      open_buy: false,
      open_sell: true,
    },
  ];

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
            <th>Status</th>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((quote, index) => {
            var buyPrice = "";
            var buyQuantity = "";
            var buyStatus = "";
            var sellPrice = "";
            var sellQuantity = "";
            var sellStatus = "";
            const buyOrder = quote.buy_order;
            const sellOrder = quote.sell_order;

            if (buyOrder && buyOrder["status"] === "FILLED") {
              const filledOrder = buyOrder["fills"][0];
              buyPrice = filledOrder["price"];
              buyQuantity = filledOrder["qty"];
              buyStatus = buyOrder["status"];
            } else if (buyOrder) {
              buyPrice = buyOrder["price"];
              buyQuantity = buyOrder["origQty"];
              buyStatus = buyOrder["status"];
            }

            if (sellOrder && sellOrder["status"] === "FILLED") {
              const filledOrder = sellOrder["fills"][0];
              sellPrice = filledOrder["price"];
              sellQuantity = filledOrder["qty"];
              sellStatus = sellOrder["status"];
            } else if (sellOrder) {
              sellPrice = sellOrder["price"];
              sellQuantity = sellOrder["origQty"];
              sellStatus = sellOrder["status"];
            }

            return (
              <tr key={index}>
                <td>{"BUY"}</td>
                <td>{buyPrice}</td>
                <td>{buyQuantity}</td>
                <td>{buyStatus}</td>
                <td>{"SELL"}</td>
                <td>{sellPrice}</td>
                <td>{sellQuantity}</td>
                <td>{sellStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrentTrades;
