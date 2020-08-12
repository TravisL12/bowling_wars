function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
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
  const template = document.createElement('template');
  const framesList = Array(FRAMES).fill('<li></li>').join('');
  template.innerHTML = `
      <div class="frames">
          <span>${name}</span>
          <ul>${framesList}</ul>
          <span class="score"></span>
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
    this.framesEl = this.scoreCard.querySelectorAll('.frames li');
    bowlingEl.appendChild(this.scoreCard);
  }

  addFrame = (frame) => {
    this.score += frame.sum();
    this.frames.push(frame);
    const scoreEl = this.scoreCard.querySelector('.score');
    scoreEl.textContent = `Score: ${this.score}`;
  };

  printFrame = (i) => {
    let score = `<div>${this.frames[i].marks.join(' ')}</div>`;
    if (this.frames[i].isStrike()) {
      score += `<div>X</div>`;
    }
    if (this.frames[i].isSpare()) {
      score += `<div>/</div>`;
    }

    this.framesEl[i].innerHTML = score;
  };
}

class Game {
  constructor(players) {
    this.players = players.map((name) => new Player(name));
    this.frameNumber = 0;
  }

  play = () => {
    for (let i = 0; i < this.players.length; i++) {
      const frame =
        this.frameNumber < FRAMES - 1
          ? bowling.bowlFrame()
          : bowling.bowlFinalFrame();
      const player = this.players[i];
      player.addFrame(frame);
      player.printFrame(this.frameNumber);
    }
    this.frameNumber++;
  };
}

const FRAMES = 10;
const bowlingEl = document.getElementById('bowling');
const game = new Game(['Travis', 'Marisa', 'Connor', 'Harper']);

for (let i = 0; i < FRAMES; i++) {
  game.play();
}
