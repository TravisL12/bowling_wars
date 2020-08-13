function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
  //   return 10;
}

function bowl(frameNumber) {
  return frameNumber < FRAMES - 1
    ? bowling.bowlFrame()
    : bowling.bowlFinalFrame();
}
const bowling = {
  bowlFinalFrame: () => {
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

    return frame;
  },

  bowlFrame: () => {
    const score = randomizer(10);
    const frame = new Frame(score);

    if (!frame.isStrike()) {
      frame.add(randomizer(10 - score));
    }

    return frame;
  },
};

function buildScorecard(name) {
  const scoreMarkup = `
        <li class="frame">
              <div class="scores">
                <span class="roll roll1"></span>
                <span class="roll roll2"></span>
              </div>
              <div class="score"></div>
        </li>`;
  const template = document.createElement("template");
  template.innerHTML = `
      <div class="player">
          <span>${name}</span>
          <ul>
            ${Array(FRAMES - 1)
              .fill(scoreMarkup)
              .join("")}
            <li class="tenth frame">
              <div class="scores">
                <span class="roll roll1"></span>
                <span class="roll roll2"></span>
                <span class="roll roll3"></span>
              </div>
            <div class="score"></div>
        </li>
          </ul>
          <span class="total"></span>
        </div>
    `;
  return template.content.firstElementChild;
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

class Player {
  constructor(name) {
    this.frames = [];
    this.score = 0;
    this.scoreCard = buildScorecard(name);
    this.framesEl = this.scoreCard.querySelectorAll(".player .frame");
    bowlingEl.appendChild(this.scoreCard);
  }

  addFrame = (frame) => {
    this.score += frame.sum();
    this.frames.push(frame);
    const totalEl = this.scoreCard.querySelector(".total");
    totalEl.textContent = `Total: ${this.score}`;
  };

  addClass = (frameEl, selector, result) => {
    frameEl.querySelector(selector).textContent = result;
    if (result === STRIKE) {
      frameEl.querySelector(selector).classList.add("strike");
    }
    if (result === SPARE) {
      frameEl.querySelector(selector).classList.add("spare");
    }
  };

  renderFrame = (i) => {
    const frame = this.frames[i];
    const frameEl = this.framesEl[i];
    const [roll1, roll2, roll3] = frame.marks;

    const result1 =
      (roll1 === 10 && frame.tenthFrame) || frame.isStrike() ? STRIKE : roll1;

    const result2 =
      roll1 === 10 && roll2 === 10 && frame.tenthFrame
        ? STRIKE
        : roll1 + roll2 === 10
        ? SPARE
        : roll2;

    this.addClass(frameEl, ".roll1", result1);
    this.addClass(frameEl, ".roll2", result2);

    if (roll3) {
      const result3 =
        roll1 === 10 && roll2 === 10 && roll3 === 10 && frame.tenthFrame
          ? STRIKE
          : roll2 + roll3 === 10
          ? SPARE
          : roll3;
      this.addClass(frameEl, ".roll3", result3);
    }

    this.updateScore();
  };

  twoRollsScore = (i) => {
    const firstNextFrame = this.frames[i + 1];
    const secondNextFrame = this.frames[i + 2];
    return firstNextFrame
      ? firstNextFrame.marks.concat(secondNextFrame?.marks || []).slice(0, 2)
      : [];
  };

  updateScore = () => {
    let summedScore = 0;
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      const frameEl = this.framesEl[i];
      const [roll1, roll2] = this.twoRollsScore(i);

      if (frame.isStrike()) {
        summedScore =
          (roll1 || roll1 === 0) && (roll2 || roll2 === 0)
            ? summedScore + frame.sum() + roll1 + roll2
            : summedScore;
      } else if (frame.isSpare()) {
        summedScore =
          roll1 || roll1 === 0
            ? summedScore + frame.sum() + roll1
            : summedScore;
      } else {
        summedScore += frame.sum();
      }
      frameEl.querySelector(".score").textContent = summedScore;
    }
    this.score = summedScore;
  };
}

class Game {
  constructor(players) {
    this.players = players.map((name) => new Player(name));
    this.frameNumber = 0;
  }

  play = () => {
    for (let i = 0; i < this.players.length; i++) {
      const frame = bowl(this.frameNumber);
      const player = this.players[i];
      player.addFrame(frame);
      player.renderFrame(this.frameNumber);
    }
    this.frameNumber++;
  };
}

const FRAMES = 10;
const STRIKE = "X";
const SPARE = "/";
const bowlingEl = document.getElementById("bowling");
const game = new Game(["Travis", "Marisa", "Connor", "Harper"]);
// const game = new Game(["Travis"]);

for (let i = 0; i < FRAMES; i++) {
  game.play();
}
