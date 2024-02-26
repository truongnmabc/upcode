import Config from "@/config";
import { ITopic } from "@/models/Topic";
import { GameState } from "@/redux/features/game";

const getGameProgress = (gameState: GameState) => {
    let { total, correct } = gameState.progress;
    // Điểm trên x.5 thì làm tròn lên, dướic x.5 thì làm tròn xuống
    // + 0.5 rồi lấy giá trị thấp nhất của kết quả thì ra được cái trên
    let currentScore = 0;
    if (total != 0) {
        if (gameState.levelTag.includes("level")) {
            // số câu hỏi được trả lời đúng trong lần trả lời đầu tiên
            correct = gameState.questions.filter((q) => {
                return q.progress[0] == 1;
            }).length;
        }
        currentScore = Math.floor((correct / total) * 100 + 0.5);
    }
    return {
        passPercent: gameState.passPercent,
        currentScore,
        isPass: gameState.status === Config.GAME_STATUS_PASSED,
        correctNum: correct,
    };
};

/**
 * Hàm này cần đảm bảo chỉ được gọi khi tồn tại trường topics trong topic [có thành phần level trong id]\\\
 * Tìm ra level cao nhất theo tuần tự có thể làm của topic được xét (bằng cách tra trong listGameState xem level cao nhất theo tuần tự đã pass là bao nhiêu để tra ra level sau đó)
 * @param listGameState
 * @param accessTopic
 * @returns level (number) cao nhất của topic có thể làm (theo tuần tự)
 */
const getHighhestLevelOfTopicBePracticed = (listGameState: GameState[], accessTopic: ITopic, k?: string) => {
    try {
        let maxLevel = 0;
        let maxGame: GameState;
        let games = listGameState.filter((g) => (g.id + "").includes(accessTopic.id) && (g.id + "").includes("-"));
        if (games.length > 1) {
            games.sort((a, b) => {
                let a_level = parseInt(a.id.split("-")[1]);
                let b_level = parseInt(b.id.split("-")[1]);
                return a_level - b_level;
            });
        }
        for (let i = 0; i < games.length; i++) {
            // level đã được sort khi khởi tạo topic rồi
            // level cũng được đánh dấu từ 0 (phải duyệt từ 0)
            // tìm ra level cao nhất (theo tuần tự) đã pass của topic đang xét (tồn tại trong listGameState = đã làm)
            let _lv = games[i].id.split("-")[1];
            if (_lv) {
                // vì data cũ có trường này là number, data mới đổi sang string kèm -[level] nên cần check phần level tồn tại hay không
                let lv = parseInt(_lv);
                if (i == lv) {
                    if (games[i].unlock) {
                        maxLevel = lv;
                        maxGame = games[i];
                    } else break;
                    // let { isPass } = getGameProgress(games[i]);
                    // if (isPass && ) {
                    //     // nếu đã pass level đó thì được phép duyệt level tiếp theo (chỉ set pass khi submit (trong action ON_GAME_SUBMITTED))
                    //     maxLevel = lv;
                    //     maxGame = games[i];
                    // } else break;
                } else break;
            }
        }
        if (maxGame) {
            let { isPass } = getGameProgress(maxGame); // nếu game cuối cùng được unlock và pass thì sẽ mở lv tiếp theo
            if (isPass && accessTopic?.topics.length > maxLevel + 1) maxLevel += 1; // level không vượt quá topic hiện có
        }
        return maxLevel;
    } catch (e) {
        console.log("getHighhestLevelOfTopicBePracticed", e);
        return 0;
    }
};

function shuffleV4(list: any[]) {
    return list.sort((a, b) => {
        let num = Math.floor(Math.random() * 101);
        switch (num % 6) {
            case 0:
                return 0;
            case 1:
            case 2:
            case 3:
            case 4:
                return 1;
            case 5:
                return -1;
        }
    });
}
export { getGameProgress, getHighhestLevelOfTopicBePracticed, shuffleV4 };
