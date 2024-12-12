import React, { useEffect, useRef } from "react";
import "./CanvasCards.scss";

const CanvasCards: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = 400;

                // Draw connecting lines
                const drawLine = (startX: number, startY: number, endX: number, endY: number) => {
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.bezierCurveTo(
                        startX + 50,
                        startY, // Control point 1
                        endX - 50,
                        endY, // Control point 2
                        endX,
                        endY // End point
                    );
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#d9d9d9";
                    ctx.stroke();
                };

                // Example positions for the lines (adjust as needed)
                drawLine(200, 150, 600, 150); // Line from card 1 to card 2
                drawLine(600, 150, 1000, 150); // Line from card 2 to card 3
            }
        }
    }, []);

    return (
        <div className="card-container">
            <canvas ref={canvasRef} className="canvas-background"></canvas>
            <div className="card-wrapper" style={{ left: "150px", top: "100px" }}>
                <div className="card" style={{ backgroundColor: "#FF6F61" }}>
                    <div className="card-icon">🚀</div>
                    <h3>Mission</h3>
                    <p>
                        Deliver expertly designed practice questions, study materials, and reliable support to ensure a smooth
                        and successful journey into the professional driving industry.
                    </p>
                </div>
            </div>

            <div className="card-wrapper" style={{ left: "550px", top: "100px" }}>
                <div className="card" style={{ backgroundColor: "#A593E0" }}>
                    <div className="card-icon">👁️</div>
                    <h3>Vision</h3>
                    <p>
                        To be the go-to platform for CDL preparation for drivers to be confident, well-prepared, and able to
                        pursue rewarding careers on the road.
                    </p>
                </div>
            </div>

            <div className="card-wrapper" style={{ left: "950px", top: "100px" }}>
                <div className="card" style={{ backgroundColor: "#FFD700" }}>
                    <div className="card-icon">📊</div>
                    <h3>Core Value</h3>
                    <p>
                        Provide top-quality, accurate, and up-to-date CDL prep resources, make them accessible and affordable to
                        all, and ensure content is reliable, and crafted by experts.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CanvasCards;
