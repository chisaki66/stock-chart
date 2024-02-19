import { useEffect , useState } from 'react'
import './App.css';
import axios from 'axios'
import LineChart from './LineChart'

function App() {
  const URL = "http://api.marketstack.com/v1/tickers";
  const ACCESS_KEY = `${process.env.REACT_APP_STOCK_CHART_API}`;

  const [stockData, setStockData] = useState({})
  const [stockPrice, setStockPrice] = useState({});

  useEffect(() => {
    const getStockData = (symbol) => {
        axios.get(`${URL}/${symbol}?access_key=${ACCESS_KEY}`)
        .then(response => {
            setStockData(response.data)
        });
        axios.get(`${URL}/${symbol}/eod/latest?access_key=${ACCESS_KEY}`)
        .then(response => {
            setStockPrice(response.data);
        })
    }
    getStockData('AAPL');
  },[]);

  return (
    <div className="App">
      <h1>{ stockData.name }</h1>
      <h2>${ stockPrice.close }</h2>
      <LineChart />
    </div>
  );
}

export default App;
