import React from "react";
import useInterval from "./common/hooks/useInterval";
import Snake, { snakeReducer } from "./Snake";

import type { SnakePart, Direction } from "./Snake";

export type BoardProps = {
  speed: number | null;
  width: number;
  height: number;
  initialState: Readonly<{
    snake: { parts: readonly SnakePart[]; direction: Direction };
  }>;
};

function getCurrentStatus(
  snakeParts: readonly SnakePart[],
  boardDimensions: { width: number; height: number }
) {
  const { width, height } = boardDimensions;
  const [snakeHead] = snakeParts;
  if (snakeHead.top <= 0 || snakeHead.top >= width) {
    return { status: "over", reason: "collission-wall" };
  }
  if (snakeHead.left <= 0 || snakeHead.left >= height) {
    return { status: "over", reason: "collission-wall" };
  }
  for (let i = 1; i < snakeParts.length; i++) {
    const current = snakeParts[i];
    if (snakeHead.top === current.top && snakeHead.left === current.left) {
      return { status: "over", reason: "collission-with-self" };
    }
  }
  return { status: "running" };
}

export default function Board({
  speed,
  width,
  height,
  initialState
}: BoardProps) {
  const [snake, dispatch] = React.useReducer(snakeReducer, initialState.snake);
  const directionRef = React.useRef<Direction | null>(null);

  // game loop
  useInterval(() => {
    dispatch({
      type: "move",
      payload: { direction: directionRef.current }
    });
    directionRef.current = null;
  }, speed);

  return (
    <div
      // TODO: Move to styled components
      style={{ width: `${width}px`, height: `${height}px` }}
      className="board"
      tabIndex={0}
      onKeyDown={(e) => {
        const code = e.key;
        switch (code) {
          case "ArrowLeft":
            directionRef.current = "left";
            break;
          case "ArrowUp":
            directionRef.current = "up";
            break;
          case "ArrowRight":
            directionRef.current = "right";
            break;
          case "ArrowDown":
            directionRef.current = "down";
            break;
          default:
            return;
        }
      }}
    >
      <Snake parts={snake.parts} />
    </div>
  );
}
