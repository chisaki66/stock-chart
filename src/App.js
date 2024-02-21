import React, { useState } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
import './App.css';

Chart.register(...registerables);

function App() {
  const tickersURL = "http://api.marketstack.com/v1/tickers";
  const eodURL = "http://api.marketstack.com/v1/eod";
  const ACCESS_KEY = `${process.env.REACT_APP_STOCK_CHART_API}`;

  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState({});
  const [stockPrice, setStockPrice] = useState({});
  const [stockMonthData, setStockMonthData] = useState(null);

  const onChangeStockSymbol = (event) => setStockSymbol(event.target.value);

  const handleClick = () => {
    getStockData(stockSymbol);
    getStockPrice(stockSymbol);
    getStockMonthData(stockSymbol);
  };

  const getStockData = (symbol) => {
    axios.get(`${tickersURL}/${symbol}?access_key=${ACCESS_KEY}`)
      .then(response => {
        setStockData(response.data)
      });
  }

  const getStockPrice = (symbol) => {
    axios.get(`${tickersURL}/${symbol}/eod/latest?access_key=${ACCESS_KEY}`)
      .then(response => {
        setStockPrice(response.data);
      })
  }  

  const getStockMonthData = async (symbol) => {
    let data = [];
    let labels = [];
    await axios.get(`${eodURL}?access_key=${ACCESS_KEY}&symbols=${symbol}&date_from=2024-01-17&date_to=2024-02-16&sort=ASC`)
      .then(response => {
        for ( let stock of response.data.data){
          data.push(stock.close)
          labels.push(format(stock.date, 'MM/dd/yyyy'))
        }
    });
    setStockMonthData({
      labels: labels,
      datasets:[
        {
          borderColor: 'rgba(35,200,153,1)',
          data: data,
        }
      ]
    })
  }    

  return (
    <div className="App">
      <div className='Header'>
        <div className='StockData'>
          <h1>{stockData.name}</h1>
          <h2>{stockPrice.close}</h2>
        </div>        
        <div className='StockSearch'>
          <input
            type="text"
            name="symbol"
            value={stockSymbol}
            onChange={onChangeStockSymbol}
          />
          <button onClick={handleClick}>SEARCH</button>
        </div>
      </div>
      <div className='Chart'>
        <LineChart stockMonthData={stockMonthData} />
      </div>
    </div>
  );
}

export default App;
