const score = document.getElementById("score");
const nameEl = document.getElementById("name");

function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

class Frame {
  constructor(score) {
    this.marks = [score];
    this.sum = score;
  }

  add = (score) => {
    this.sum += score;
    this.marks.push(score);
  };

  isStrike = () => {
    return this.marks.length === 1 && this.sum === 10;
  };

  isSpare = () => {
    return this.marks.length === 2 && this.sum === 10;
  };
}

class Bowling {
  constructor(name) {
    this.score = [];
    nameEl.textContent = name;
  }

  printFrame = (i) => {
    let score = `<div>${this.score[i].marks.join(" ")}</div>`;
    if (this.score[i].isStrike()) {
      score += `<div>X</div>`;
    }
    if (this.score[i].isSpare()) {
      score += `<div>/</div>`;
    }

    return score;
  };

  bowlFinalFrame = () => {
    let score = randomizer(10);
    const frame = new Frame(score);

    // strike again
    if (score === 10) {
      score = randomizer(10);
      frame.add(score);

      const finalRandom = score === 10 ? 10 : 10 - score;
      frame.add(randomizer(finalRandom));
    } else {
      score = randomizer(10 - score);
      frame.add(score);

      // spare
      if (frame[0] + frame[1] === 10) {
        score = randomizer(10);
        frame.add(score);
      }
    }

    this.score.push(frame);
  };

  bowl = () => {
    const score = randomizer(10);
    const frame = new Frame(score);

    if (score !== 10) {
      frame.add(randomizer(10 - score));
    }

    this.score.push(frame);
  };
}

const FRAMES = 10;
const game = new Bowling("Travis");
const frameEls = document.querySelectorAll(".frames li");

for (let i = 0; i < FRAMES; i++) {
  i < FRAMES - 1 ? game.bowl() : game.bowlFinalFrame();
  frameEls[i].innerHTML = game.printFrame(i);
}
