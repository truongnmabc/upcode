import { APP_SHORT_NAME } from "@/config_app";
import LinearProgress from "@mui/material/LinearProgress";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Rating from "@mui/material/Rating";
import Image from "next/image";
import "./ReviewsDrawerV0.scss";
import { isProduction } from "@/common/constants";
import CloseIcon from "@/asset/icon/CloseIcon";

/**
 * use-client
 */
const ReviewsDrawerV0 = ({ data, chosenReviewId, onClose }: { data: any; chosenReviewId: any; onClose: any }) => {
    let numOfVote = data.app?.userRatingCountForCurrentVersion ?? 0;
    let score = data.app?.averageUserRating ?? 0;
    let displayScore = score.toFixed(1);
    const reviews = data.reviews ?? [];
    const sortReviews = () => {
        let sortedReview = [];
        let chosenReview = "";
        reviews.map((review: string) => {
            if (review.id != chosenReviewId) {
                sortedReview.push(review);
            } else {
                chosenReview = review;
            }
        });
        if (chosenReview !== "") {
            sortedReview.unshift(chosenReview);
        }
        return sortedReview;
    };
    let appName = APP_SHORT_NAME;
    if (appName.toLowerCase().includes("dmv")) {
        appName = "dmv";
    }
    let link =
        `/wp-content/themes/passemall_theme/assets/images/${appName}/` +
        (appName === "passemall" ? "logo-white.svg" : "logo.svg");
    if (!isProduction) {
        let baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        link = baseUrl + "/wp-content/themes/passemall_theme/assets/images/" + APP_SHORT_NAME + "/logo.svg";
    }

    return (
        <SwipeableDrawer anchor={"left"} open={!!chosenReviewId} onOpen={(event) => { }} onClose={(event) => onClose()}>
            <div className="get-pro-drawer-container">
                <div className="drawer-header">
                    <div className="drawer_close_icon-container" onClick={onClose}>
                        <CloseIcon />
                    </div>
                    <div className="drawer-app-icon-container">
                        <Image loader={() => link} src={link} width="150" height="30" quality={100} alt={""} />
                    </div>
                    <div className="drawer-feedback-text">Feedback</div>
                </div>
                <div className="drawer-result-vote">
                    <div className="drawer-vote-count">
                        <div className="num-of_vote">
                            <div className="vote-number">5</div>
                            <div className="get-pro-linear-progress-container">
                                <div className="get-pro-linear-progress">
                                    <LinearProgress variant="determinate" value={92} />
                                </div>
                            </div>
                        </div>
                        <div className="num-of_vote">
                            <div className="vote-number">4</div>
                            <div className="get-pro-linear-progress-container">
                                <div className="get-pro-linear-progress">
                                    <LinearProgress variant="determinate" value={4} />
                                </div>
                            </div>
                        </div>
                        <div className="num-of_vote">
                            <div className="vote-number">3</div>
                            <div className="get-pro-linear-progress-container">
                                <div className="get-pro-linear-progress">
                                    <LinearProgress variant="determinate" value={2} />
                                </div>
                            </div>
                        </div>
                        <div className="num-of_vote">
                            <div className="vote-number">2</div>
                            <div className="get-pro-linear-progress-container">
                                <div className="get-pro-linear-progress">
                                    <LinearProgress variant="determinate" value={1} />
                                </div>
                            </div>
                        </div>
                        <div className="num-of_vote">
                            <div className="vote-number">1</div>
                            <div className="get-pro-linear-progress-container">
                                <div className="get-pro-linear-progress">
                                    <LinearProgress variant="determinate" value={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="drawer-vote-result">
                        <div className="vote-result">{displayScore}</div>
                        <div className="total-vote">{numOfVote + " reviews"}</div>
                    </div>
                </div>
                <div className="get-pro-review-list">
                    {sortReviews().map((review) => {
                        return <ReviewUnit key={review.id} review={review} />;
                    })}
                </div>
            </div>
        </SwipeableDrawer>
    );
};

const ReviewUnit = ({ review }) => {
    let authorName = review.author;
    return (
        <div key={review.id} className={"review-item-drawer"}>
            <div className={"review-panel-drawer"}>
                <div className="user-info-container">
                    <div className="avatar" style={{ backgroundColor: review.color }}>
                        {review.author[0]}
                    </div>
                    <div className="get-pro-info-container">
                        <div className="author-name">{authorName}</div>
                        <div className="last-update-text">{review.lastUpdate}</div>
                    </div>

                    <div className="rating-container">
                        <Rating name="disabled" value={review.rating} readOnly size={"small"} />
                    </div>
                </div>

                <div className="get-pro-comment">{review.content}</div>
            </div>
        </div>
    );
};

export default ReviewsDrawerV0;
