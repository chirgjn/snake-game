import React from "react";
import { toPx } from "./common/render-utils";

export type BoardProps = {
  width: number;
  height: number;
  children?: React.ReactNode;
};

export default function Board({ width, height, children }: BoardProps) {
  return (
    <div
      // TODO: Move to styled components
      style={{ width: toPx(width), height: toPx(height) }}
      className="board"
    >
      {children ?? null}
    </div>
  );
}
