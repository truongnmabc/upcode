import SEO from "../../components/seo/SEO";
// import { SYNC_TYPE } from "../../config/config_sync";
import { IAppInfo } from "../../models/AppInfo";
import { getAppInfo } from "../../utils/getAppInfo";
import Question from "../../models/Question";
import QuestionLayout from "../../container/question/QuestionLayout";
// import * as ga from "../../lib/ga";
import { useEffect } from "react";
// import { GameState } from "../../redux/reducers/game.reducer";
import Config from "../../config";
import { isMathJaxContent } from "../../utils/v4_question";
import Topic, { ITopic } from "../../models/Topic";
import { useDispatch } from "react-redux";
// import { getTopicsByParentIdSuccess } from "../../redux/actions/topic";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { GameState } from "@/redux/features/game";
import StoreProvider from "@/redux/StoreProvider";
import { getQuestionDataApi, readFileAppFromGoogleStorage } from "@/services/importAppData";
import { getTopicByParentIdSuccess } from "@/redux/features/topic";
const QuestionPage = ({
    appInfo,
    question,
    topic,
    gameState,
    addMathJax,
    anchorText,
    topics,
}: {
    appInfo: IAppInfo;
    question: Question;
    topic: ITopic;
    gameState: GameState;
    addMathJax: boolean;
    anchorText: string;
    topics: ITopic[];
}) => {
    // let webData = {
    //     appId: appInfo.appId,
    //     type: SYNC_TYPE.TYPE_QUESTION,
    //     topicId: topic.id,
    // };
    const dispatch = useDispatch();
    useEffect(() => {
        // ga.event({
        //     action: "users_exclude_blog",
        //     params: { from: window.location.href },
        // });
        if (topics.length > 0) {
            // cẩn thận điều kiện
            dispatch(getTopicByParentIdSuccess(topics)); // chỉ là để update vào redux thôi
        }
    }, []);
    return (
        <>
            <SEO
                appInfo={appInfo}
                addMathJax={addMathJax}
                title={question.question}
                descriptionSEO={
                    question.question + ", " + question.choices.map((c) => c.content).join(", ") + ", " + question.explanation
                }
            ></SEO>
            <StoreProvider />
            <QuestionLayout appInfo={appInfo} anchorText={anchorText} gameState={gameState} topic={topic} listTopics={topics} />
        </>
    );
};

export const getServerSideProps = async (context) => {
    let questionPath = context.params.question as string;
    let appInfo: IAppInfo | null = getAppInfo();
    let slugParts = questionPath.split("-");
    //https://asvab-prep.com/question/cards-normally-sell-for-300-each-how-much-was-saved-if-five-4694479711764480
    let questionId = slugParts[slugParts.length - 1];
    let data: any = await getQuestionDataApi(questionId);
    if (!data) {
        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
    let appData: any = await readFileAppFromGoogleStorage(""); // get data ve
    let { topics } = appData;
    if (topics) {
        topics = topics.map((t) => new Topic(t));
        topics.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    } else topics = [];

    // fullTests và branchTests thì thôi vì từ trang question khả năng đi sang trang branchTest thấp, và cũng không có data câu hỏi đi kèm thì nếu k có mà vào trang cũng tải lại từ đầu

    let question = new Question(data?.question);
    let addMathJax = false;
    if (
        isMathJaxContent(question.question) ||
        isMathJaxContent(question.paragraphContent) ||
        isMathJaxContent(question.explanation) ||
        !!question.choices.find((c) => isMathJaxContent(c.content))
    ) {
        //nếu trong nội dung câu hỏi có chứa math jax thì mới add script
        addMathJax = true;
    }

    let topic = data?.topic;
    let gameState = new GameState({
        id: topic.id + "",
        appId: appInfo.appId,
        currentQuestion: {
            ...question,
            choices: question.choices.map((c) => {
                if (c.isCorrect) c.selected = true;
                return c;
            }),
            questionStatus: Config.QUESTION_ANSWERED_CORRECT,
        },
        listSelected: question.choices.filter((c) => c.isCorrect),
        showAnswer: true,
        gameType: Config.STUDY_GAME,
    });
    let type = data?.type ?? 70;
    // 70% là “Take more free practice tests for other ASVAB topics with our [ASVAB] practice test now!”
    // 20% là “Take more free practice tests for other ASVAB topics with our [ASVAB] practice tests now!”
    // 10% là “Take more free practice tests for other ASVAB topics with our [ASVAB] prep now!”
    let anchorText = getAnchorText(type, appInfo.appName);

    return convertToJSONObject({
        props: { appInfo, question, topic, gameState, addMathJax, anchorText, topics },
    });
};

let getAnchorText = (type: number, appName: string) => {
    if (type == 70) return `${appName} practice test`;
    else if (type == 20) return `${appName} practice tests`;
    else return `${appName} prep`;
};
export default QuestionPage;
