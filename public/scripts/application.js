function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

class Frame {
  constructor(score, tenthFrame) {
    this.marks = [score];
    this.tenthFrame = tenthFrame;
  }

  sum = () => this.marks.reduce((sum, m) => (sum += m), 0);

  add = (score) => this.marks.push(score);

  isStrike = () => this.marks.length === 1 && this.sum() === 10;

  isSpare = () => this.marks.length === 2 && this.sum() === 10;
}

class Bowling {
  constructor() {
    this.score = 0;
    this.frames = [];
  }

  printFrame = (i) => {
    let score = `<div>${this.frames[i].marks.join(' ')}</div>`;
    if (this.frames[i].isStrike()) {
      score += `<div>X</div>`;
    }
    if (this.frames[i].isSpare()) {
      score += `<div>/</div>`;
    }

    return score;
  };

  bowlFinalFrame = () => {
    let score = randomizer(10);
    const frame = new Frame(score, true);

    if (frame.isStrike()) {
      score = randomizer(10);
      frame.add(score);

      const finalRandom = score === 10 ? 10 : 10 - score;
      frame.add(randomizer(finalRandom));
    } else {
      score = randomizer(10 - score);
      frame.add(score);

      if (frame.isSpare()) {
        score = randomizer(10);
        frame.add(score);
      }
    }

    this.frames.push(frame);
    this.score += frame.sum();
  };

  bowlFrame = () => {
    const score = randomizer(10);
    const frame = new Frame(score);

    if (!frame.isStrike()) {
      frame.add(randomizer(10 - score));
    }

    this.frames.push(frame);
    this.score += frame.sum();
  };
}

class Game {
  constructor(name) {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="frames">
          <span id="name">${name}</span>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <span id="score"></span>
        </div>
    `;
    bowlingEl.appendChild(template.content.firstElementChild);
  }
}

const bowlingEl = document.getElementById('bowling');
new Game('Travis');
const scoreEl = document.getElementById('score');

const FRAMES = 10;
const game = new Bowling();
const frameEls = document.querySelectorAll('.frames li');

for (let i = 0; i < FRAMES; i++) {
  i < FRAMES - 1 ? game.bowlFrame() : game.bowlFinalFrame();
  frameEls[i].innerHTML = game.printFrame(i);
  scoreEl.textContent = `Score: ${game.score}`;
}
