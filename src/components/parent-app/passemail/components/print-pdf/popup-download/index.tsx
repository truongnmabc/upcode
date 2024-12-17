import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { showPrintPopupAction } from "../../../redux/actions/print";
// import PopupCommon from "../../common/Popup";
import "./index.scss";
const PopupDownloadPdf = () => {
    // const dispatch = useDispatch();
    // const showPopup = useSelector((state: any) => state.printState.showPopup);
    // const renderAction = () => {
    //     return (
    //         // <div>
    //         <Button
    //             onClick={() => dispatch(showPrintPopupAction(false))}
    //             className="button-confirm"
    //         >
    //             Ok
    //         </Button>
    //         // </div>
    //     );
    // };
    return (
        <>PopupCommon</>
        // <PopupCommon
        //     title="Sorry, this function only works on desktop version"
        //     contentText="Please visit this website and log in on your desktop to download these PDFs"
        //     open={showPopup}
        //     setOpen={(value: boolean) => dispatch(showPrintPopupAction(value))}
        //     classNameDialog="download-pdf-popup"
        //     renderAction={renderAction}
        // ></PopupCommon>
    );
};
export default PopupDownloadPdf;
