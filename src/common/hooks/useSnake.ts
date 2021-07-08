import React from "react";

export type SnakePart = { top: number; left: number };
export type Direction = "left" | "up" | "right" | "down";
export type SnakeState = Readonly<{
  parts: readonly SnakePart[];
  direction: Direction;
}>;

type SnakeReducerType = (
  state: SnakeState,
  action: Readonly<{
    type: "move";
    payload: Readonly<{ direction: Direction | null }>;
  }>
) => SnakeState;

function getSnakeParts({ parts, direction }: SnakeState) {
  // last tail position is now vacant
  // because the parts have shifted by a block
  const tail = parts.slice(0, -1);
  const [{ ...newHead }] = tail;

  switch (direction) {
    case "up": {
      newHead.top -= 1;
      return [newHead, ...tail];
    }
    case "down": {
      newHead.top += 1;
      return [newHead, ...tail];
    }
    case "left": {
      newHead.left -= 1;
      return [newHead, ...tail];
    }
    case "right": {
      newHead.left += 1;
      return [newHead, ...tail];
    }
    default:
      return parts;
  }
}

function getDirection(direction: Direction, newDirection: Direction | null) {
  const invalidMap: { [Key in Direction]: Direction } = {
    right: "left",
    left: "right",
    up: "down",
    down: "up"
  };
  if (newDirection !== null && invalidMap[direction] !== newDirection) {
    return newDirection;
  }
  return direction;
}

const snakeReducer: SnakeReducerType = (state, action) => {
  switch (action.type) {
    case "move": {
      const { direction: newDirection } = action.payload;
      const direction = getDirection(state.direction, newDirection);
      return {
        direction,
        parts: getSnakeParts({ parts: state.parts, direction })
      };
    }
    default:
      return state;
  }
};

export default function useSnake(initialState: SnakeState) {
  const [snake, dispatch] = React.useReducer(snakeReducer, initialState);
  const moveSnake = React.useCallback(
    (direction: Direction | null) =>
      dispatch({
        type: "move",
        payload: { direction }
      }),
    []
  );
  return { snake, moveSnake };
}
