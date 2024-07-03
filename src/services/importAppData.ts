import Topic from "@/models/Topic";
import { isProduction } from "../config/config_web";
import { callApi } from "../services/index";
import TestInfo from "@/models/TestInfo";
import { genFullStudyLink } from "@/utils/getStudyLink";
import { IAppInfo } from "@/models/AppInfo";
import Config from "@/config";
const BUCKET = "new-data-web/";
const BUCKET2 = "new-data-web-test/";
export async function readFileAppFromGoogleStorage(appInfo: IAppInfo, _state?: string) {
    // ****  NẾU SỬA HÀM NÀY THÌ PHẢI SỬA CẢ HÀM fetchData TRONG FILE gen-data.js
    try {
        console.log("---" + appInfo.bucket);
        let isDmv = !!_state || true;
        //https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/topics-and-tests.json
        let data = await callApi({
            url:
                (!isDmv ? BUCKET : BUCKET2) +
                appInfo.bucket +
                (_state ? "/" + _state : "") +
                "/topics-and-tests.json?t=" +
                new Date().getTime(), // sau bo sung tham so vao url cho tong quat
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });
        let topics = (data?.topics ?? []).map(
            (t) => new Topic({ ...t, slug: genFullStudyLink(appInfo, t.tag, false, _state) })
        );
        topics.sort((a: any, b: any) => {
            if (!!a?.orderIndex && !!b.orderIndex) return a.orderIndex - b.orderIndex;
            return a.name.localeCompare(b.name);
        });

        let bonusQuestions = topics.filter((t) => t.name.toLowerCase().includes("bonus "));
        topics = topics.filter((t) => !t.name.toLowerCase().includes("bonus "));
        topics = topics.concat(bonusQuestions);

        let _tests = data?.fullTests ?? [];
        let tests = _tests.map(
            (t: any) => new TestInfo({ ...t, slug: genFullStudyLink(appInfo, t?.tag, true, _state), stateTag: _state })
        );
        return { ...data, fullTests: tests, topics };
    } catch (error) {
        console.log(
            "readFileAppFromGoogleStorage error",
            "new-data-web/" + appInfo.bucket + (_state ? "/" + _state : ""),
            error
        );
        return { topics: [], fullTests: [], branchTests: [] };
    }
}

export async function getTopicQuestionsFromGoogleStorage(bucket: string, topicTag: string, _state: string) {
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/general-science-questions.json
    try {
        let isDmv = !!_state || true;
        let url = `${!isDmv ? BUCKET : BUCKET2}${
            bucket + (_state ? "/" + _state : "")
        }/${topicTag}.json?t=${new Date().getTime()}`;

        let data = await callApi({
            url: url,
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
export async function getTestDataFromGoogleStorage(bucket: string, url: string, _state) {
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/full-tests.json
    try {
        let isDmv = !!_state || true;
        let data = await callApi({
            url: `${!isDmv ? BUCKET : BUCKET2}${bucket + (_state ? "/" + _state : "")}/${url}.json?t=${Date.now()}`,
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });

        return data.map((_) => {
            return { test: new TestInfo(_), cards: _.cards, stateTag: _state };
        });
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

export function syncDataToWebAfterLoginAPI(data: any) {
    //https://micro-enigma-235001.appspot.com/api/auth?type=send-email&email=tranhoang30101@gmail.com&appName=ASVAB
    return callApi({
        baseURl: Config.BASE_URL, // "https://micro-enigma-235001.appspot.com/",
        method: "post",
        url: "/api/auth?type=sync-data-to-web-after-login",
        params: data,
        headers: undefined,
    });
}
