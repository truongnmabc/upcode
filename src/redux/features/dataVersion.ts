export const DATA_VERSION = "29032024";
export const resetData = () => {
    const dataVersion = localStorage.getItem("data-version");
    return DATA_VERSION !== dataVersion && false;
};
