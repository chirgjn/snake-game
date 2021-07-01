export type SnakePart = { top: number; left: number };
export type Direction = "left" | "up" | "right" | "down";
export type SnakeProps = {
  parts: readonly SnakePart[];
};

function getSnakeParts({
  parts,
  direction
}: {
  direction: Direction;
  parts: readonly SnakePart[];
}) {
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

export function snakeReducer(
  state: Readonly<{ parts: readonly SnakePart[]; direction: Direction }>,
  action: Readonly<{
    type: "move";
    payload: Readonly<{ direction: Direction | null }>;
  }>
): typeof state {
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
}

export default function Snake({ parts }: SnakeProps) {
  return (
    <>
      {parts.map(({ top, left }) => {
        const style = { top: `${10 * top}px`, left: `${10 * left}px` };
        return (
          <div className="snakebody" key={`${top}-${left}`} style={style}></div>
        );
      })}
    </>
  );
}
