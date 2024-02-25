import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

Header.propTypes = {
  isShow: PropTypes.bool.isRequired,
  stockName: PropTypes.string.isRequired,
  stockPrice: PropTypes.func.isRequired,
  stockSymbol: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

function Header({ isShow, stockName, stockPrice, stockSymbol, onChange, onClick }) {
  return (
    <div className="header">
      {isShow ? (
        <div className="stock-data">
          <h1>{stockName}</h1>
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
            onChange={onChange}
          />
          <button onClick={onClick}></button>
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
  );
}

export default Header;
