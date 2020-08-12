function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
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
  const template = document.createElement('template');
  template.innerHTML = `
      <div class="player">
          <span>${name}</span>
          <ul>${Array(FRAMES).fill(scoreMarkup).join('')}</ul>
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
    this.framesEl = this.scoreCard.querySelectorAll('.player .frame');
    bowlingEl.appendChild(this.scoreCard);
  }

  addFrame = (frame) => {
    this.score += frame.sum();
    this.frames.push(frame);
    const totalEl = this.scoreCard.querySelector('.total');
    totalEl.textContent = `Total: ${this.score}`;
  };

  renderFrame = (i) => {
    const [roll1, roll2] = this.frames[i].marks;
    const frame = this.framesEl[i];
    frame.querySelector('.roll1').textContent = this.frames[i].isStrike()
      ? STRIKE
      : roll1;
    frame.querySelector('.roll2').textContent = this.frames[i].isSpare()
      ? SPARE
      : roll2;
    frame.querySelector('.score').textContent = this.frames[i].sum();
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
const STRIKE = 'X';
const SPARE = '/';
const bowlingEl = document.getElementById('bowling');
const game = new Game(['Travis', 'Marisa', 'Connor', 'Harper']);

for (let i = 0; i < FRAMES; i++) {
  game.play();
}
