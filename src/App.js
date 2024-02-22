import React, { useState } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import { Chart, registerables } from 'chart.js';
import { format, subMonths } from 'date-fns';
import './App.scss';

Chart.register(...registerables);

function App() {
  const URL = "http://api.marketstack.com/v1";
  const ACCESS_KEY = `${process.env.REACT_APP_STOCK_CHART_API}`;

  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState({});
  const [stockPrice, setStockPrice] = useState({});
  const [stockMonthData, setStockMonthData] = useState(null);
  const [isShow, setShow] = useState(false)

  const onChangeStockSymbol = (event) => setStockSymbol(event.target.value);

  const handleClick = () => {
    getStockData(stockSymbol);
    getStockPrice(stockSymbol);
    getStockPeriodData(stockSymbol, 1);
    setShow(true);
  };

  const onChangeStockPeriodDate = (period) => {
    getStockPeriodData(stockSymbol, period);
  }

  const getStockData = (symbol) => {
    axios.get(`${URL}/tickers/${symbol}?access_key=${ACCESS_KEY}`)
      .then(response => {
        setStockData(response.data)
      });
  }

  const getStockPrice = (symbol) => {
    axios.get(`${URL}/tickers/${symbol}/eod/latest?access_key=${ACCESS_KEY}`)
      .then(response => {
        setStockPrice(response.data);
      })
  }  

  const getStockPeriodData = async (symbol, period) => {
    let data = [];
    let labels = [];
    await axios.get(`${URL}/eod?access_key=${ACCESS_KEY}&symbols=${symbol}&date_from=${format(subMonths(new Date(), period), 'yyyy-MM-dd')}&date_to=${format(new Date(), 'yyyy-MM-dd')}&limit=1000&sort=ASC`)
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
      <div className="Header">
        <div className="StockData">
          <h1>{stockData.name}</h1>          
          {isShow &&
          <ul className="StockDataList">
            <li>始値<br/>{stockPrice.open}</li>
            <li>高値<br/>{stockPrice.high}</li>
            <li>安値<br/>{stockPrice.low}</li>
            <li>終値<br/>{stockPrice.close}</li>
            <li>出来高<br/>{stockPrice.volume}</li>
          </ul>}
        </div>
        <div className="StockSearch">
          <input
            type="text"
            name="symbol"
            placeholder="銘柄を入力してください"
            value={stockSymbol}
            onChange={onChangeStockSymbol}
          />
          <button onClick={handleClick}></button>
        </div>
      </div>
      {isShow &&
      <ul className="StockChartPeriod">
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(1)}
          /> 1ヶ月
        </li>
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(3)}
          /> 3ヶ月
        </li>
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(6)}
          /> 6ヶ月
        </li>
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(12)}
          /> 1年
        </li>
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(24)}
          /> 2年
        </li>
        <li>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockPeriodDate(36)}
          /> 3年
        </li>                         
      </ul>}    
      <div className="Chart">
        <LineChart stockMonthData={stockMonthData} />
      </div>
    </div>
  );
}

export default App;
