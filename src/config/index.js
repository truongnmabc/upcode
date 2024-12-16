class Config {
    static BASE_URL = "https://test-dot-micro-enigma-235001.appspot.com";
    static BASE_URL_DEV = "https://dev-dot-micro-enigma-235001.appspot.com";
    static DASHBOARD_API = `https://dashboard-api2.abc-elearning.org/`;
    static HTTP_REQUEST_TIMEOUT = 30000;
    static HTTP_REQUEST_SUCCESS = 200;
    static PREFIX_URL = "/wp-json/passemall/v1";
    static PREFIX_URL_2 = "/wp-json/wp/v2";
    static SECRET_KEY = "koolsoft-web";
    static TIME_MEMORY_CACHE = 24 * 60 * 60 * 1000;

    static QUESTION_NOT_ANSWERED = 0;
    static QUESTION_ANSWERED_INCORRECT = 1;
    static QUESTION_ANSWERED_CORRECT = 2;
    static QUESTION_ANSWERED_SKIP = 3;
    static QUESTION_SELECTED = 4;

    static GAME_STATUS_FAILED = -1;
    static GAME_STATUS_TESTING = 0;
    static GAME_STATUS_PASSED = 4;
    static STATUS_GAME_INIT = -1;
    static STATUS_GAME_UNFINISHED = 0;
    static STATUS_GAME_FINISH = 1;

    static TOPIC_GAME = 0;
    static TEST_GAME = 1;
    static BRANCH_TEST_GAME = 2;

    static TESTER_KEY = "TESTER_KEY";
    static V4KEYBOARD = [
        "Enter",
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Numpad1",
        "Numpad2",
        "Numpad3",
        "Numpad4",
        "Numpad5",
        "NumpadEnter",
    ];

    static KEY_CLICK_ADS = "sdakcilc";
    static MAX_CLICK_ADS_PER_USER = 3;
    static COUNT_ADS_KEY = "COUNT_ADS_KEY";
    static MAX_TIMES_DISPLAY_ADS = 100;
    static MILLISECONDS_PER_DAY = 86400000;
    static PAYMENT_SUCCESS = 1;
    static PAYMENT_INIT = 0;
    static PAY_ONE_TIME = 0;
    static PURCHAR = 0;
    static PURCHARED = 1;
    static PAY_SUBSCRIPTION = 1;
    static PAYMENT_PAY_SUBSCRIPTION = "2";
    static DATE_VALUE_STRING = {
        DAY: 1,
        WEEK: 7,
        MONTH: 30,
        YEAR: 365,
    };
}
export default Config;
