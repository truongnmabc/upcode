// import { isProduction } from "@/config/config_web";
// import { getAppReviewApi } from "@/services/home.service";
// import Rating from "@mui/material/Rating";
// import { useEffect, useState } from "react";
import "./StoreReviews.scss";
import dynamic from "next/dynamic";
const ReviewsDrawerV0 = dynamic(() => import("./ReviewsDrawerV0"), {
    ssr: false,
});

const StoreReviews = ({ appId }: { appId: number }) => {
    // const [reviews, setReviews] = useState<any>({});
    // const [reviewId, setChoosenReviewId] = useState();
    // useEffect(() => {
    //     const getAppReviews = async () => {
    //         let res = null;
    //         if (!isProduction()) res = REVIEWS;
    //         else res = await getAppReviewApi(appId);

    //         if (res) {
    //             let _reviews = res.reviews;
    //             _reviews = _reviews.filter((r) => r.rating === 5);
    //             const randomColorList = ["#666444", "#F1EFD8", "#767462", "#3A3523", "#505130", "#252F14"];
    //             const min = 0;
    //             const max = randomColorList.length - 1;

    //             for (let index = 0; index < _reviews.length; index++) {
    //                 let intNumber = Math.floor(Math.random() * (max - min)) + min;
    //                 let chosenColor = randomColorList[intNumber];
    //                 _reviews[index].color = chosenColor;
    //             }

    //             setReviews({ ...res, reviews: _reviews });
    //         }
    //     };
    //     if (!!appId) {
    //         getAppReviews();
    //     }
    // }, [appId]);

    return (
        <div className="store-reviews-container">
            {/* <div className="reviews-grid">
                {reviews.length != 0 ? (
                    <RVColumnV0
                        rv={reviews.reviews}
                        openDrawer={(id) => {
                            setChoosenReviewId(id);
                        }}
                    />
                ) : (
                    <></>
                )}
            </div>
            <ReviewsDrawerV0
                data={reviews}
                chosenReviewId={reviewId}
                onClose={() => {
                    setChoosenReviewId(null);
                }}
            /> */}
        </div>
    );
};

// const RVColumnV0 = ({ rv, openDrawer }) => {
//     return (
//         <div className="rv-grid-column">
//             {rv?.map((review, index) => {
//                 return (
//                     <div className="rv-item-wrapper" onClick={() => openDrawer(review.id)} key={index}>
//                         <div className="rv-item">
//                             <div className="profile-wrapper">
//                                 <div
//                                     className="avatar"
//                                     style={{
//                                         backgroundColor: review.color,
//                                     }}
//                                 >
//                                     <span className="letter">{review.author[0]}</span>
//                                 </div>
//                                 <div className="profile-name">
//                                     <span className="name">{review.author}</span>
//                                     <span className="last-update">{review.lastUpdate}</span>
//                                 </div>
//                             </div>
//                             <div className="twitted">
//                                 <span>{review.content}</span>
//                             </div>
//                             <div className="rate">
//                                 <Rating name="disabled" value={review.rating} readOnly size={"small"} />
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

export default StoreReviews;

