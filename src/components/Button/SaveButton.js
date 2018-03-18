import React from "react";
import PropTypes from 'prop-types';
import "./SaveButton.css"

const Button = ({ clsName = 'button-block', onClick, children }) =>
  <button
    type="button"
    className={clsName}
    onClick={onClick}>
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
Button.defaultProps = {
  className: '',
};

export default Button;