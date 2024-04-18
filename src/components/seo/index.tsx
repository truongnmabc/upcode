// import { useEffect } from "react";
import "./index.scss";
import dynamic from "next/dynamic";
const Image = dynamic(() => import("next/image"));
// import WrapReactHTML from "./WrapReactHTML"; //cái này rất nặng

const SeoContentComponentV2 = ({
    homeSeoContent,
    srcFlag,
    stateLayout,
}: {
    homeSeoContent?: any;
    srcFlag?: string;
    stateLayout?: boolean;
}) => {
    // useEffect(() => {
    // let seoContentEle = document.querySelector(".seo-content .text");
    // let nodeLenght = seoContentEle?.childNodes?.length;
    // if (nodeLenght < 4) {
    //     if (!homeSeoContent?.content) {
    //         setReadMore();
    //     }
    // }
    // }, []);
    // const setReadMore = () => {
    //     let btnReadMore = document.getElementById("button-read-more");
    //     btnReadMore.style.display = "none";
    //     let content = document.getElementById("text-seo-content");
    //     content.className = "text";
    // };
    return (
        <>
            {homeSeoContent?.content && (
                <div className="seo-content-container-v2">
                    <div className="section seo-content-v2">
                        <div className={"content " + (stateLayout ? "state" : "")}>
                            <div id="text-seo-content" className={"text _read-more"}>
                                {/* {typeof window !== "undefined" ? ( */}
                                <div
                                    className="wrap-text"
                                    dangerouslySetInnerHTML={{
                                        __html: homeSeoContent.content,
                                    }}
                                />
                                {/* ) : (
                                    homeSeoContent.content
                                )} */}
                            </div>
                            {stateLayout && srcFlag ? (
                                <div className="flag ">
                                    <Image
                                        loader={() => srcFlag}
                                        src={srcFlag}
                                        alt="Flag"
                                        width={"fit-content"}
                                        height={"fit-content"}
                                        quality={100}
                                    />
                                </div>
                            ) : null}
                        </div>

                        {/* <div
                            id="button-read-more"
                            className="button-read-more"
                            onClick={() => {
                                setReadMore();
                            }}
                        >
                            Read more
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
};
export default SeoContentComponentV2;
