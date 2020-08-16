import { PINS } from "./App";
import Frame from "../models/Frame";

function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

const bowlFinalFrame = () => {
  let score = randomizer(PINS);
  const frame = new Frame(score, true);

  if (frame.isStrike()) {
    score = randomizer(PINS);
    frame.add(score);

    const finalRandom = score === PINS ? PINS : PINS - score;
    frame.add(randomizer(finalRandom));
  } else {
    score = randomizer(PINS - score);
    frame.add(score);

    if (frame.isSpare()) {
      score = randomizer(PINS);
      frame.add(score);
    }
  }

  return frame;
};

const bowlFrame = () => {
  const score = randomizer(PINS);
  const frame = new Frame(score);

  if (!frame.isStrike()) {
    frame.add(randomizer(PINS - score));
  }

  return frame;
};

export { randomizer, bowlFinalFrame, bowlFrame };
