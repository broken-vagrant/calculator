import React from "react";
import "./App.scss";
// /^(\d*(\.\d+)?(e[+\-]\d*(\.\d+)?)?\s?[%x\/\*+\-]\s?)*\d*(\.\d+)?(e[+\-]\d+(\.\d+)?)?$/g

const KeyPad = () => {
  return (
    <div className="btn-container">
      <div className="buttons">
        <div className="left-panel">
          <button id="clear">AC</button>
          <button>Back</button>
          <button>%</button>
          <button id="seven">7</button>
          <button id="eight">8</button>
          <button id="nine">9</button>
          <button id="four">4</button>
          <button id="five">5</button>
          <button id="six">6</button>
          <button id="one">1</button>
          <button id="two">2</button>
          <button id="three">3</button>
          <button id="zero">0</button>
          <button id="decimal">.</button>
        </div>
        <div className="right-panel">
          <button id="divide">/</button>
          <button id="multiply">*</button>
          <button id="subtract">-</button>
          <button id="add">+</button>
          <button className="green" id="equals">
            =
          </button>
        </div>
      </div>
    </div>
  );
};
const App = () => {
  const [inputVal, setInputVal] = React.useState({ input: "", error: "" });

  function handleInputChange(e) {
    setInputVal((state) => ({ ...state, input: e.target.value }));
  }
  function sanitize(input) {
    return input.replace(/[^-()\d/*+.e%]/g, "");
  }
  function evil(fnString) {
    // eslint-disable-next-line
    // NEVER USE EVAL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
    return new Function('"use strict";return ' + fnString)();
  }
  const handleSomeSpecialCases = (inputVal) => {
    // only for FCC testing purpose
    // handle decimal
    inputVal = inputVal.replace(/\s?(\.\s?){2,}\s?/gi, "."); // 5..5 -> 5.5
    inputVal = inputVal.replace(/(\d*)\.(\d+)\.(\d*)/gi, "$1.$2$3"); // 5.5.5 -> 5.55

    // handle 2 or more consecutive operators
    // 5 * - + 5 = 10
    // 5 ++ 5 = 10
    inputVal = inputVal.replace(
      /(\d+)((\s?[+\-*x/]\s?){2,})(\.?\d*)/g,
      (match, left, ops, _1, right) => {
        let operators = ops.trim().split(/\s?/);
        if (operators.length > 2) {
          return left + operators.pop() + right;
        } else if (operators.length === 2) {
          if (
            operators[0].search(/[/*%]/g) !== -1 &&
            operators[1].search(/-+/g) !== -1
          ) {
            return match;
          } else {
            return left + operators.pop() + right;
          }
        }
      }
    );
    return inputVal;
  };
  React.useEffect(() => {
    function handleClick(e) {
      let target = e.target;
      if (target.tagName !== "BUTTON") {
        return;
      }
      let text = target.textContent;
      if (!text) {
        return;
      }
      if (text.search(/^[0-9]|[%\-*+/.]$/gi) !== -1) {
        // do below for all button presses expect `=`

        setInputVal(({ input: inputVal, ...other }) => {
          if (inputVal.search(/^0/) !== -1) {
            return { ...other, input: inputVal.slice(1) + text };
          }
          inputVal = handleSomeSpecialCases(inputVal);
          return { ...other, input: inputVal + text };
        });
      } else if (text === "=") {
        setInputVal(({ input: inputVal }) => {
          try {
            inputVal = sanitize(inputVal);
            let result = evil(inputVal);
            return { error: "", input: result.toString() };
          } catch (err) {
            console.log(err);
            return { error: "Malformed expression", input: inputVal };
          }
        });
      } else if (text === "AC") {
        setInputVal({ input: "0", error: "" });
      } else if (text === "Back") {
        if (inputVal !== "") {
          setInputVal(({ input: inputVal, ...other }) => ({
            input: inputVal.slice(0, inputVal.length - 1),
            ...other,
          }));
        }
      }
    }

    function handleEnterKeyPress(e) {
      if (e.keyCode !== 13) {
        return;
      }
      setInputVal(({ input: inputVal }) => {
        try {
          inputVal = sanitize(inputVal);
          let result = evil(inputVal);
          return { error: "", input: result.toString() };
        } catch (err) {
          console.log(err);
          return { input: inputVal, error: "Malformed expression" }; // we are inside react state updater function
        }
      });
    }

    document.body.addEventListener("click", handleClick);
    document.body.addEventListener("keypress", handleEnterKeyPress);
    return () => {
      document.body.removeEventListener("click", handleClick);
      document.body.removeEventListener("keypress", handleEnterKeyPress);
    };
    // eslint-disable-next-line
  }, []); // effect will be applied one time after render
  return (
    <div className="calc">
      <h2>Calculator</h2>
      <div className={`screen ${inputVal.error ? "error-active" : ""}`}>
        <label htmlFor="display" className="sr-only">
          enter input for calculation
        </label>
        <input
          id="display"
          onChange={handleInputChange}
          value={inputVal.input}
          name="calcInput"
        />
      </div>
      <div className={`error ${inputVal.error ? "error-active" : ""}`}>
        {inputVal.error}
      </div>
      <KeyPad />
    </div>
  );
};

export default App;
