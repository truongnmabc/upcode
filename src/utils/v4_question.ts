export var TextContentType;
(function (TextContentType) {
    TextContentType[(TextContentType["question"] = 1)] = "question";
    TextContentType[(TextContentType["answer"] = 2)] = "answer";
    TextContentType[(TextContentType["explanation"] = 3)] = "explanation";
})(TextContentType || (TextContentType = {}));

export function renderMath(callback?: any) {
    if (window.MathJax?.startup) {
        window.MathJax.startup.defaultReady();
        window.MathJax.startup.promise.then(() => {
            console.log("MathJax initial typesetting complete");
            if (callback) callback();
        });
    }
}

export const isMathJaxContent = (text: string) => {
    // if (!text) return false;
    // // Regular expression pattern to match MathJax elements
    // var regex = /\\\(.*?\\\)|\\\[(.|[\r\n])*?\\\]/g; //from GPT
    // // Test if the string contains MathJax content
    // return regex.test(text);

    var regex = /\\\(.*?\\\)|\\\[(.|[\r\n])*?\\\]/g; //from GPT
    if (
        text != null &&
        // !!text.match(/((?:\\.|.)*)\1/)
        (regex.test(text) ||
            text.includes("<math") ||
            text.includes("\\[") ||
            text.includes("\\(") ||
            (text.includes("$") && ((text.includes("{") && text.includes("}")) || text.includes("\\"))))
    ) {
        return true;
    }
    return false;
};

export const getUrlImage = (bucket: string, name: string, folder?: string) => {
    return (
        "https://storage.googleapis.com/micro-enigma-235001.appspot.com/" +
        bucket +
        "/" +
        (folder ? folder : "images") +
        "/" +
        name
    );
};

const getImageFromString = (text: string) => {
    var regexp = /[-a-z0-9_\.]*(\.png\$|\.jpg\$|\.jpeg\$|\.gif\$|\.svg\$)/gi;
    var arr = [];
    var result;
    while ((result = regexp.exec(text))) {
        arr[arr.length] = result[0].replace("$", "");
    }
    return arr;
};

const genImageTag = (str: string, bucket: string, folder = "") => {
    let size = getSizeImage(str);
    return (
        '<img style="cursor:pointer;display:inline-block;vertical-align:middle" alt="" src="' +
        getUrlImage(bucket, str, folder) +
        '" width="' +
        size.width +
        '" height="' +
        size.height +
        '" />'
    );
};

export const formatTextContent = (content: string, bucket: string, folder = "") => {
    let images = getImageFromString(content);
    // console.log("images ", images);
    let newImages = [];
    for (const image of images) {
        if (!newImages.includes(image)) {
            newImages.push(image);
        }
    }
    for (const image of newImages) {
        if (content.includes("$" + image + "$")) {
            let imageTag = genImageTag(image, bucket, folder);
            content = content.replaceAll("$" + image + "$", imageTag);
        } else {
            let imageTag = genImageTag(image, bucket, folder);
            content = content.replaceAll(image + "", imageTag);
        }
    }
    return content;
};
export function hasImage(str: string) {
    return (
        !!str &&
        (str.includes(".png") || str.includes(".jpg") || str.includes(".gif") || str.includes(".tiff") || str.includes(".bmp"))
    );
}

export function isImage(str: string) {
    return (
        !!str &&
        (str.endsWith(".png") || str.endsWith(".jpg") || str.endsWith(".gif") || str.endsWith(".tiff") || str.endsWith(".bmp"))
    );
}

export function getSizeImage(str: string) {
    let i1 = str.indexOf("_"),
        i2 = str.lastIndexOf(".");
    if (i1 > -1 && i2 > -1) {
        let sizeStr = str.substring(i1, i2);
        let i3 = sizeStr.indexOf("_w"),
            i4 = sizeStr.lastIndexOf("_h");
        if (i3 > -1 && i4 > -1) {
            let width = sizeStr.substring(i3 + 2, i4);
            let height = sizeStr.substring(i4 + 2, sizeStr.length);
            return { width: width + "px", height: height + "px" };
        }
    }

    return { maxWidth: "200px", maxHeight: "200px" };
}
