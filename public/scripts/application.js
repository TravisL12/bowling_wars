function randomizer(max = 1, min = 0) {
  //   return Math.round(Math.random() * (max - min) + min);
  return 10;
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

  renderFrame = (i) => {
    const [roll1, roll2] = this.frames[i].marks;
    const frameEl = this.framesEl[i];
    frameEl.querySelector(".roll1").textContent = this.frames[i].isStrike()
      ? STRIKE
      : roll1;
    frameEl.querySelector(".roll2").textContent = this.frames[i].isSpare()
      ? SPARE
      : roll2;
    this.drawScores();
  };

  drawScores = () => {
    let summedScore = 0;
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      const frameEl = this.framesEl[i];

      if (frame.isStrike()) {
        const first = this.frames[i + 1];
        const second = this.frames[i + 2];
        if (first && second) {
          if (first.isStrike() && second.isStrike()) {
            summedScore += frame.sum() + first.sum() + second.sum();
          } else if (first.isStrike()) {
            summedScore += frame.sum() + first.sum() + second.marks[0];
          } else {
            summedScore += frame.sum() + first.sum();
          }
          frameEl.querySelector(".score").textContent = summedScore;
        } else {
          frameEl.querySelector(".score").textContent = "-";
        }
      } else if (frame.isSpare()) {
        const first = this.frames[i + 1];
        if (first) {
          summedScore += frame.sum() + first.sum();
          frameEl.querySelector(".score").textContent = summedScore;
        } else {
          frameEl.querySelector(".score").textContent = "-";
        }
      } else {
        summedScore += frame.sum();
        frameEl.querySelector(".score").textContent = summedScore;
      }
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

for (let i = 0; i < FRAMES; i++) {
  game.play();
}
