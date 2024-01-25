class Config {
    static BASE_URL = "https://test-dot-micro-enigma-235001.appspot.com";
    static HTTP_REQUEST_TIMEOUT = 30000;
    static HTTP_REQUEST_SUCCESS = 200;
    static PREFIX_URL = "/wp-json/passemall/v1";
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

    static TOPIC_GAME = 0;
    static TEST_GAME = 1;
    static BRANCH_TEST_GAME = 2;

    static TESTER_KEY = "TESTER_KEY";
}
export default Config;
