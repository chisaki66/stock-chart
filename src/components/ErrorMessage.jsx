import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessage.scss';

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
};

function ErrorMessage({ errorMessage, isShow }) {
  return (
    <>
      {errorMessage && !isShow ? (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      ) : null}
    </>
  );
}

export default ErrorMessage;
