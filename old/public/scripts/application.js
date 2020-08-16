// function randomizer(max = 1, min = 0) {
//   return Math.round(Math.random() * (max - min) + min);
// }

// const bowlFinalFrame = () => {
//   let score = randomizer(PINS);
//   const frame = new Frame(score);

//   if (frame.isStrike()) {
//     score = randomizer(PINS);
//     frame.add(score);

//     const finalRandom = score === PINS ? PINS : PINS - score;
//     frame.add(randomizer(finalRandom));
//   } else {
//     score = randomizer(PINS - score);
//     frame.add(score);

//     if (frame.isSpare()) {
//       score = randomizer(PINS);
//       frame.add(score);
//     }
//   }

//   return frame;
// };

// const bowlFrame = () => {
//   const score = randomizer(PINS);
//   const frame = new Frame(score);

//   if (!frame.isStrike()) {
//     frame.add(randomizer(PINS - score));
//   }

//   return frame;
// };

// function addMarkStyle(frameEl, selector, result) {
//   const frame = frameEl.querySelector(selector);
//   frame.textContent = result;
//   if (result === STRIKE) {
//     frame.classList.add("strike");
//   }
//   if (result === SPARE) {
//     frame.classList.add("spare");
//   }
// }

// function buildScorecard(name) {
//   const template = document.createElement("template");
//   const scoreMarkup = `
//         <li class="frame">
//               <div class="scores">
//                 <span class="roll roll1"></span>
//                 <span class="roll roll2"></span>
//               </div>
//               <div class="score"></div>
//         </li>`;
//   template.innerHTML = `
//       <div class="player">
//           <ul>
//             ${Array(FRAMES - 1)
//               .fill(scoreMarkup)
//               .join("")}
//             <li class="tenth frame">
//               <div class="scores">
//                 <span class="roll roll1"></span>
//                 <span class="roll roll2"></span>
//                 <span class="roll roll3"></span>
//               </div>
//               <div class="score"></div>
//             </li>
//             <li>
//               <div class="name">${name}</div>
//               <div class="total"></div>
//             </li>
//           </ul>
//         </div>
//     `;
//   return template.content.firstElementChild;
// }

// class Frame {
//   constructor(score) {
//     this.rolls = [score];
//   }

//   sum = () => this.rolls.reduce((sum, m) => (sum += m), 0);
//   add = (score) => this.rolls.push(score);
//   isStrike = () => this.rolls.length === 1 && this.sum() === PINS;
//   isSpare = () => this.rolls.length === 2 && this.sum() === PINS;
// }

class Player {
  constructor(name) {
    this.frames = [];
    this.score = 0;
    this.scoreCard = buildScorecard(name);
    this.framesEl = this.scoreCard.querySelectorAll(".player .frame");
    this.name = name;
    bowlingEl.appendChild(this.scoreCard);
  }

  // renderFinalFrame = (i) => {
  //   const frame = this.frames[i];
  //   const frameEl = this.framesEl[i];
  //   const [roll1, roll2, roll3] = frame.rolls;

  //   const result1 = roll1 === PINS ? STRIKE : roll1;

  //   const result2 =
  //     roll1 === PINS && roll2 === PINS
  //       ? STRIKE
  //       : roll1 < PINS && roll1 + roll2 === PINS
  //       ? SPARE
  //       : roll2;

  //   addMarkStyle(frameEl, ".roll1", result1);
  //   addMarkStyle(frameEl, ".roll2", result2);

  //   if (roll3) {
  //     const allStrikes = roll1 === PINS && roll2 === PINS && roll3 === PINS;
  //     const spareAndStrike = roll1 + roll2 === PINS && roll3 === PINS;
  //     const strikeAndSpare = roll1 === PINS && roll2 + roll3 === PINS;

  //     const result3 =
  //       allStrikes || spareAndStrike ? STRIKE : strikeAndSpare ? SPARE : roll3;
  //     addMarkStyle(frameEl, ".roll3", result3);
  //   }

  //   this.updateScore();
  // };

  // renderFrame = (i) => {
  //   const frame = this.frames[i];
  //   const frameEl = this.framesEl[i];
  //   const [roll1, roll2] = frame.rolls;

  //   const result1 = frame.isStrike() ? STRIKE : roll1;
  //   addMarkStyle(frameEl, ".roll1", result1);

  //   const result2 = frame.isSpare() ? SPARE : roll2;
  //   addMarkStyle(frameEl, ".roll2", result2);

  //   this.updateScore();
  // };

  // twoRollsScore = (i) => {
  //   const firstNextFrame = this.frames[i + 1];
  //   const secondNextFrame = this.frames[i + 2];
  //   return firstNextFrame
  //     ? firstNextFrame.rolls.concat(secondNextFrame?.rolls || []).slice(0, 2)
  //     : [];
  // };

  updateScore = () => {
    let summedScore = 0;
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      const frameEl = this.framesEl[i];
      frameEl.classList.add("played");
      const [nextRoll1, nextRoll2] = this.twoRollsScore(i);
      const nextRoll1Exist = nextRoll1 || nextRoll1 === 0;
      const nextRoll2Exist = nextRoll2 || nextRoll2 === 0;

      if (frame.isStrike()) {
        summedScore =
          nextRoll1Exist && nextRoll2Exist
            ? summedScore + frame.sum() + nextRoll1 + nextRoll2
            : summedScore;
      } else if (frame.isSpare()) {
        summedScore = nextRoll1Exist
          ? summedScore + frame.sum() + nextRoll1
          : summedScore;
      } else {
        summedScore += frame.sum();
      }
      frameEl.querySelector(".score").textContent = summedScore;
    }
    this.score = summedScore;
    const totalEl = this.scoreCard.querySelector(".total");
    totalEl.textContent = `Total: ${this.score}`;
  };
}

// class Game {
//   constructor(players) {
//     this.players = players.map((name) => new Player(name));
//     this.frameNumber = 0;
//   }

//   play = () => {
//     for (let i = 0; i < this.players.length; i++) {
//       const player = this.players[i];
//       const isFinalFrame = this.frameNumber === FRAMES - 1;
//       const frame = !isFinalFrame ? bowlFrame() : bowlFinalFrame();

//       player.frames.push(frame);
//       isFinalFrame
//         ? player.renderFinalFrame(this.frameNumber)
//         : player.renderFrame(this.frameNumber);
//     }
//     this.frameNumber++;
//   };

//   getWinner = () => {
//     const winner = this.players.reduce(
//       (winner, player) => {
//         if (player.score > winner.score) {
//           winner = player;
//         }
//         return winner;
//       },
//       { score: 0 }
//     );
//     winner.scoreCard.style["background-color"] = "lightblue";
//   };
// }

// const FRAMES = 10;
// const PINS = 10;
// const STRIKE = "X";
// const SPARE = "/";
// const bowlingEl = document.getElementById("bowling");
// const game = new Game(["Travis", "Marisa", "Connor", "Harper"]);

let interval;
function play() {
  game.play();
  interval = setInterval(() => {
    game.play();
    if (game.frameNumber >= FRAMES) {
      clearInterval(interval);
      game.getWinner();
    }
  }, 250);
}

play();
