import React from "react";
import useInterval from "./useInterval";
import useSnake from "./useSnake";

import type { Direction, SnakeState, SnakePart } from "./useSnake";

export type { Direction, SnakeState };

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

export default function useGame({
  speed,
  initialState
}: {
  speed: number | null;
  initialState: SnakeState;
}) {
  const { snake, moveSnake } = useSnake(initialState);
  const directionRef = React.useRef<Direction | null>(null);

  const changeDirection = (value: Direction) => {
    directionRef.current = value;
  };
  let interval = speed;

  if (speed !== null) {
    interval = 250 - 20 * speed;
  }

  // game loop
  useInterval(() => {
    moveSnake(directionRef.current);
    directionRef.current = null;
  }, interval);

  return { snake, changeDirection };
}
