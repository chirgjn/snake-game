import * as React from "react";
import "./styles.css";
import Board from "./Board";

import type { BoardProps } from "./Board";

export default function App() {
  const [speed, setSpeed] = React.useState<BoardProps["speed"]>(250);
  const initialState: BoardProps["initialState"] = {
    snake: {
      parts: [
        { top: 3, left: 5 },
        { top: 3, left: 4 },
        { top: 3, left: 3 }
      ],
      direction: "right"
    }
  };

  return (
    <div className="App">
      <Board
        speed={speed}
        width={500}
        height={500}
        initialState={initialState}
      />
      <div>
        <span>Speed:</span>
        <input
          type="number"
          min="250"
          step="250"
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
