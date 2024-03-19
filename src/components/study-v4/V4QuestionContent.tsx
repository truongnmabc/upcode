import useMediaQuery from "@mui/material/useMediaQuery";
import React, { memo, useEffect, useRef, useState } from "react";
import "./V4QuestionContent.scss";
import {
    TextContentType,
    formatTextContent,
    getSizeImage,
    getUrlImage,
    hasImage,
    isImage,
    isMathJaxContent,
} from "../../utils/v4_question";
import dynamic from "next/dynamic";
const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });

const V4QuestionContent = ({
    content,
    image = "",
    type = TextContentType.question,
    bucket,
    renderMathJax = false,
    place = "study",
}: {
    content: string;
    image?: string;
    type?: string;
    bucket: string;
    renderMathJax?: boolean;
    place?: "question" | "study" | "review";
}) => {
    let mainViewPanel = useRef<HTMLDivElement>(null);
    const _ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        onLoaded(3);
    }, [content]);

    const onLoaded = (arg?: any) => {
        if (place == "study") {
            // trang học thì mới phải làm như này vì dữ liệu phải đợi tải về sau khi tải trang, còn trang question thì dữ liệu tải về trong khi tải trang luôn rồi
            if (!!mainViewPanel?.current?.style) mainViewPanel.current.style.height = _ref.current.clientHeight + "px";
        }
    };
    return (
        <div ref={mainViewPanel} className={"v4-question-text-content-0 " + place + (image ? "have-img" : "")}>
            <div ref={_ref}>
                <_QuestionContent
                    content={content}
                    image={image}
                    type={type}
                    bucket={bucket}
                    place={place}
                    onLoaded={onLoaded}
                />
            </div>
        </div>
    );
};

const ImageDialog = ({ closeDialog, url }) => {
    return (
        <div
            style={{
                borderRadius: "16px",
                background: "#fff",
                padding: "16px",
            }}
        >
            <div
                style={{
                    width: 300,
                    height: 0,
                    transition: "0.2s all ease-in-out",
                    overflow: "hidden",
                }}
            >
                <img
                    src={url}
                    alt="image"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    onLoad={(e) => {
                        let screenWidth = window.innerWidth - 16 * 4;
                        let screenHeight = window.innerHeight - 16 * 4 - 16 - 54;
                        let naturalWidth = e.currentTarget.naturalWidth;
                        let naturalHeight = e.currentTarget.naturalHeight;
                        let r = naturalWidth / naturalHeight;
                        let w = naturalWidth < screenWidth ? naturalWidth : screenWidth;
                        let h = w / r;
                        if (h > screenHeight) {
                            w = screenHeight * r;
                            h = screenHeight;
                        }
                        e.currentTarget.parentElement.style.height = h + "px";
                        e.currentTarget.parentElement.style.width = w + "px";
                    }}
                />
            </div>

            <div
                style={{
                    border: "none",
                    padding: "6px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    float: "right",
                }}
                onClick={() => closeDialog()}
            >
                Close
            </div>
        </div>
    );
};

