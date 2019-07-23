import React from "react";
import PropTypes from "prop-types";

export default function Checkbox({ label, checked, ...rest }) {
  return (
    <label>
      <input
        className="react-describe-checkbox-input"
        type="checkbox"
        checked={checked}
        {...rest}
      />

      <span className="react-describe-checkbox" data-checked={checked}>
        <span>{label}</span>
        {/* https://feathericons.com/ */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
};
