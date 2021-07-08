import { toPx } from "./common/render-utils";

type SnakePart = { top: number; left: number };
export type SnakeProps = {
  parts: readonly SnakePart[];
};

export default function Snake({ parts }: SnakeProps) {
  return (
    <>
      {parts.map(({ top, left }) => {
        const style = { top: toPx(top), left: toPx(left) };

        return (
          <div className="snakebody" key={`${top}-${left}`} style={style} />
        );
      })}
    </>
  );
}