const _QuestionContent = ({
    content,
    image = "",
    type = TextContentType.question,
    bucket,
    place,
    onLoaded,
}: {
    content: string;
    image?: string;
    type?: string;
    bucket: string;
    place: string;
    onLoaded: (arg?: any) => void;
}) => {
    // content = "A right triangle has a leg of length $3$, a second leg of length $3x − 5$, and a hypotenuse of length $5$. What is the value of $x$?";
    content = formatTextContent(content, bucket);
    if (!isMathJaxContent(content)) {
        content = content
            .replace(/#\n/g, "")
            // .replace(/\n/g, "<br/>")
            .replace(/\\u(....)/g, "&#x$1;");
    }
    const [openDialog, setOpenDialog] = useState("");
    if (type === TextContentType.question) {
        return (
            <>
                <TextContentQuestion
                    type={type}
                    bucket={bucket}
                    content={content}
                    image={image}
                    showImageDialog={(url) => {
                        setOpenDialog(url);
                    }}
                    place={place}
                    onLoaded={onLoaded}
                />
                {!!openDialog && (
                    <Dialog open={!!openDialog} onClose={() => setOpenDialog("")} className="customize-dialog">
                        <ImageDialog closeDialog={() => setOpenDialog("")} url={openDialog} />
                    </Dialog>
                )}
            </>
        );
    }
    return (
        <>
            <TextContent
                content={content}
                type={type}
                bucket={bucket}
                onLoaded={onLoaded}
                showImageDialog={(url) => {
                    setOpenDialog(url);
                }}
            />
            {!!openDialog && (
                <Dialog open={!!openDialog} onClose={() => setOpenDialog("")} className="customize-dialog">
                    <ImageDialog closeDialog={() => setOpenDialog("")} url={openDialog} />
                </Dialog>
            )}
        </>
    );
};

const TextContent = ({
    content,
    type,
    bucket,
    showImageDialog,
    onLoaded, // hàm này để gọi chỗ (****)
}: {
    content: string;
    type: string;
    bucket: string;
    showImageDialog?: (agr: any) => void;
    onLoaded: (arg?: any) => void;
}) => {
    let result = content;
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const ele = contentRef.current;
        if (ele) {
            const resizeObserver = new ResizeObserver(onLoaded);
            resizeObserver.observe(ele);
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [contentRef.current]);
    if (!isMathJaxContent(content) && content.split("$")?.length > 2) {
        result = content
            .split("$")
            .map((str) => {
                if (isImage(str)) {
                    let size = getSizeImage(str);
                    return (
                        '<div class="img-in-content"><img style="cursor:pointer;display:inline-block;vertical-align:middle;margin:auto;filter:invert(1);" alt="question-img" loading="lazy" src="' +
                        getUrlImage(bucket, str) +
                        '" width="' +
                        size.width +
                        '" height="' +
                        size.height +
                        '"/></div>' // (****) không biết viết như này có được không
                    );
                }
                return str;
            })
            .join("");
    }
    return (
        <div
            ref={contentRef}
            style={type == TextContentType.explanation ? { marginBottom: "10px" } : {}}
            className={"v4-question-text"}
            onClick={(e) => {
                if ((e.target as HTMLImageElement).nodeName == "IMG") {
                    let img = e.target as HTMLImageElement;
                    showImageDialog(img.currentSrc);
                }
            }}
            dangerouslySetInnerHTML={{ __html: result }}
        />
    );
};

const TextContentQuestion = ({
    content,
    image,
    showImageDialog,
    type,
    bucket,
    place,
    onLoaded,
}: {
    content: string;
    image: string;
    showImageDialog: (agr: any) => void;
    type: string;
    bucket: string;
    place: string;
    onLoaded: (arg?: any) => void;
}) => {
    const isDesktop = useMediaQuery("(min-width:769px)");
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const ele = contentRef.current;
        if (ele) {
            const resizeObserver = new ResizeObserver(onLoaded);
            resizeObserver.observe(ele);
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [contentRef.current]);

    if (!image || image == "null") {
        if (hasImage(content)) {
            return (
                <TextContent
                    content={content}
                    type={type}
                    bucket={bucket}
                    showImageDialog={(url) => showImageDialog(url)}
                    onLoaded={onLoaded}
                />
            );
        }
        // (#####)
        return (
            <div
                ref={contentRef}
                key={new Date().getTime()}
                dangerouslySetInnerHTML={{ __html: content }}
                className={"v4-question-text"}
            />
        );
    }

    let imageUrl = getUrlImage(bucket, image);

    if (!isDesktop) {
        return (
            <div
                ref={contentRef}
                style={{
                    marginBottom: "10px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <div className={"v4-image-in-question " + "at-" + place}>
                        <img
                            className={"at-" + place}
                            src={imageUrl}
                            alt="question-img"
                            loading="lazy"
                            onClick={() => {
                                showImageDialog(imageUrl);
                            }}
                            onLoad={() => {
                                // onLoaded();
                            }}
                        />
                    </div>
                </div>
                {content?.length ? <div dangerouslySetInnerHTML={{ __html: content }} className={"v4-question-text"} /> : null}
            </div>
        );
    }

    return (
        <div
            ref={contentRef}
            style={{
                marginBottom: "10px",
                display: "grid",
                gridTemplateColumns: "8fr 4fr",
                gap: "6px",
                gridGap: "6px",
            }}
        >
            {content?.length ? <div dangerouslySetInnerHTML={{ __html: content }} className={"v4-question-text"} /> : null}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className={"v4-image-in-question " + "at-" + place}>
                    <img
                        className={"at-" + place}
                        src={imageUrl}
                        alt="question-img"
                        loading="lazy"
                        onClick={() => {
                            showImageDialog(imageUrl);
                        }}
                        onLoad={() => {
                            // onLoaded();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(V4QuestionContent, (prev, next) => {
    let eq = true;
    if (prev.content.localeCompare(next.content) != 0) eq = false;
    if ((prev?.image ?? "").localeCompare(next?.image ?? "") != 0) eq = false;
    let t1 = JSON.stringify(prev?.type ?? TextContentType.question);
    let t2 = JSON.stringify(next?.type ?? TextContentType.question);
    if (t1.localeCompare(t2) != 0) eq = false;
    if ((prev?.place ?? "question").localeCompare(next?.place ?? "question") != 0) eq = false;
    if (prev.renderMathJax != next.renderMathJax) eq = false;
    if (prev.bucket.localeCompare(next.bucket) != 0) eq = false;
    return eq;
});
