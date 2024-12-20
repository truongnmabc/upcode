import "./emotionComponent.scss";
import CongratsAnim from "./congratsAnim";
import LazyLoadImage from "@/components/images";

const EmotionComponent = () => {
    const isCorrect = true;
    const srcImg = isCorrect
        ? "/images/icon-congrat/happy.png"
        : "/images/icon-congrat/sad.png";
    // const percentUser = getPercentUser(20);
    const percentUser = 20;
    return (
        <div className="flex emotion-component justify-center relative gap-[10px] items-center">
            {/* {isCorrect ? <CongratsAnim /> : null} */}

            <LazyLoadImage
                classNames="w-10 h-10"
                src={srcImg}
                data-src={srcImg}
                data-srcset={srcImg}
                alt="Emotion Face"
            />
            <p className="font-medium text-lg text-[#587CDA]">
                {!isCorrect
                    ? "Oops! You are one of " +
                      percentUser +
                      "% of test-takers missed this question. Let's move on!"
                    : "Congrats! You are one of " +
                      (100 - percentUser) +
                      "% of test-takers correctly got this question. Let's move on!"}
            </p>
        </div>
    );
};

// /** fake dữ liệu */
// const getPercentUser = (question: Question) => {
//     let dif = question.difficulty;
//     let per = question.id % 100;
//     if (dif == 1) {
//         while (per > 30) {
//             per -= 10;
//         }
//     } else if (dif == 2) {
//         if (per > 60) {
//             while (per > 60) {
//                 per -= 10;
//             }
//         } else if (per < 40) {
//             while (per < 40) {
//                 per += 10;
//             }
//         }
//     } else if (dif == 3) {
//         while (per < 60) {
//             per += 10;
//         }
//     }
//     return per;
// };
export default EmotionComponent;
