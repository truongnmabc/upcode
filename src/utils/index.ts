const getDomainName = (router: any) => {
    let urlCanonical;
    let baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (baseUrl) {
        baseUrl = baseUrl.replace("//api.", "//");
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        if (router?.basePath?.length == 0 && router?.asPath == "/") {
            urlCanonical = baseUrl;
        } else {
            urlCanonical = baseUrl + router.basePath + router.asPath;
        }
    }
    return urlCanonical;
};

const capitalizeFirstWord = (s: string) => {
    if (!s) return "";
    const convetToArray = s?.split(" ");
    return convetToArray
        ?.map((item) => {
            return capitalize(item);
        })
        ?.join(" ");
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const parseBoolean = (b: any) => {
    if (!b) return false;
    return b == true || b == "true" ? true : false;
};

function setScrollDownAuto(screen: string) {
    // Lưu trạng thái hiện tại của trang vào localStorage
    function savePagePosition() {
        localStorage.setItem("scrollPosition", window.pageYOffset.toString());
    }
    // Khôi phục trạng thái của trang từ localStorage
    function restorePagePosition() {
        const scrollPosition = localStorage.getItem("scrollPosition");
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
        }
    }
    if (typeof window !== "undefined") {
        if (screen === "home") {
            restorePagePosition();
            savePagePosition();
        } else {
        }
    }
}

export { parseBoolean, capitalizeFirstWord, getDomainName, setScrollDownAuto };
