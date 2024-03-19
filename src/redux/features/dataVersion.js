export const DATA_VERSION = "19032024";
export const resetData = () => {
    let dataVersion = localStorage.getItem("data-version");
    return DATA_VERSION !== dataVersion;
};
