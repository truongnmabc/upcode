import { callApi } from ".";

export const getMemberApi = async () => {
    let data = await callApi({
        url: "https://cdl-prep.com/wp-json/passemall/v1/get-all-members",
        method: "get",
        params: null,
    }).catch((e) => console.log(e));
    if (data) {
        return data;
    }
    return null;
};
