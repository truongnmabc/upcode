import { APP_SHORT_NAME } from "@/config_app";

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

function getContactLink(contactMethod) {
    let appName = APP_SHORT_NAME.toLowerCase();
    if (appName == "cdl") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/CDL-prep-101878645343877";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/CLprep";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCke4KGWOxPP8R2aPVQTUAlA";
        } else if (contactMethod == "email") {
            return "support@cdl-prep.com";
        }
    } else if (appName == "asvab") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/ASVAB-Test-Prep-by-ABC-Elearning-104795498352899";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/PrepAsvab";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UC9F-vTfB9PCbxvBT8zqMMJw";
        } else if (contactMethod == "email") {
            return "support@asvab-prep.com";
        }
    } else if (appName == "dmv") {
        if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UClGYoBo4B7IoffZXcwDdRUw";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/dmvprepabcteam";
        } else if (contactMethod == "email") {
            return "support@dmv-practicetests.com";
        }
    } else if (appName == "cna") {
        if (contactMethod == "email") {
            return "support@cna-prep.com";
        }
    } else if (appName == "drivingtheory") {
        if (contactMethod == "email") {
            return "support@drivingtheory-tests.com";
        }
    } else if (appName == "passemall") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/ABC-E-learning-110654290809849";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/abcelearningapp";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCkLKqup_8asTJGtQIgXCOZg";
        } else if (contactMethod == "email") {
            return "support@passemall.com";
        }
    } else if (appName == "realestate") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/Real-Estate-Exam-Prep-by-ABC-Elearning-107910338185108";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCFWA5MkzvzHlHYBFvT9BH9A/about";
        } else if (contactMethod == "email") {
            return "support@realestate-prep.com";
        }
    } else if (appName == "servsafe") {
        if (contactMethod == "facebook") {
            return "facebook.com/Servsafe-Exam-Prep-104667911889218";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UC7A8HrEXgdiR7otcxgAqZZQ/about";
        } else if (contactMethod == "email") {
            return "support@servsafe-prep.com";
        }
    } else if (appName == "aws") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/AWS-Exam-Prep-102525238774581";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCht1edKzc3jXi6RHu-kAXRA/about";
        } else if (contactMethod == "email") {
            return "support@aws-prep.com";
        }
    } else if (appName == "ptce") {
        if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCwk8caoOY4DiyteWcv17nbQ/about";
        } else if (contactMethod == "facebook") {
            return "https://www.facebook.com/PTCB-Exam-Prep-by-ABC-Elearning-102646622056698";
        } else if (contactMethod == "email") {
            return "support@ptceprep.com";
        }
    } else if (appName == "pmp") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/PMP-Exam-Prep-100596645638322";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCv3MA6wPjfvmctrQbrrWYrQ/about";
        } else if (contactMethod == "email") {
            return "support@pmp-testprep.com";
        }
    } else if (appName == "ged") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/people/TestPrep-Ged/100068351480720/";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCsVHfTGvOjveDJSx6c4hdNQ/about";
        } else if (contactMethod == "email") {
            return "support@ged-testprep.com";
        }
    } else if (appName == "teas") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/TEAS-Exam-Prep-113142767696481";
        } else if (contactMethod == "email") {
            return "support@teas-prep.com";
        }
    }
    return null;
}
export { parseBoolean, capitalizeFirstWord, getDomainName, setScrollDownAuto, getContactLink };
