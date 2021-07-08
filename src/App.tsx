import * as React from "react";
import "./styles.css";

import useGame from "./common/hooks/useGame";
import Board from "./Board";
import type { SnakeState, Direction } from "./common/hooks/useGame";
import Snake from "./Snake";

function processInput(changeDirection: (value: Direction) => void) {
  return (e: React.KeyboardEvent) => {
    const code = e.key;
    switch (code) {
      case "ArrowLeft":
        changeDirection("left");
        break;
      case "ArrowUp":
        changeDirection("up");
        break;
      case "ArrowRight":
        changeDirection("right");
        break;
      case "ArrowDown":
        changeDirection("down");
        break;
      default:
        return;
    }
  };
}

export default function App() {
  const [speed, setSpeed] = React.useState<number | null>(1);
  const initialState: SnakeState = {
    parts: [
      { top: 3, left: 5 },
      { top: 3, left: 4 },
      { top: 3, left: 3 }
    ],
    direction: "right"
  };
  const { snake, changeDirection } = useGame({ speed, initialState });

  return (
    <div className="App" tabIndex={0} onKeyDown={processInput(changeDirection)}>
      <Board width={50} height={50}>
        <Snake parts={snake.parts} />
      </Board>
      <div>
        <span>Speed:</span>
        <input
          type="number"
          min="1"
          step="1"
          max="10"
          defaultValue={`${speed}`}
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
    </div>
  );
}
