import "./MyContainer.scss";
const MyContainer = ({
    children,
    className,
}: {
    children?: any;
    className?: string;
}) => {
    return (
        <div
            className={`v4-container-component ${className} v4-container-maxWidth`}
        >
            {children}
        </div>
    );
};

export default MyContainer;
