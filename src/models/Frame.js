import { PINS } from "../components/App";

class Frame {
  constructor(score, isFinalFrame) {
    this.rolls = [score];
    this.isFinalFrame = isFinalFrame;
  }

  sum = () => this.rolls.reduce((sum, m) => (sum += m), 0);
  add = (score) => this.rolls.push(score);
  isStrike = () => this.rolls.length === 1 && this.sum() === PINS;
  isSpare = () => this.rolls.length === 2 && this.sum() === PINS;
}

export default Frame;