const REVIEWS = {
    app: {
        id: 3,
        name: "CDL",
        appstoreID: "1469379973",
        appstoreLanguage: "us",
        averageUserRating: 4.92184,
        userRatingCountForCurrentVersion: 14010,
        appID: "6540077669810176",
        test: 2,
        platform: 1,
    },
    reviews: [
        {
            id: 3928,
            title: null,
            content: "awesome",
            author: "Justus Almonte",
            lastUpdate: "2022-05-25",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3929,
            title: null,
            content: "very useful if you want to join the army",
            author: "Ruben Longoria",
            lastUpdate: "2022-05-25",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3943,
            title: "Good",
            content:
                "Really good studying app. Recruiters recommended it to me",
            author: "levibestdog",
            lastUpdate: "2022-05-25",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3899,
            title: null,
            content: "buena",
            author: "Omar Gonzalez",
            lastUpdate: "2022-05-23",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3900,
            title: null,
            content:
                "When you've been out of school simple questions seem like SAT questions but this perfect practice for those a little rusty. Highly Recommend",
            author: "Alex Ramirez",
            lastUpdate: "2022-05-23",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3875,
            title: null,
            content: "great app to study",
            author: "Tobias",
            lastUpdate: "2022-05-21",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3885,
            title: "ARMY",
            content:
                "This is really helping me study for my asvab. I may be in 9th grade but it’s a lot of help on learning new things to get to a goal that has been set since I was 5. I love this app.",
            author: "blalockalysa21",
            lastUpdate: "2022-05-20",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3858,
            title: null,
            content:
                "i love this app, its really helps for better understanding the question you may not know.",
            author: "Raymond Quintero",
            lastUpdate: "2022-05-19",
            rating: 4,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3856,
            title: "Studying for ASVAB",
            content:
                "I was assigned this study app by my recruiter, not exactly sure what’s going to be on the ASVAB but this app is defiantly helping refresh my memory on some things I haven’t done in years.",
            author: "#mommabear2020",
            lastUpdate: "2022-05-18",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3857,
            title: "Wonderful!",
            content: "Very well put together great app",
            author: "J_Butts_05",
            lastUpdate: "2022-05-17",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3814,
            title: null,
            content:
                "This app is so Amazing and effective I recommend it for anyone looking to join the military!",
            author: "Warnerboyz",
            lastUpdate: "2022-05-13",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3800,
            title: null,
            content: "it is pretty helpful 👍",
            author: "Captain Gaming",
            lastUpdate: "2022-05-12",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3777,
            title: null,
            content: "Great app for use of ASVAB practicing test",
            author: "Marki Talbert Jr",
            lastUpdate: "2022-05-10",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3764,
            title: null,
            content: "Lchdfmwm I am ww",
            author: "Adam Encalade",
            lastUpdate: "2022-05-08",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3765,
            title: null,
            content: "great way to sharpen your skills",
            author: "Lisa Cook",
            lastUpdate: "2022-05-08",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3738,
            title: null,
            content: "Helpful for studying the ASVAB",
            author: "Miguel Edurado",
            lastUpdate: "2022-05-06",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3728,
            title: null,
            content: "it's simple and easy to use!",
            author: "Jace Mace",
            lastUpdate: "2022-05-05",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3718,
            title: "Why",
            content: "Helped me",
            author: "Tracerx23",
            lastUpdate: "2022-05-02",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3684,
            title: null,
            content:
                "i scored a 78 on PiCAT after studying for about 2 weeks. highly recommend the free version. take notes!",
            author: "Shayna Smart",
            lastUpdate: "2022-04-30",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3676,
            title: null,
            content: "this app is helping me out allot",
            author: "John Ybarbo",
            lastUpdate: "2022-04-29",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3651,
            title: null,
            content:
                "really good app definitely guaranteed to help with the asvab",
            author: "cameron bishop",
            lastUpdate: "2022-04-27",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3652,
            title: null,
            content:
                "I have no complaints!!! Im just happy someone stepped up to help others like myself. I struggle alot in General Math portion. Thank you!!! I hope I can get into the military and make this world proud!!",
            author: "Burton Squad",
            lastUpdate: "2022-04-27",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3641,
            title: null,
            content: "Exelente aplicacion",
            author: "Melvin Burgos",
            lastUpdate: "2022-04-26",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3649,
            title: "Helpful",
            content: "Really studying and hoping to in-list",
            author: "BRXN PÈRMÄN",
            lastUpdate: "2022-04-26",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3650,
            title: "Great app",
            content:
                "Have tried many many apps before this is one the easiest ever. Don’t actually know if all the questions are legit but  Nonetheless great app",
            author: "Flex_offendor",
            lastUpdate: "2022-04-25",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3627,
            title: null,
            content: "muy buena app 👌👌 felicidades",
            author: "Jose Vera",
            lastUpdate: "2022-04-23",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3626,
            title: "Functional app",
            content: "Streamline and useful",
            author: "spaudling_2397",
            lastUpdate: "2022-04-22",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3602,
            title: null,
            content:
                "It honestly helped me, before I got this app I didnt really study for the asvab and I got a 48. Now I have a 70 which is a good improvement",
            author: "Waff waff",
            lastUpdate: "2022-04-21",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3587,
            title: null,
            content:
                "I love this app, Just a slight issue with explaining the problem.",
            author: "Ahmad Henley",
            lastUpdate: "2022-04-20",
            rating: 4,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3566,
            title: null,
            content: "BRUH!",
            author: "Chris Carter",
            lastUpdate: "2022-04-17",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3557,
            title: null,
            content:
                "excellent app, using it for the second time to prepare myself and refresh my memory for the ASVAB.",
            author: "Tim Colby",
            lastUpdate: "2022-04-16",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
        {
            id: 3574,
            title: "Add reminders",
            content: "Please add daily reminders!",
            author: "salam11112003",
            lastUpdate: "2022-04-16",
            rating: 5,
            platform: "ios",
            app: 3,
            category: null,
        },
        {
            id: 3439,
            title: null,
            content:
                "I like the mathematical skills required to complete and pass the math side of the test. I've just used to app and have taken my first test and I missed one question regarding the percentage and I like that it had the option to go back to the one you missed so that you can complete it with your newly gained knowledge! hopefully I'll be able to master these skills to pass the asvab with a 80 or higher!",
            author: "Cameron Ring",
            lastUpdate: "2022-04-06",
            rating: 5,
            platform: "android",
            app: 3,
            category: null,
        },
    ],
};
