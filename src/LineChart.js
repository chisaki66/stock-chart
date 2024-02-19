import React,{ useState, useEffect } from 'react'
import './LineChart.css'
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios'

Chart.register(...registerables);

function LineChart() {
  const URL = "http://api.marketstack.com/v1/eod";
  const API_KEY = `${process.env.REACT_APP_STOCK_CHART_API}`;

  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const getStockData = async (symbol) => {
      let data = [];
      let labels = [];
      await axios.get(`${URL}?access_key=${API_KEY}&symbols=${symbol}&date_from=2024-01-17&date_to=2024-02-16&sort=ASC`)
        .then(response => {
          for ( let stock of response.data.data){
            data.push(stock.close)
            labels.push(stock.date)
          }
      });
      setStockData({
        labels: labels,
        datasets:[
          {
            borderColor: 'rgba(35,200,153,1)',
            data: data,
          }
        ]
      })
      }
      getStockData('AAPL');
  },[]);

  return (
    <div className="chart">
        {stockData && <Line data={stockData} />}
    </div>
  )
}

export default LineChart
