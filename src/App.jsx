import React, { useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, subMonths } from 'date-fns';
import './App.scss';

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

  const getStockDayPeriodData = (symbol, period) => {
    const subDaysDate = format(subDays(new Date(), period), 'yyyy-MM-dd');
    getStockPeriodData(symbol, subDaysDate);
  };

  const getStockMonthPeriodData = (symbol, period) => {
    const subMonthsDate = format(subMonths(new Date(), period), 'yyyy-MM-dd');
    getStockPeriodData(symbol, subMonthsDate);
  };

  const handleOnChangeStockDayPeriodDate = (period) => {
    getStockDayPeriodData(stockSymbol, period);
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
      {errorMessage && !isShow ? (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      ) : null}
      <div className="app">
        <div className="header">
          {isShow ? (
            <div className="stock-data">
              <h1>{stockData.name}</h1>
              <ul className="stock-data-list">
                <li>
                  始値
                  <br />
                  <b>{stockPrice.open}</b>
                </li>
                <li>
                  高値
                  <br />
                  <b>{stockPrice.high}</b>
                </li>
                <li>
                  安値
                  <br />
                  <b>{stockPrice.low}</b>
                </li>
                <li>
                  終値
                  <br />
                  <b>{stockPrice.close}</b>
                </li>
                <li>
                  出来高
                  <br />
                  <b>{stockPrice.volume}</b>
                </li>
              </ul>
              <p>※ 現地時刻の前日のデータを取得しています</p>
            </div>
          ) : null}
          <div className="stock-search">
            <div className="stock-search__form">
              <input
                type="text"
                name="symbol"
                placeholder="例: AAPL"
                value={stockSymbol}
                onChange={handleOnChangeStockSymbol}
              />
              <button onClick={handleOnClick}></button>
            </div>
            <div className="stock-search__text">
              <p>
                銘柄のリストは{' '}
                <a href="https://marketstack.com/search" target="_blank" rel="noopener noreferrer">
                  こちら
                </a>{' '}
                からご参照ください
                <br />
                Symbol をご入力ください
              </p>
            </div>
          </div>
        </div>
        {isShow ? (
          <div className="stock-chart-period">
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockDayPeriodDate(1)}
              />{' '}
              1日
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockDayPeriodDate(7)}
              />{' '}
              1週
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(1)}
              />{' '}
              1ヶ月
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(3)}
              />{' '}
              3ヶ月
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(6)}
              />{' '}
              6ヶ月
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(12)}
              />{' '}
              1年
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(24)}
              />{' '}
              2年
            </label>
            <label>
              <input
                type="radio"
                name="period"
                onChange={() => handleOnChangeStockMonthPeriodDate(36)}
              />{' '}
              3年
            </label>
          </div>
        ) : null}
        <div className="chart">{stockMonthData && <Line data={stockMonthData} />}</div>
      </div>
    </>
  );
}

export default App;
