import ctx from "@/utils/mergeClass";

type IProps = {
    percentage: number;
    color: string;
    bgColor: string;
    textAttributes?: React.SVGTextElementAttributes<SVGTextElement>;
    textClassName?: string;
    textStyles?: React.CSSProperties;
    circleAttributes?: React.SVGAttributes<SVGCircleElement>;
    circleClassName?: string;
    circleStyles?: React.CSSProperties;
    strokeWidth: number;
    size: number;
    customText?: React.ReactNode;
    showText?: boolean;
    wrapperClassName?: string;
};
const CircleProgress = (props: IProps) => {
    const {
        customText,
        color,
        strokeWidth,
        percentage,
        size,
        bgColor,
        showText = true,
        ...res
    } = props;
    const pct = cleanPercentage(percentage);
    return (
        <div
            className={ctx("relative z-0 w-fit h-fit", props.wrapperClassName)}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                    <Circle
                        {...res}
                        color={bgColor}
                        percentage={100}
                        size={size}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        {...res}
                        percentage={pct}
                        size={size}
                        color={color}
                        strokeWidth={strokeWidth}
                    />
                </g>
                {showText && !customText && <Text percentage={pct} {...res} />}
            </svg>
            {customText}
        </div>
    );
};

const Circle = ({
    color,
    percentage,
    circleAttributes,
    strokeWidth,
    size,
    circleClassName,
    circleStyles,
}: {
    color: string;
    percentage: number;
    circleAttributes?: React.SVGAttributes<SVGCircleElement>;
    circleClassName?: string;
    circleStyles?: React.CSSProperties;
    strokeWidth: number;
    size: number;
}) => {
    const r = size / 2 - strokeWidth;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - percentage) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.
    return (
        <circle
            r={r}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            stroke={strokePct !== circ ? color : ""} // remove colour as 0% sets full circumference
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={percentage ? strokePct : 0}
            strokeLinecap="round"
            className={circleClassName}
            style={circleStyles}
            {...circleAttributes}
        ></circle>
    );
};

export default CircleProgress;

const Text = ({
    percentage,
    textAttributes,
    textClassName,
    textStyles,
}: {
    percentage: number;
    textClassName?: string;
    textStyles?: React.CSSProperties;
    textAttributes?: React.SVGTextElementAttributes<SVGTextElement>;
}) => {
    return (
        <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={"1.5em"}
            className={textClassName}
            style={textStyles}
            {...textAttributes}
        >
            {percentage.toFixed(0)}%
        </text>
    );
};

const cleanPercentage = (percentage: number) => {
    const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
    const isTooHigh = percentage > 100;
    return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};
