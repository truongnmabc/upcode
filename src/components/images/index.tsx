"use client";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import ctx from "@/utils/mergeClass";
import React, { CSSProperties, useState } from "react";
// import Image from "next/image";

export interface ILazyLoadImages {
  src: string;
  alt?: string;
  classNames?: string;
  styles?: CSSProperties;
  imgStyles?: CSSProperties;
  imgClassNames?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  priority?: boolean;
}

const LazyLoadImage: React.FC<ILazyLoadImages> = ({
  src,
  alt,
  imgClassNames,
  imgStyles,
  classNames,
  styles,
  onClick,
  priority = true,
  ...rest
}) => {
  const { appInfo } = useAppSelector(appInfoState);
  const imgAlt = alt || appInfo?.appShortName;
  const [currentSrc, setCurrentSrc] = useState(src);
  const image = `/images/logo/logo60.png`;
  return (
    <div
      style={styles}
      className={ctx("w-full  h-full", classNames)}
      onClick={onClick}
    >
      <img
        src={currentSrc}
        alt={imgAlt}
        onError={() => setCurrentSrc(image)}
        className={ctx("object-contain transition-all h-full", imgClassNames)}
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
    </div>
  );
};

export default LazyLoadImage;
