import React from "react";
import ModalFilter from "./modalFilter";

const FilterIcon = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <div className=" rounded-lg px-5 py-2 bg-[#5497FF1F]">
            <div
                onClick={handleOpen}
                className="text-[#5497FF] cursor-pointer flex items-center text-base gap-1 font-medium"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.5 3H8.571C8.7945 3.86 9.571 4.5 10.5 4.5C11.429 4.5 12.2055 3.86 12.429 3H14.5C14.776 3 15 2.776 15 2.5C15 2.224 14.776 2 14.5 2H12.429C12.2055 1.14 11.429 0.5 10.5 0.5C9.571 0.5 8.7945 1.14 8.571 2H1.5C1.224 2 1 2.224 1 2.5C1 2.776 1.224 3 1.5 3ZM10.5 1.5C11.0515 1.5 11.5 1.9485 11.5 2.5C11.5 3.0515 11.0515 3.5 10.5 3.5C9.9485 3.5 9.5 3.0515 9.5 2.5C9.5 1.9485 9.9485 1.5 10.5 1.5ZM14.5 13H12.429C12.2055 12.14 11.429 11.5 10.5 11.5C9.571 11.5 8.7945 12.14 8.571 13H1.5C1.224 13 1 13.224 1 13.5C1 13.776 1.224 14 1.5 14H8.571C8.7945 14.86 9.571 15.5 10.5 15.5C11.429 15.5 12.2055 14.86 12.429 14H14.5C14.776 14 15 13.776 15 13.5C15 13.224 14.776 13 14.5 13ZM10.5 14.5C9.9485 14.5 9.5 14.0515 9.5 13.5C9.5 12.9485 9.9485 12.5 10.5 12.5C11.0515 12.5 11.5 12.9485 11.5 13.5C11.5 14.0515 11.0515 14.5 10.5 14.5ZM14.5 7.5H6.929C6.7055 6.64 5.929 6 5 6C4.071 6 3.2945 6.64 3.071 7.5H1.5C1.224 7.5 1 7.724 1 8C1 8.276 1.224 8.5 1.5 8.5H3.071C3.2945 9.36 4.071 10 5 10C5.929 10 6.7055 9.36 6.929 8.5H14.5C14.776 8.5 15 8.276 15 8C15 7.724 14.776 7.5 14.5 7.5ZM5 9C4.4485 9 4 8.5515 4 8C4 7.4485 4.4485 7 5 7C5.5515 7 6 7.4485 6 8C6 8.5515 5.5515 9 5 9Z"
                        fill="#5497FF"
                    />
                </svg>

                <span className="text-[#5497FF] text-base font-medium">
                    Filter
                </span>
            </div>
            <ModalFilter open={open} close={handleClose} />
        </div>
    );
};

export default React.memo(FilterIcon);
