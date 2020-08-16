import React, { useState } from "react";
import "./App.css";
import Player from "../Player";
import { bowlFrame, bowlFinalFrame } from "../utilities";

export const FRAMES = 10;
export const PINS = 10;
export const STRIKE = "X";
export const SPARE = "/";

function App() {
  const [frameNumber, setFrameNumber] = useState(0);
  const [players, setPlayers] = useState([
    { name: "Travis", frames: [], score: 0 },
    { name: "Marisa", frames: [], score: 0 },
    { name: "Connor", frames: [], score: 0 },
    { name: "Harper", frames: [], score: 0 },
  ]);

  const play = () => {
    const playersCopy = [...players];
    for (let i = 0; i < playersCopy.length; i++) {
      const player = playersCopy[i];
      const isFinalFrame = frameNumber === FRAMES - 1;
      const frame = !isFinalFrame ? bowlFrame() : bowlFinalFrame();

      player.frames.push(frame);
    }
    setPlayers(playersCopy);
    setFrameNumber(frameNumber + 1);
  };

  const getWinner = () => {
    const winner = players.reduce(
      (winner, player) => {
        if (player.score > winner.score) {
          winner = player;
        }
        return winner;
      },
      { score: 0 }
    );
  };

  return (
    <div className="App">
      <button onClick={play} disabled={frameNumber >= FRAMES}>
        Play!
      </button>
      {players.map((player) => (
        <Player player={player} winner={false} />
      ))}
    </div>
  );
}

export default App;
