import Dialog from "@mui/material/Dialog";
import React from "react";
// import { createPortal } from "react-dom";
import "./DialogProvider.scss";
const EMPTY_FUNC = (agr) => {};
const DialogContext = React.createContext([EMPTY_FUNC, EMPTY_FUNC]);
export const useDialog = () => React.useContext(DialogContext);

function DialogContainer(props) {
    const { children, open, onClose, onKill } = props;
    // const [mount, setMount] = React.useState<any>(null);
    // React.useEffect(() => {
    //     if (typeof document !== "undefined") {
    //         setMount(document.body);
    //     }
    // }, []);
    return (
        <Dialog open={open} onClose={onClose} className="customize-dialog">
            {children}
        </Dialog>
    );
    // return mount ? (
    //     <>
    //         {createPortal(
    //             <MyDialog open={open} onClose={onClose}>
    //                 {children}
    //             </MyDialog>,
    //             mount
    //         )}
    //     </>

    // ) : (
    //     <></>
    // );
}

const DialogProvider = ({ children }) => {
    const [dialogs, setDialogs] = React.useState([]);
    const createDialog = (option) => {
        const dialog = { ...option, open: true };
        setDialogs((dialogs) => [...dialogs, dialog]);
    };
    const closeDialog = () => {
        setDialogs((dialogs) => {
            const latestDialog = dialogs.pop();
            if (!latestDialog) return dialogs;
            if (latestDialog.onClose) latestDialog.onClose();
            return [...dialogs].concat({ ...latestDialog, open: false });
        });
    };
    const contextValue = React.useRef([createDialog, closeDialog]);

    return (
        <DialogContext.Provider value={contextValue.current}>
            {children}
            {dialogs.map((dialog, i) => {
                const { onClose, ...dialogParams } = dialog;
                const handleKill = () => {
                    if (dialog.onExited) dialog.onExited();
                    setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
                };

                return <DialogContainer key={i} onClose={closeDialog} onKill={handleKill} {...dialogParams} />;
            })}
        </DialogContext.Provider>
    );
};

// const MyDialog = ({ open, onClose, children }: { open: boolean; onClose: any; children: any }) => {
//     const presentation = React.useRef<HTMLDivElement>(null);
//     const [_open, setOpen] = React.useState(false);
//     React.useEffect(() => {
//         if (open) {
//             setOpen(true);
//         } else {
//             document.body.style.overflow = "unset";
//             document.getElementById("__next").style.height = "100%";
//             document.getElementById("__next").style.overflow = "";
//             document.getElementById("v4-presentation-dialog_blank").style.backgroundColor = "rgba(33,33,33,0)";
//             setTimeout(() => {
//                 if (presentation?.current?.style) presentation.current.style.zIndex = "-9999";
//                 setOpen(false);
//             }, 200);
//         }
//     }, [open]);
//     React.useEffect(() => {
//         if (_open) {
//             let __next = document.getElementById("__next");
//             __next.style.height = "-webkit-fill-available"; // chu y cho nay
//             __next.style.overflow = "hidden";
//             document.body.style.overflow = "hidden";
//             presentation.current.style.zIndex = "1200";
//             setTimeout(() => {
//                 document.getElementById("v4-presentation-dialog_blank").style.backgroundColor = "rgba(33,33,33,0.3)";
//             }, 1);
//         }
//     }, [_open]);
//     return _open ? (
//         <div className={"v4-presentation-dialog " + (open ? "show" : "")} ref={presentation}>
//             <div
//                 id="v4-presentation-dialog_blank"
//                 onClick={(e) => {
//                     onClose();
//                 }}
//             ></div>
//             <div className="v4-presentation-dialog-content">{children}</div>
//         </div>
//     ) : (
//         <></>
//     );
// };

export default DialogProvider;
