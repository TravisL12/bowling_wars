import React from "react";
import Frame from "../Frame";

function Player({ player, winner }) {
  const twoRollsScore = (i) => {
    const firstNextFrame = player.frames[i + 1];
    const secondNextFrame = player.frames[i + 2];
    return firstNextFrame
      ? firstNextFrame.rolls.concat(secondNextFrame?.rolls || []).slice(0, 2)
      : [];
  };

  return (
    <div
      class="player"
      style={{ backgroundColor: winner ? "lightblue" : "inherit" }}
    >
      <ul>
        {player.frames.map((frame) => (
          <Frame frameInfo={frame} />
        ))}
        <li>
          <div class="name">{player.name}</div>
          <div class="total"></div>
        </li>
      </ul>
    </div>
  );
}

export default Player;
