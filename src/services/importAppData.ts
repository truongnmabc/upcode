// import dataApp from "../../data/dataCDL.json";
import { isWebASVAB } from "../config/config_web";
import { callApi } from "../services/index";
export async function readFileAppFromGoogleStorage(appKey: string) {
    //storage.googleapis.com/micro-enigma-235001.appspot.com/data-app/data-4878338973761536.json
    // https://storage.googleapis.com/micro-enigma-235001.appspot.com/asvab_new/datacdl.txt
    try {
        if (isWebASVAB()) {
            //https://storage.googleapis.com/micro-enigma-235001.appspot.com/new-data-web/asvab/topics-and-tests.json
            let data = await callApi({
                url: "new-data-web/asvab/topics-and-tests.json?t=" + new Date().getTime(), // sau bo sung tham so vao url cho tong quat
                params: null,
                method: "get",
                baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
                headers: null,
            });

            return data;
        }
        let data = await callApi({
            url: "data-app/data-" + appKey + ".json?t=" + Date.now(),
            params: null,
            method: "get",
            baseURl: "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            headers: null,
        });
        return data;
    } catch (error) {
        console.log("readFileAppFromGoogleStorage error");
    }
}
