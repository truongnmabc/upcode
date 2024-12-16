import "./V4CircleProgress.scss";
const V4CircleProgress = ({ size, thickness }: { size?: number; thickness?: number }) => {
    return (
        <div className="v4-circle-progress">
            <div
                className="rotate-ifinite"
                style={{
                    width: (size ?? 32) + "px",
                    height: (size ?? 32) + "px",
                    borderWidth: (thickness ?? 4) + "px",
                }}
            />
        </div>
    );
};
export default V4CircleProgress;
