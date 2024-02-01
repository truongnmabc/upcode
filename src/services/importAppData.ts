import { isProduction } from "../config/config_web";
import { callApi } from "../services/index";
export async function readFileAppFromGoogleStorage(bucket: string) {
    //storage.googleapis.com/micro-enigma-235001.appspot.com/data-app/data-4878338973761536.json
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/asvab_new/datacdl.txt
    try {
        console.log("---" + bucket);
        //https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/topics-and-tests.json
        let data = await callApi({
            url: "new-data-web/" + bucket + "/topics-and-tests.json?t=" + new Date().getTime(), // sau bo sung tham so vao url cho tong quat
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });
        return data;
    } catch (error) {
        console.log("readFileAppFromGoogleStorage error", bucket);
        return { topics: [], fullTests: [], branchTests: [] };
    }
}

export async function getTopicQuestionsFromGoogleStorage(bucket: string, topicTag: string) {
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/general-science-questions.json
    try {
        let data = await callApi({
            url: `new-data-web/${bucket}/${topicTag}.json?t=${new Date().getTime()}`,
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });

        return data;
    } catch (error) {
        console.log("getTopicQuestionsFromGoogleStorage error");
        return [];
    }
}
export async function getTestDataFromGoogleStorage(bucket: string, branchSlug: string) {
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/full-tests.json
    try {
        let data = await callApi({
            url: `new-data-web/${bucket}/${branchSlug ? branchSlug : "full-tests"}.json?t=${Date.now()}`,
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });

        return data;
    } catch (error) {
        console.log("getTestDataFromGoogleStorage error");
    }
}
export async function getQuestionDataApi(questionId: string) {
    //https://test-dot-micro-enigma-235001.appspot.com/api/web?type=get-topic-by-question-id&questionId=4505397937307648
    try {
        let data = await callApi({
            url: `api/web?type=get-topic-by-question-id&questionId=${questionId}`,
            params: null,
            method: "get",
            baseURl: isProduction()
                ? "https://micro-enigma-235001.appspot.com/"
                : "https://test-dot-micro-enigma-235001.appspot.com/",
            headers: null,
        }).catch((e) => {
            console.log("getQuestionDataApi error1: ", e);
        });
        return data;
    } catch (error) {
        console.log("getQuestionDataApi error2: ", error);
        return null;
    }
}
