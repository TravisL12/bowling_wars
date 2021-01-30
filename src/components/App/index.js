import React, { useState } from 'react';
import './App.css';
import Player from '../Player';
import { bowlFrame, bowlFinalFrame } from '../utilities';

export const FRAMES = 10;
export const PINS = 10;
export const STRIKE = 'X';
export const SPARE = '/';

function App() {
  const [frameNumber, setFrameNumber] = useState(0);
  const [players, setPlayers] = useState([
    { name: 'Travis', frames: [], score: 0, winner: false },
    { name: 'Marisa', frames: [], score: 0, winner: false },
    { name: 'Connor', frames: [], score: 0, winner: false },
    { name: 'Harper', frames: [], score: 0, winner: false },
  ]);

  const play = () => {
    const playersCopy = [...players];
    for (let i = 0; i < playersCopy.length; i++) {
      const player = playersCopy[i];
      const isFinalFrame = frameNumber === FRAMES - 1;
      const frame = !isFinalFrame ? bowlFrame() : bowlFinalFrame();

      player.frames.push(frame);
    }

    if (frameNumber === FRAMES - 1) {
      const winnerIdx = getWinner();
      playersCopy[winnerIdx].winner = true;
    }
    setPlayers(playersCopy);
    setFrameNumber(frameNumber + 1);
  };

  const getWinner = () => {
    const winnerIdx = players.reduce(
      (winner, player, idx) => {
        if (player.score > winner.score) {
          winner.idx = idx;
        }
        return winner;
      },
      { score: 0, idx: 0 }
    );
    return winnerIdx.idx;
  };
  const frameCollection = Array.from({ length: frameNumber }, (_, i) => i + 1);

  return (
    <div className="App">
      <div className="controls">
        <button onClick={play} disabled={frameNumber >= FRAMES}>
          Play!
        </button>
      </div>
      <div className="player">
        <ul>
          <li></li>
          {frameCollection.map((num) => {
            return <li style={{ textAlign: 'center' }}>{num}</li>;
          })}
        </ul>
      </div>
      {players.map((player) => (
        <Player key={player.name} player={player} />
      ))}
    </div>
  );
}

export default App;
