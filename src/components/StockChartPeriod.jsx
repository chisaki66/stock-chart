import React from 'react';
import PropTypes from 'prop-types';
import { format, subDays } from 'date-fns';
import './StockChartPeriod.scss';

StockChartPeriod.propTypes = {
  isShow: PropTypes.bool.isRequired,
  stockSymbol: PropTypes.string.isRequired,
  getStockPeriodData: PropTypes.func.isRequired,
  handleOnChangeStockMonthPeriodDate: PropTypes.func.isRequired,
};

function StockChartPeriod({
  isShow,
  stockSymbol,
  getStockPeriodData,
  handleOnChangeStockMonthPeriodDate,
}) {
  const getStockDayPeriodData = (symbol, period) => {
    const subDaysDate = format(subDays(new Date(), period), 'yyyy-MM-dd');
    getStockPeriodData(symbol, subDaysDate);
  };

  const handleOnChangeStockDayPeriodDate = (period) => {
    getStockDayPeriodData(stockSymbol, period);
  };

  return (
    <>
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
    </>
  );
}

export default StockChartPeriod;
