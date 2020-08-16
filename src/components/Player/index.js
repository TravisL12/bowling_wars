import React from "react";
import Frame from "../Frame";

function Player({ player }) {
  const twoRollsScore = (i) => {
    const firstNextFrame = player.frames[i + 1];
    const secondNextFrame = player.frames[i + 2];
    return firstNextFrame
      ? firstNextFrame.rolls.concat(secondNextFrame?.rolls || []).slice(0, 2)
      : [];
  };

  return (
    <div
      className="player"
      style={{ backgroundColor: player.winner ? "lightblue" : "inherit" }}
    >
      <ul>
        {player.frames.map((frame, idx) => (
          <Frame key={idx} frameInfo={frame} />
        ))}
        <li>
          <div className="name">{player.name}</div>
          <div className="total"></div>
        </li>
      </ul>
    </div>
  );
}

export default Player;
