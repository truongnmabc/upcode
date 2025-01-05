import Dialog from "@mui/material/Dialog";
import { IAppInfo } from "@/models/app/appInfo";
import { ICurrentGame } from "@/models/game/game";
import { MathJax } from "better-react-mathjax";
import LazyLoadImage from "../images";
import { baseImageUrl } from "@/constants";
import ctx from "@/utils/mergeClass";
import { MyCrypto } from "@/utils/myCrypto";
import GetIconPrefix from "../study/mainStudyView/choicesPanel/getIcon";

export const DialogDetailQuestionReview = ({
    open,
    onClose,
    item,
    appInfo,
}: {
    open: boolean;
    onClose: () => void;
    item: ICurrentGame;
    appInfo: IAppInfo;
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    maxWidth: "1024px",
                    width: "100%",
                    borderRadius: "12px",
                },
            }}
        >
            <div className="rounded-b-lg  bg-white min-w-[1024px] flex flex-1 overflow-hidden  flex-col gap-2 p-6">
                <div className="w-full flex justify-between gap-2 ">
                    {item?.text && (
                        <MathJax>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: MyCrypto.decrypt(item?.text),
                                }}
                                className="text-sm font-normal  sm:text-base"
                            />
                        </MathJax>
                    )}
                    {item?.image && (
                        <LazyLoadImage
                            key={item.image}
                            isPreview
                            src={`${baseImageUrl}${appInfo.appShortName}/images/${item.image}`}
                            alt={item.image}
                            classNames="w-16 sm:w-24 cursor-pointer aspect-video min-h-16 max-h-24"
                        />
                    )}
                </div>
                <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
                    {item?.answers?.map((choice, index) => (
                        <div
                            className={ctx(
                                "flex gap-2 w-full h-full bg-white sm:bg-transparent items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]",
                                {
                                    "border-[#21212185]":
                                        item?.selectedAnswer?.id === choice?.id,
                                    "border-[#07C58C]": choice.correct,
                                }
                            )}
                            key={index}
                            id={(index + 1).toString()}
                        >
                            <GetIconPrefix
                                isActions={false}
                                isSelect={
                                    item?.selectedAnswer?.id === choice?.id
                                }
                                isReview={true}
                                answerCorrect={choice.correct}
                            />
                            {choice?.text && (
                                <MathJax
                                    style={{
                                        fontSize: 12,
                                    }}
                                    dynamic
                                    renderMode="post"
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: choice?.text,
                                        }}
                                    />
                                </MathJax>
                            )}
                        </div>
                    ))}
                </div>
                {item?.explanation && (
                    <MathJax className="">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: MyCrypto.decrypt(item?.explanation),
                            }}
                            className="text-sm font-normal h-full  sm:text-base"
                        />
                    </MathJax>
                )}
            </div>
        </Dialog>
    );
};
