import * as React from "react";
import "./styles.css";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function moveSnake(parts, direction) {
  const [...tail] = parts;
  const [{ ...newHead }] = tail;

  // last tail position is now vacant
  // because the has body shifted by a block
  tail.pop();

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

function getCurrentStatus(snakeParts, boardDimensions) {
  const { width, height } = boardDimensions;
  const [snakeHead] = snakeParts;
  if (snakeHead.top <= 0 || snakeHead >= width) {
    return { status: "over", reason: "collission-wall" };
  }
  if (snakeHead.left <= 0 || snakeHead >= height) {
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

function updateDirection(setDirection, direction, newDirection) {
  const invalidMap = {
    right: "left",
    left: "right",
    up: "down",
    down: "up"
  };
  if (newDirection !== null && invalidMap[direction] !== newDirection) {
    setDirection(newDirection);
  }
}
function updateSnake(updateSnakeParts, direction) {
  updateSnakeParts((parts) => moveSnake(parts, direction));
}

export default function App() {
  const [speed, setSpeed] = React.useState(250);
  const initialState = {
    snake: [
      { top: 3, left: 5 },
      { top: 3, left: 4 },
      { top: 3, left: 3 }
    ],
    direction: "right"
  };
  return (
    <>
      <Board speed={speed} initialState={initialState} />
      <div>
        <span>Speed:</span>
        <input
          type="number"
          min="250"
          step="50"
          defaultValue={speed}
          onChange={(e) => {
            const speed = Number.parseInt(e.target.value, 10);
            if (Number.isNaN(speed)) {
              setSpeed(null);
            } else {
              setSpeed(speed);
            }
          }}
        />
      </div>
    </>
  );
}

export function Board({ speed, initialState }) {
  const [direction, setDirection] = React.useState(initialState.direction);
  const [snakeParts, updateSnakeParts] = React.useState(initialState.snake);
  const directionRef = React.useRef(null);

  // game loop
  useInterval(() => {
    updateDirection(setDirection, direction, directionRef.current);
    directionRef.current = null;
    updateSnake(updateSnakeParts, direction);
  }, speed);

  return (
    <div
      className="board"
      tabIndex="0"
      autoFocus={true}
      onKeyDown={(e) => {
        const code = e.keyCode;
        switch (code) {
          case 37:
            directionRef.current = "left";
            break;
          case 38:
            directionRef.current = "up";
            break;
          case 39:
            directionRef.current = "right";
            break;
          case 40:
            directionRef.current = "down";
            break;
          default:
            return;
        }
      }}
    >
      <Snake snakeParts={snakeParts} />
    </div>
  );
}

export function Snake({ snakeParts }) {
  return (
    <>
      {snakeParts.map(({ top, left }, idx) => {
        const style = { top: `${10 * top}px`, left: `${10 * left}px` };
        return (
          <div className="snakebody" key={`${top}-${left}`} style={style}></div>
        );
      })}
    </>
  );
}
