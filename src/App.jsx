import React, { useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { format, subMonths } from 'date-fns';
import './App.scss';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import StockChartPeriod from './components/StockChartPeriod';
import LineChart from './components/LineChart';

Chart.register(...registerables);

function App() {
  const URL = `${process.env.REACT_APP_MARKET_STACK_URL}`;
  const ACCESS_KEY = `${process.env.REACT_APP_STOCK_CHART_API}`;

  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState({});
  const [stockPrice, setStockPrice] = useState({});
  const [stockMonthData, setStockMonthData] = useState(null);
  const [isShow, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getStockData = async (symbol) => {
    try {
      await axios.get(`${URL}/tickers/${symbol}?access_key=${ACCESS_KEY}`).then((response) => {
        setStockData(response.data);
      });
    } catch (error) {
      console.error('Failed to fetch stock data', error.message);
      setErrorMessage('株式データの取得に失敗しました');
      setShow(false);
    }
  };

  const getStockPrice = async (symbol) => {
    try {
      await axios
        .get(`${URL}/tickers/${symbol}/eod/latest?access_key=${ACCESS_KEY}`)
        .then((response) => {
          setStockPrice(response.data);
        });
    } catch (error) {
      console.error('Failed to fetch stock data', error.message);
      setErrorMessage('株式データの取得に失敗しました');
      setShow(false);
    }
  };

  const getStockPeriodData = async (symbol, period) => {
    let data = [];
    let labels = [];
    try {
      await axios
        .get(
          `${URL}/eod?access_key=${ACCESS_KEY}&symbols=${symbol}&date_from=${period}&date_to=${format(new Date(), 'yyyy-MM-dd')}&limit=1000&sort=ASC`,
        )
        .then((response) => {
          for (let stock of response.data.data) {
            data.push(stock.close);
            labels.push(format(stock.date, 'MM/dd/yyyy'));
          }
        });
    } catch (error) {
      console.error('Failed to fetch stock data', error.message);
      setErrorMessage('株式データの取得に失敗しました');
    }
    setStockMonthData({
      labels: labels,
      datasets: [
        {
          borderColor: 'rgba(35,200,153,1)',
          data: data,
        },
      ],
    });
  };

  const handleOnChangeStockSymbol = (event) => setStockSymbol(event.target.value);

  const getStockMonthPeriodData = (symbol, period) => {
    const subMonthsDate = format(subMonths(new Date(), period), 'yyyy-MM-dd');
    getStockPeriodData(symbol, subMonthsDate);
  };

  const handleOnChangeStockMonthPeriodDate = (period) => {
    getStockMonthPeriodData(stockSymbol, period);
  };

  const handleOnClick = () => {
    for (const element of document.getElementsByName('period')) {
      element.checked = false;
    }

    getStockData(stockSymbol);
    getStockPrice(stockSymbol);
    handleOnChangeStockMonthPeriodDate(1);
    setShow(true);
  };

  return (
    <>
      <ErrorMessage errorMessage={errorMessage} isShow={isShow} />
      <div className="app">
        <Header
          isShow={isShow}
          stockName={stockData.name}
          stockPrice={stockPrice}
          stockSymbol={stockSymbol}
          onChange={handleOnChangeStockSymbol}
          onClick={handleOnClick}
        />
        <StockChartPeriod
          isShow={isShow}
          stockSymbol={stockSymbol}
          getStockPeriodData={getStockPeriodData}
          handleOnChangeStockMonthPeriodDate={handleOnChangeStockMonthPeriodDate}
        />
        <LineChart stockMonthData={stockMonthData} />
      </div>
    </>
  );
}

export default App;
