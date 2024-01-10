import { callApi } from "@/services";

const getCountryAPI = async () => {
    let getCountry: any;
    try {
        getCountry = await callApi({
            url: "https://us-east4-micro-enigma-235001.cloudfunctions.net/get-country",
            method: "get",
            params: null,
        });
    } catch (error) {
        console.log("error", error);
    }
    return getCountry;
};

export default getCountryAPI;
