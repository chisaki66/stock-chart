import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import './LineChart.scss';

LineChart.propTypes = {
  stockMonthData: PropTypes.func.isRequired,
};

function LineChart({ stockMonthData }) {
  return (
    <>
      <div className="line-chart">{stockMonthData ? <Line data={stockMonthData} /> : null}</div>
    </>
  );
}

export default LineChart;
