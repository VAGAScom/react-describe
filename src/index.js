import React, { useState, useEffect, useReducer } from "react";
import { string, object, func } from "prop-types";
import { parse } from "react-docgen";
import { generate as generateShortId } from "shortid";

import Checkbox from "./Checkbox";
import Radio from "./Radio";

import "./styles.css";

export function Describe({ src, initialState, children }) {
  const [parsedData, setParsedData] = useState();
  const [stringDescId] = useState(generateShortId());
  const [numberDescId] = useState(generateShortId());
  const [boolDescId] = useState(generateShortId());
  const [enumDescId] = useState(generateShortId());
  const [articleLabelId] = useState(generateShortId());
  const [articleDescId] = useState(generateShortId());

  function removeExtraQuotes(str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      return str.replace(/'/g, "");
    }
  }

  function reducer(state, { label, val, defaultVal }) {
    return {
      ...state,
      [label]:
        val !== undefined && val !== null
          ? val
          : initialState && initialState[label]
          ? initialState[label]
          : defaultVal && removeExtraQuotes(defaultVal)
    };
  }

  const [state, dispatch] = useReducer(
    reducer,
    initialState ? initialState : {}
  );

  useEffect(() => {
    setParsedData(parse(src));
  }, [src]);

  useEffect(() => {
    parsedData &&
      parsedData.props &&
      Object.entries(parsedData.props).map(([k, v]) => {
        return dispatch({
          label: k,
          defaultVal: v.defaultValue && v.defaultValue.value
        });
      });
  }, [parsedData]);

  const renderInput = ({ type, label, val, required, description }) => {
    switch (type) {
      case "string":
        return (
          <p className="react-describe-string-container">
            <label className="react-describe-string-label-container">
              <span className="react-describe-string-label-text">{label}</span>
              <input
                className="react-describe-string-input"
                type="text"
                value={state[label] || ""}
                onChange={ev => dispatch({ label, val: ev.target.value })}
                aria-describedby={stringDescId}
              />
            </label>
            {required ? (
              <strong className="react-describe-string-required">
                Required
              </strong>
            ) : (
              description && (
                <span className="react-describe-enum-required-spacing" />
              )
            )}
            {description && (
              <small
                className="react-describe-string-description"
                id={stringDescId}
              >
                {description}
              </small>
            )}
          </p>
        );
      case "number":
        return (
          <p className="react-describe-number-container">
            <label className="react-describe-number-label-container">
              <span className="react-describe-number-label-text">{label}</span>
              <input
                className="react-describe-number-input"
                type="number"
                value={state[label] || 0}
                onChange={ev =>
                  dispatch({ label, val: Number(ev.target.value) })
                }
                aria-describedby={numberDescId}
              />
            </label>
            {required ? (
              <strong className="react-describe-number-required">
                Required
              </strong>
            ) : (
              description && (
                <span className="react-describe-enum-required-spacing" />
              )
            )}
            {description && (
              <small
                className="react-describe-number-description"
                id={numberDescId}
              >
                {description}
              </small>
            )}
          </p>
        );
      case "bool":
        return (
          <p className="react-describe-bool-container">
            <Checkbox
              checked={state[label] || false}
              onChange={ev => dispatch({ label, val: ev.target.checked })}
              aria-describedby={boolDescId}
              label={label}
            />
            {required ? (
              <strong className="react-describe-bool-required">Required</strong>
            ) : (
              description && (
                <span className="react-describe-enum-required-spacing" />
              )
            )}
            {description && (
              <small
                className="react-describe-bool-description"
                id={boolDescId}
              >
                {description}
              </small>
            )}
          </p>
        );
      case "enum":
        return (
          <p className="react-describe-enum-container">
            <span className="react-describe-enum-label-text">{label}</span>
            <span
              className="react-describe-enum-group"
              role="radiogroup"
              aria-label={label}
              aria-describedby={enumDescId}
            >
              {val.map((v, i) => (
                <Radio
                  key={i}
                  checked={removeExtraQuotes(v.value) === state[label]}
                  onChange={() =>
                    dispatch({ label, val: removeExtraQuotes(v.value) })
                  }
                  label={removeExtraQuotes(v.value)}
                />
              ))}
            </span>
            {required ? (
              <strong className="react-describe-enum-required">Required</strong>
            ) : (
              description && (
                <span className="react-describe-enum-required-spacing" />
              )
            )}
            {description && (
              <small
                className="react-describe-enum-description"
                id={enumDescId}
              >
                {description}
              </small>
            )}
          </p>
        );
      default:
        return;
    }
  };

  return parsedData ? (
    <article
      className="react-describe-root"
      aria-labelledby={articleLabelId}
      aria-describedby={articleDescId}
    >
      <header className="react-describe-header">
        {parsedData.displayName && (
          <h1 className="react-describe-title" id={articleLabelId}>
            {parsedData.displayName}
          </h1>
        )}
        {parsedData.description && (
          <p className="react-describe-description" id={articleDescId}>
            {parsedData.description}
          </p>
        )}
      </header>
      <div className="react-describe-editor-container">
        <section
          className="react-describe-editor-preview"
          aria-label={`${parsedData.displayName} preview`}
        >
          {children(state)}
        </section>

        <section
          className="react-describe-editor-sidebar"
          aria-label={`${parsedData.displayName} side bar`}
        >
          <form
            className="react-describe-editor-sidebar-form"
            aria-label="prop inputs"
          >
            {parsedData.props &&
              Object.entries(parsedData.props).map(
                ([k, v], i) =>
                  ["string", "number", "bool", "enum"].includes(
                    v.type.name
                  ) && (
                    <div className="react-describe-container" key={i}>
                      {renderInput({
                        type: v.type.name,
                        label: k,
                        val: v.type.value,
                        required: v.required,
                        description: v.description
                      })}
                    </div>
                  )
              )}
          </form>
        </section>
      </div>
      <section
        className="react-describe-output-container"
        aria-label={`${parsedData.displayName} code output`}
      >
        <pre className="react-describe-output-pre">
          <code className="react-describe-output-code">
            {`<${parsedData.displayName &&
              parsedData.displayName} ${Object.entries(state).map(([k, v]) =>
              v ? k + "={" + JSON.stringify(v) + "}" : ""
            )} />`
              .replace(/,/g, " ")
              .replace(/\s+/g, " ")}
          </code>
        </pre>
      </section>
    </article>
  ) : null;
}

Describe.propTypes = {
  src: string.isRequired,
  initialState: object,
  children: func.isRequired
};
