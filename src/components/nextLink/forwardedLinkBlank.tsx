import React from "react";

// Define the props type for LinkBlank
interface LinkBlankProps {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    href?: string;
    children: React.ReactNode;
    classNames?: string;
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const LinkBlank: React.ForwardRefRenderFunction<
    HTMLAnchorElement,
    LinkBlankProps
> = ({ onClick, href, children, classNames }, ref) => {
    return (
        <a
            className={classNames}
            href={href}
            onClick={onClick}
            target="_blank"
            ref={ref}
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
};

// Use React.forwardRef to wrap the component
const ForwardedLinkBlank = React.forwardRef(LinkBlank);
export default ForwardedLinkBlank;
