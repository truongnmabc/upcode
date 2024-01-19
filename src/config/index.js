class Config {
    static BASE_URL = "https://test-dot-micro-enigma-235001.appspot.com";
    static HTTP_REQUEST_TIMEOUT = 30000;
    static HTTP_REQUEST_SUCCESS = 200;
    static PREFIX_URL = "/wp-json/passemall/v1";
    static SECRET_KEY = "koolsoft-web";

    static QUESTION_NOT_ANSWERED = 0;
    static QUESTION_ANSWERED_INCORRECT = 1;
    static QUESTION_ANSWERED_CORRECT = 2;
    static QUESTION_ANSWERED_SKIP = 3;
    static QUESTION_SELECTED = 4;

    static GAME_STATUS_TESTING = 0;
    static GAME_STATUS_PASSED = 4;
}
export default Config;
