import React from 'react'
import { Line } from 'react-chartjs-2';
import './LineChart.scss'

function LineChart({ stockMonthData }) {
  return (
    <div className="LineChart">
        {stockMonthData && <Line data={stockMonthData} />}
    </div>
  )
}

export default LineChart
