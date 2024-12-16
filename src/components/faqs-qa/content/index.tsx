// import Button from "@material-ui/core/Button";
// import Container from "@material-ui/core/Container";
// import Dialog from "@material-ui/core/Dialog";
// import Pagination from "@mui/material/Pagination";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import Config from "../../../config";
// import { APP_SHORT_NAME } from "../../../config_app";
// import { IAppInfo } from "../../../models/AppInfo";
// import { IComment } from "../../../models/Comment";
// import { getFaqAction, getQasAction, updateLengthAction } from "../../../redux/actions/faq-qa.action";
// import { scrollToElementByClassName } from "../../../utils";
// import LoginContainer from "../../login_new";
// import { LoadingWidget } from "../../Widgets";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
// import AddQestion from "../add-question";
// import FaqsContent from "../faqs";
// import HotQuestions from "../hot-questions";
// import QasContent from "../qas";
import "./index.scss";
import V4CircleProgress from "../../v4-material/V4CircleProgress";
import MyContainer from "../../v4-material/MyContainer";
// import { useMediaQuery } from "@mui/material";

export const TYPE_TAB = {
    Faq: "faq",
    Qa: "qa",
    Post_question: "post_question",
};
const FaqsAndQaContent = ({
    // appInfo,
    // qaContent,
    isSingleQa,
    tab,
    setTab,
}: {
    // appInfo: IAppInfo;
    // qaContent?: IComment;
    isSingleQa?: boolean;
    tab?: string;
    setTab?: Function;
}) => {
    // const [currentPage, setCurrentpage] = useState(1);
    // const dispatch = useDispatch();
    // const appNameId = APP_SHORT_NAME;
    // const numberItem = listFaqs.length;
    // let limit = Config.PER_PAGE;

    // const isMobile = useMediaQuery("(max-width:768px)");

    // let listQas: IComment[] = useSelector((state: any) => state.faqAndQaReducer.qas);
    // const listComment: IComment[] = useSelector((state: any) => state.faqAndQaReducer.comments);
    // listQas.sort((a, b) => {
    //     return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    // });
    // if (isSingleQa) {
    //     listQas = listComment;
    // }

    // const numberItem: any = useSelector((state: any) => state.faqAndQaReducer.length);
    // const hotQuestion: any[] = useSelector((state: any) => state.faqAndQaReducer.hotQuestions);
    // const loading = useSelector((state: any) => state.faqAndQaReducer.loading);

    // const numberPages = numberItem % limit == 0 ? Math.floor(numberItem / limit) : Math.floor(numberItem / limit) + 1;
    // useEffect(() => {
    //     dispatchAction();
    //     localStorage.setItem("selectedTab", tab);
    // }, [tab]);

    useEffect(() => {
        if (isSingleQa) {
            setTab(TYPE_TAB.Qa);
        }
    }, [isSingleQa]);

    // const handleChange = (event, value) => {
    //     let offset = value - 1;
    //     if (tab == TYPE_TAB.Faq) {
    //         dispatch(
    //             getFaqAction({
    //                 appNameId: [appNameId, Config.COMMON_QUESTION],
    //                 offset,
    //                 limit,
    //             })
    //         );
    //     }
    //     if (tab == TYPE_TAB.Qa) {
    //         dispatch(getQasAction({ appNameId, offset, limit }));
    //     }
    //     setCurrentpage(value);
    //     scrollToElementByClassName(".faqs-and-qa-content");
    // };

    const setTabFunction = (tab: string) => {
        setTab(tab);
        // setCurrentpage(1);
        // dispatch(updateLengthAction(0));
    };
    // const dispatchAction = () => {
    //     if (tab == TYPE_TAB.Faq) {
    //         dispatch(
    //             getFaqAction({
    //                 appNameId: [appNameId, Config.COMMON_QUESTION],
    //                 offset: 0,
    //                 limit,
    //             })
    //         );
    //     }
    //     if (tab == TYPE_TAB.Qa) {
    //         dispatch(getQasAction({ appNameId, offset: 0, limit }));
    //     }
    // };
    return (
        <>
            <div className="faqs-and-qa-content">
                <MyContainer>
                    {/* {tab == TYPE_TAB.Qa && isMobile && (
                        <ButtonPostQuestion setPostQuestion={(value) => setTab(TYPE_TAB.Post_question)} />
                    )} */}

                    <div className="tabs">
                        <div
                            className={"tab " + (tab == TYPE_TAB.Faq ? "selected" : "")}
                            onClick={() => setTabFunction(TYPE_TAB.Faq)}
                        >
                            <p>FAQs</p>
                            <div className="tab-indicator "></div>
                        </div>
                        <div
                            className={"tab " + (tab == TYPE_TAB.Qa || tab == TYPE_TAB.Post_question ? "selected" : "")}
                            onClick={() => setTabFunction(TYPE_TAB.Qa)}
                        >
                            <p>Q&A </p>
                            <div className="tab-indicator "></div>
                        </div>
                        {/* {tab == TYPE_TAB.Qa && !isMobile && (
                            <ButtonPostQuestion setPostQuestion={(value) => setTabFunction(TYPE_TAB.Post_question)} />
                        )} */}
                    </div>
                </MyContainer>
                <div className="content">
                    <MyContainer>
                        <div style={{ display: "flex", alignItems: "center", paddingTop: "12px", textDecoration: "underline" }}>
                            <WarningAmberRoundedIcon htmlColor="#E3A651" />
                            This site is currently under maintenance, We should be back shortly!
                        </div>
                        <div className="content-container">
                            <div className="right-content">
                                <ContentTab loading={true} />
                                {/* {tab == TYPE_TAB.Faq && (
                                    <ContentTab
                                        loading={loading}
                                        children={<FaqsContent currentPage={currentPage} limit={limit} appInfo={appInfo} />}
                                    />
                                )}

                                {tab == TYPE_TAB.Qa && (
                                    <ContentTab
                                        loading={loading}
                                        children={
                                            <QasContent
                                                listQas={listQas}
                                                appInfo={appInfo}
                                                isSingleQa={isSingleQa}
                                                qaContent={qaContent}
                                            />
                                        }
                                    />
                                )}
                                {tab == TYPE_TAB.Post_question && <AddQestion appInfo={appInfo} />}
                                {(tab == TYPE_TAB.Faq || tab == TYPE_TAB.Qa) && numberPages > 0 ? (
                                    <div className="pagination">
                                        <Pagination count={numberPages} page={currentPage} onChange={handleChange} />
                                    </div>
                                ) : null} */}
                            </div>
                            {/* {hotQuestion?.length > 0 && <HotQuestions hotQuestion={hotQuestion} appInfo={appInfo} />} */}
                        </div>
                    </MyContainer>
                </div>
            </div>
        </>
    );
};
const ContentTab = ({ loading }: { loading: boolean }) => {
    return <V4CircleProgress />;
};
// const ButtonPostQuestion = ({ setPostQuestion }: { setPostQuestion: Function }) => {
//     // const [showLogin, setShowLogin] = useState(false);
//     // const userInfo = useSelector((state: any) => state.userReducer.userInfo);

//     return (
//         <>
//             {/* <div className="post-question-component">
//                 <Button
//                     className="button-post-question"
//                     onClick={() => {
//                         if (userInfo) {
//                             setPostQuestion(true);
//                         } else {
//                             localStorage.setItem(
//                                 "selectedTab",
//                                 "post_question"
//                             );
//                             setShowLogin(true);
//                         }
//                     }}
//                 >
//                     Post Question
//                 </Button>
//             </div>
//             {showLogin && (
//                 <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
//                     <LoginContainer style={{ paddingTop: "0" }} />
//                 </Dialog>
//             )} */}
//         </>
//     );
// };
export default FaqsAndQaContent;
