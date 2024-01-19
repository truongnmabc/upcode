import useMediaQuery from "@mui/material/useMediaQuery";
import React, { memo, useEffect, useRef } from "react";
// import ReactHtmlParser from "react-html-parser"; // cái này rất nặng
// import { useDialog } from "../mydialog";
import "./V4QuestionContent.scss";
import {
    TextContentType,
    formatTextContent,
    getSizeImage,
    getUrlImage,
    hasImage,
    isImage,
    isMathJaxContent,
    renderMath,
} from "../../utils/v4_question";
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
        if (renderMathJax && isMathJaxContent(content)) {
            if (window.MathJax) {
                renderMath(onLoaded); // vì nội dung mathjax tải lâu hơn nên phải truyền hàm này vào
            } else {
                setTimeout(() => {
                    renderMath(onLoaded);
                }, 1500);
            }
            // renderMath();
        }
        onLoaded();
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
            <img
                src={url}
                alt="image"
                style={{
                    width: "100%",
                    height: "auto",
                    minWidth: "300px",
                    maxWidth: "100%",
                    maxHeight: "calc(100% - 100px)",
                }}
            />
            <button
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
            </button>
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
    onLoaded: () => void;
}) => {
    // content = "A right triangle has a leg of length $3$, a second leg of length $3x − 5$, and a hypotenuse of length $5$. What is the value of $x$?";
    content = formatTextContent(content, bucket);
    if (!isMathJaxContent(content)) {
        content = content
            .replace(/#\n/g, "")
            // .replace(/\n/g, "<br/>")
            .replace(/\\u(....)/g, "&#x$1;");
    }

    if (type === TextContentType.question) {
        // const [openDialog, closeDialog] = useDialog();
        return (
            <TextContentQuestion
                type={type}
                bucket={bucket}
                content={content}
                image={image}
                showImageDialog={(url) => {
                    // openDialog({
                    //     children: <ImageDialog closeDialog={closeDialog} url={url} />,
                    // });
                }}
                place={place}
                onLoaded={onLoaded}
            />
        );
    }
    return <TextContent content={content} type={type} bucket={bucket} onLoaded={onLoaded} />;
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
                        '" onload="onLoaded()"/></div>' // (****) không biết viết như này có được không
                    );
                }
                return str;
            })
            .join("");
    }
    return (
        <div
            style={type == TextContentType.explanation ? { marginBottom: "10px" } : {}}
            className={"v4-question-text"}
            onClick={(e) => {
                if (e.currentTarget.nodeName == "IMG") {
                    let img = (e.currentTarget as HTMLImageElement).currentSrc;
                    showImageDialog(img);
                }
            }}
            onLoad={() => {
                onLoaded();
            }}
            dangerouslySetInnerHTML={{ __html: result }}
        >
            {/* {ReactHtmlParser(result)} */}
        </div>
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
    onLoaded: () => void;
}) => {
    // const { theme } = useTheme();
    const isDesktop = useMediaQuery("(min-width:769px)");
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
                key={new Date().getTime()}
                dangerouslySetInnerHTML={{ __html: content }}
                onLoad={() => {
                    onLoaded();
                }}
                className={"v4-question-text"}
            >
                {/* {ReactHtmlParser(content)} */}
            </div>
        );
    }

    let imageUrl = getUrlImage(bucket, image);

    if (!isDesktop) {
        return (
            <div
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
                                onLoaded();
                            }}
                            // style={theme === "dark" ? { filter: "invert(1)" } : {}}
                        />
                    </div>
                </div>
                {content?.length ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        onLoad={() => {
                            onLoaded();
                        }}
                        className={"v4-question-text"}
                    >
                        {/* {ReactHtmlParser(content)} */}
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div
            style={{
                marginBottom: "10px",
                display: "grid",
                gridTemplateColumns: "8fr 4fr",
                gap: "6px",
                gridGap: "6px",
            }}
        >
            {content?.length ? (
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    onLoad={() => {
                        onLoaded();
                    }}
                    className={"v4-question-text"}
                /> //  {ReactHtmlParser(content)}
            ) : null}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className={"v4-image-in-question " + "at-" + place}>
                    <img
                        className={"at-" + place}
                        src={imageUrl}
                        // style={theme === "dark" ? { filter: "invert(1)" } : {}}
                        alt="question-img"
                        loading="lazy"
                        onClick={() => {
                            showImageDialog(imageUrl);
                        }}
                        onLoad={() => {
                            onLoaded();
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
