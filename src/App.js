import React, { useState } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import { Chart, registerables } from 'chart.js';
import { format, subDays, subMonths } from 'date-fns';
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
    await axios.get(`${URL}/eod?access_key=${ACCESS_KEY}&symbols=${symbol}&date_from=${period}&date_to=${format(new Date(), 'yyyy-MM-dd')}&limit=1000&sort=ASC`)
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

  const onChangeStockSymbol = (event) => setStockSymbol(event.target.value);

  const getStockDayPeriodData = (symbol, period) => {
    const subDaysDate = format(subDays(new Date(), period), 'yyyy-MM-dd')
    getStockPeriodData(symbol, subDaysDate)
  }  

  const getStockMonthPeriodData = (symbol, period) => {
    const subMonthsDate = format(subMonths(new Date(), period), 'yyyy-MM-dd')
    getStockPeriodData(symbol, subMonthsDate)
  }

  const handleClick = () => {
    for (const element of document.getElementsByName('period')) {
      element.checked = false;
    }
    
    getStockData(stockSymbol);
    getStockPrice(stockSymbol);
    getStockMonthPeriodData(stockSymbol, 1);
    setShow(true);
  };

  const onChangeStockDayPeriodDate = (period) => {
    getStockDayPeriodData(stockSymbol, period);
  }  

  const onChangeStockMonthPeriodDate = (period) => {
    getStockMonthPeriodData(stockSymbol, period);
  }

  return (
    <div className="App">
      <div className="Header">
        <div className="StockData">
          <h1>{stockData.name}</h1>          
          {isShow &&
          <ul className="StockDataList">
            <li>始値<br /><b>{stockPrice.open}</b></li>
            <li>高値<br /><b>{stockPrice.high}</b></li>
            <li>安値<br /><b>{stockPrice.low}</b></li>
            <li>終値<br /><b>{stockPrice.close}</b></li>
            <li>出来高<br /><b>{stockPrice.volume}</b></li>
          </ul>}
          {isShow && <p>※ 現地時刻の前日のデータを取得しています</p>}
        </div>
        <div className="StockSearch">
          <div className="StockSearch__Form">
            <input
              type="text"
              name="symbol"
              placeholder="銘柄を入力してください"
              value={stockSymbol}
              onChange={onChangeStockSymbol}
            />
            <button onClick={handleClick}></button>
          </div>
          <div className="StockSearch__Text">
            <p>銘柄のリストは <a href="https://marketstack.com/search" target="_blank">こちら</a> からご参照ください</p>
          </div>
        </div>
      </div>
      {isShow &&
      <div className="StockChartPeriod">
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockDayPeriodDate(1)}
          /> 1日
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockDayPeriodDate(7)}
          /> 1週
        </label>                
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(1)}
          /> 1ヶ月
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(3)}
          /> 3ヶ月
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(6)}
          /> 6ヶ月
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(12)}
          /> 1年
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(24)}
          /> 2年
        </label>
        <label>
          <input
            type="radio"
            name="period"
            onChange={() => onChangeStockMonthPeriodDate(36)}
          /> 3年
        </label>
      </div>}
      <div className="Chart">
        <LineChart stockMonthData={stockMonthData} />
      </div>
    </div>
  );
}

export default App;
