const replaceYear = (year: string) => {
    let text = "";
    const currentYear = "2024";
    if (year) {
        year = year.replace(/\/2021\//g, "year21");
        text = year.replace(/2020/g, currentYear);
        text = year.replace(/2021/g, currentYear);
        text = year.replace(/2022/g, currentYear);
        text = year.replace(/2023/g, currentYear);
        text = text.replace(/year21/g, "/2021/");
    }
    return text;
};

export default replaceYear;
