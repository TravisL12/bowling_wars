import React from "react";
import { PINS, STRIKE, SPARE } from "../App";

function Frame({ frameInfo }) {
  const renderFinalFrame = () => {
    const [roll1, roll2, roll3] = frameInfo.rolls;
    const results = [];
    const result1 = roll1 === PINS ? STRIKE : roll1;
    results.push(result1);

    const result2 =
      roll1 === PINS && roll2 === PINS
        ? STRIKE
        : roll1 < PINS && roll1 + roll2 === PINS
        ? SPARE
        : roll2;
    results.push(result2);

    if (roll3) {
      const allStrikes = roll1 === PINS && roll2 === PINS && roll3 === PINS;
      const spareAndStrike = roll1 + roll2 === PINS && roll3 === PINS;
      const strikeAndSpare = roll1 === PINS && roll2 + roll3 === PINS;

      const result3 =
        allStrikes || spareAndStrike ? STRIKE : strikeAndSpare ? SPARE : roll3;
      results.push(result3);
    }

    return results;
  };

  const renderFrame = () => {
    const [roll1, roll2] = frameInfo.rolls;
    const result1 = frameInfo.isStrike() ? STRIKE : roll1;
    const result2 = frameInfo.isSpare() ? SPARE : roll2;
    return [result1, result2];
  };

  const addMarkStyle = (result) => {
    if (result === STRIKE) {
      return "strike";
    }
    if (result === SPARE) {
      return "spare";
    }
  };

  const results = frameInfo.isFinalFrame ? renderFinalFrame() : renderFrame();

  return (
    <li className={`frame ${frameInfo.isFinalFrame ? "tenth" : ""}`}>
      <div className="scores">
        <span className={`roll roll1 ${addMarkStyle(results[0])}`}>
          {results[0]}
        </span>
        <span className={`roll roll2 ${addMarkStyle(results[1])}`}>
          {results[1]}
        </span>
        {frameInfo.isFinalFrame && (
          <span className="roll roll3">{results[2]}</span>
        )}
      </div>
      <div className="score">{frameInfo.score}</div>
    </li>
  );
}

export default Frame;
