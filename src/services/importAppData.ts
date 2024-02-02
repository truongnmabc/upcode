import Topic from "@/models/Topic";
import { isProduction } from "../config/config_web";
import { callApi } from "../services/index";
import TestInfo from "@/models/TestInfo";
import { genFullStudyLink } from "@/utils/getStudyLink";
import { IAppInfo } from "@/models/AppInfo";
export async function readFileAppFromGoogleStorage(appInfo: IAppInfo) {
    //storage.googleapis.com/micro-enigma-235001.appspot.com/data-app/data-4878338973761536.json
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/asvab_new/datacdl.txt
    try {
        console.log("---" + appInfo.bucket);
        //https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/topics-and-tests.json
        let data = await callApi({
            url: "new-data-web/" + appInfo.bucket + "/topics-and-tests.json?t=" + new Date().getTime(), // sau bo sung tham so vao url cho tong quat
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });
        let topics = (data?.topics ?? []).map((t) => new Topic(t));
        topics.sort((a: any, b: any) => {
            return a.name.localeCompare(b.name);
        });
        let _tests = data?.fullTests ?? [];
        let tests = _tests.map((t: any) => new TestInfo({ ...t, slug: genFullStudyLink(appInfo, t?.tag, true) }));
        return { ...data, fullTests: tests, topics };
    } catch (error) {
        console.log("readFileAppFromGoogleStorage error", appInfo.bucket);
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
