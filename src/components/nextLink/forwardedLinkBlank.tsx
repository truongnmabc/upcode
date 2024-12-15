import React from "react";

// Define the props type for LinkBlank
interface LinkBlankProps {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    href?: string;
    children: React.ReactNode;
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const LinkBlank: React.ForwardRefRenderFunction<
    HTMLAnchorElement,
    LinkBlankProps
> = ({ onClick, href, children }, ref) => {
    return (
        <a href={href} onClick={onClick} target="_blank" ref={ref}>
            {children}
        </a>
    );
};

// Use React.forwardRef to wrap the component
const ForwardedLinkBlank = React.forwardRef(LinkBlank);
export default ForwardedLinkBlank;
