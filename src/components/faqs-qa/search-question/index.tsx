// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import Config from "../../../config";
// import { APP_SHORT_NAME } from "../../../config_app";
// import { searchQuestionFaqandQaAction } from "../../../redux/actions/faq-qa.action";
// import { useDebounce } from "../../common/use-debounce";
import { Container, TextField } from "@mui/material";

// import { TYPE_TAB } from "../content";
import "./index.scss";
const SearchQuestion = ({ setTab }: { setTab: Function }) => {
    // const dispatch = useDispatch();
    // const [searchTerm, setSearchTerm] = useState<string>("");
    // const limit = Config.PER_PAGE;
    // const debouncedSearchTerm: string = useDebounce(searchTerm, 200);

    const searchQuestion = (e: any) => {
        // setSearchTerm(e.target?.value);
        // setTab(TYPE_TAB.Faq);
    };

    // useEffect(() => {
    //     if (debouncedSearchTerm && false) {
    //         let payload = {
    //             keyword: debouncedSearchTerm,
    //             limit,
    //             offset: 0,
    //             appNameId: [APP_SHORT_NAME, Config.COMMON_QUESTION],
    //         };
    //         dispatch(searchQuestionFaqandQaAction(payload));
    //     }
    // }, [debouncedSearchTerm]);
    return (
        <Container>
            <div className="search-question">
                <SearchSvg />
                <TextField
                    placeholder="Enter your question"
                    variant="outlined"
                    onChange={(event: any) => searchQuestion(event)}
                />
            </div>
        </Container>
    );
};
export default SearchQuestion;

const SearchSvg = () => {
    return (
        <div className="search-svg">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.2555 20.6065L18.8182 17.2458V17.2458L18.7376 17.1233C18.5878 16.9742 18.383 16.8902 18.1692 16.8902C17.9554 16.8902 17.7505 16.9742 17.6007 17.1233V17.1233C14.6795 19.8033 10.1781 19.949 7.08201 17.4637C3.98586 14.9784 3.25567 10.6334 5.37568 7.31017C7.4957 3.98697 11.8081 2.71685 15.4528 4.34214C19.0976 5.96743 20.9438 9.98379 19.767 13.7276C19.6823 13.9981 19.7515 14.2922 19.9487 14.4992C20.1459 14.7062 20.4411 14.7946 20.723 14.7311C21.005 14.6676 21.2309 14.4619 21.3156 14.1914V14.1914C22.7224 9.74864 20.5977 4.96755 16.3161 2.94106C12.0345 0.914562 6.88084 2.25082 4.18905 6.08542C1.49727 9.92001 2.07518 15.1021 5.54893 18.2795C9.02268 21.4569 14.3498 21.6759 18.0841 18.7949L21.1277 21.7705C21.442 22.0765 21.9502 22.0765 22.2645 21.7705C22.5785 21.4602 22.5785 20.9606 22.2645 20.6503V20.6503L22.2555 20.6065Z"
                    fill="#212121"
                />
            </svg>
        </div>
    );
};
