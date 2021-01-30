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

  const updateScore = () => {
    let summedScore = 0;
    for (let i = 0; i < player.frames.length; i++) {
      const frame = player.frames[i];
      const [nextRoll1, nextRoll2] = twoRollsScore(i);
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
      frame.score = summedScore;
    }

    return player.frames;
  };

  const framesScored = updateScore();

  return (
    <div
      className="player"
      style={{ backgroundColor: player.winner ? "lightblue" : "inherit" }}
    >
      <ul>
        {framesScored.map((frame, idx) => (
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
