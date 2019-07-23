import React from "react";
import PropTypes from "prop-types";

export default function Radio({ label, checked, ...rest }) {
  return (
    <label>
      <input
        className="react-describe-radio-input"
        type="radio"
        checked={checked}
        {...rest}
      />

      <span className="react-describe-radio" data-checked={checked}>
        <span>{label}</span>
      </span>
    </label>
  );
}

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
};
