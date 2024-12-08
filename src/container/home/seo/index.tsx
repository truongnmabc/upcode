"use client";
import React, { useEffect } from "react";

type IProps = {
  content: string;
};

type CanvasRenderingContext2DOrNull = CanvasRenderingContext2D | null;

type CenterPosition = {
  x: number;
  y: number;
};

import "./test.css";

const SeoContent = ({ content }: IProps) => {
  useEffect(() => {
    const canvas = document.getElementById(
      "lineCanvas"
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2DOrNull = canvas.getContext("2d");
    if (!ctx) return;

    const container = document.getElementById(
      "container"
    ) as HTMLDivElement | null;
    if (!container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const icons = document.querySelectorAll<HTMLDivElement>(".icon");

    function getCenterPosition(element: HTMLDivElement): CenterPosition {
      const rect = element.getBoundingClientRect();
      console.log("🚀 ~ getCenterPosition ~ rect:", rect);
      if (container) {
        const containerRect = container.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      }
      return {
        x: 0,
        y: 0,
      };
    }

    ctx.strokeStyle = "#fcb03b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);

    for (let i = 0; i < icons.length - 1; i++) {
      const start = getCenterPosition(icons[i]);
      const end = getCenterPosition(icons[i + 1]);

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }, []);

  return (
    <div>
      <div id="container" style={{ position: "relative" }}>
        <canvas
          id="lineCanvas"
          style={{ position: "absolute", zIndex: 0 }}
        ></canvas>
        <div
          className="icon"
          style={{
            position: "absolute",
            left: "50px",
            top: "100px",
          }}
        >
          Part 1
        </div>
        <div
          className="icon"
          style={{
            position: "absolute",
            left: "150px",
            top: "100px",
          }}
        >
          Part 2
        </div>
        <div
          className="icon"
          style={{
            position: "absolute",
            left: "250px",
            top: "100px",
          }}
        >
          Part 3
        </div>
      </div>
    </div>
  );
};

export default SeoContent;
