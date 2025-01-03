"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { Dialog } from "@mui/material";
import React, { CSSProperties, useCallback, useState } from "react";
// import Image from "next/image";

export interface ILazyLoadImages {
    src: string;
    alt?: string;
    classNames?: string;
    styles?: CSSProperties;
    imgStyles?: CSSProperties;
    imgClassNames?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
    priority?: boolean;
    draggable?: boolean;
    isPreview?: boolean;
}

const image = `/images/logo/logo60.png`;

const LazyLoadImage: React.FC<ILazyLoadImages> = ({
    src,
    alt,
    imgClassNames,
    imgStyles,
    classNames,
    styles,
    onClick,
    priority = true,
    isPreview = false,
    ...rest
}) => {
    const appInfo = useAppSelector(selectAppInfo);
    const imgAlt = alt || appInfo?.appShortName;
    const [currentSrc, setCurrentSrc] = useState(src);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        if (isPreview) setOpen(true);
    }, [isPreview]);

    const handleError = useCallback(() => {
        setCurrentSrc(image);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <div
            style={styles}
            className={ctx("w-full  h-full", classNames)}
            onClick={onClick}
        >
            <img
                src={currentSrc}
                alt={imgAlt}
                onClick={handleOpen}
                onError={handleError}
                className={ctx(
                    "object-contain transition-all h-full",
                    imgClassNames
                )}
                draggable={false}
                loading={priority ? "eager" : "lazy"}
                style={imgStyles}
                {...rest}
            />
            {/* <Image
        src={src}
        alt={imgAlt || ""}
        layout="responsive"
        width={24}
        height={24}
        // className={ctx("object-contain transition-all h-full", imgClassNames)}
        // loading="lazy"
        style={imgStyles}
        // onError={() => setCurrentSrc(image)}
        {...rest}
      /> */}
            <Dialog open={open} onClose={handleClose}>
                <img
                    src={currentSrc}
                    alt={imgAlt}
                    onError={() => setCurrentSrc(image)}
                    className={ctx(
                        "object-contain transition-all h-full",
                        imgClassNames
                    )}
                    loading={priority ? "eager" : "lazy"}
                    style={imgStyles}
                    {...rest}
                />
            </Dialog>
        </div>
    );
};

export default LazyLoadImage;
