const score = document.getElementById("score");

function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

class Bowling {
  constructor(name) {
    this.name = name;
    this.score = [];
  }

  finalFrame = () => {
    let score = randomizer(10);
    const frame = [score];

    // strike again
    if (score === 10) {
      score = randomizer(10);
      frame.push(score);

      const finalRandom = score === 10 ? 10 : 10 - score;
      frame.push(randomizer(finalRandom));
    } else {
      score = randomizer(10 - score);
      frame.push(score);

      // spare
      if (frame[0] + frame[1] === 10) {
        score = randomizer(10);
        frame.push(score);
      }
    }

    this.score.push(frame);
  };

  bowl = () => {
    const score = randomizer(10);
    const frame = [score];

    if (score !== 10) {
      frame.push(randomizer(10 - score));
    }

    this.score.push(frame);
  };
}

const FRAMES = 10;
const game = new Bowling("Travis");
const frameEls = document.querySelectorAll(".frames li");

for (let i = 0; i < FRAMES; i++) {
  i < FRAMES - 1 ? game.bowl() : game.finalFrame();
  frameEls[i].textContent = game.score[i].join(" ");
}
