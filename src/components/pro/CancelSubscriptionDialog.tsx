import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import * as ga from "../../services/ga";
import { IAppInfo } from "../../models/AppInfo";
import { IPaymentInfo } from "../../models/PaymentInfo";
import { cancelSubscriptionAPI, cancelSubscriptionEmailAPI } from "../../services/paypal.service";
import "./CancelSubscriptionDialog.scss";
import CheckboxCancelDialog from "../icon/CheckboxCancelDialog";
import CheckboxCheckedIcon from "../icon/CheckboxCheckedIcon";

const LIST_TEXT_CHECKBOX = ["I’ve passed my exam", "I’ve learnt all questions", "Bad question quality", "Others"];

const CancelSubscriptionDialog = ({
    open,
    setOpen,
    appInfo,
    setIsActive,
    orderInfo,
    paymentInfo,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    appInfo: IAppInfo;
    setIsActive: (isActive: boolean) => void;
    orderInfo: any;
    paymentInfo: IPaymentInfo;
}) => {
    const [listChoice, setListChoice] = useState([]); // cái này để làm màu à?
    const cancelSubscriptionHandle = async () => {
        // cancel paymentInfo luônvif 1 app 1 thời điểm chỉ active được 1 paymentInfo (gọi api cancel tới paypal)
        try {
            setListChoice([]);
            if (orderInfo?.status == "ACTIVE") {
                let timeExpiration = new Date(orderInfo.billing_info.next_billing_time);
                await cancelSubscriptionAPI(paymentInfo.orderId);
                ga.event({
                    action: "cancel_subscription",
                    params: {
                        order_id: paymentInfo.orderId,
                        user_id: paymentInfo.userId,
                    },
                });
                setIsActive(false);
                let name = orderInfo.subscriber?.name.given_name;
                await cancelSubscriptionEmailAPI(appInfo, new Date(timeExpiration), name, paymentInfo.emailAddress);
                window.location.reload();
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    const handleSelected = (value: string) => {
        let copyArray = [...listChoice];
        if (copyArray.includes(value)) {
            copyArray.splice(copyArray.indexOf(value), 1);
            setListChoice([...copyArray]);
        } else {
            setListChoice([...copyArray, value]);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="cancel-dialog">
            <div className="dialog-container">
                <CloseIcon className="close-icon" onClick={() => setOpen(false)}></CloseIcon>
                <div className="cancel-title">Why you leave us?</div>
                <div className="dialog-description">Please tell us why you cancel using Pro version</div>
                <div className="list-checkbox">
                    {LIST_TEXT_CHECKBOX.map((el) => {
                        return (
                            <div className="checkbox-item" key={el}>
                                <FormControlLabel
                                    label={el}
                                    control={
                                        <Checkbox
                                            icon={<CheckboxCancelDialog />}
                                            checkedIcon={<CheckboxCheckedIcon />}
                                            checked={listChoice.includes(el)}
                                            onClick={() => handleSelected(el)}
                                        ></Checkbox>
                                    }
                                ></FormControlLabel>
                            </div>
                        );
                    })}
                </div>
                <Button className="button-cancel" variant="outlined" onClick={() => cancelSubscriptionHandle()}>
                    Cancel Subscription
                </Button>
            </div>
        </Dialog>
    );
};

export default CancelSubscriptionDialog;
