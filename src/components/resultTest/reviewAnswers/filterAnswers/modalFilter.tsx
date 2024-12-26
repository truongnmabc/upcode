import { MtUiButton } from "@/components/button";
import CardTopic from "@/components/customTest/modalSetting/cardTopic";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";

const ModalFilter = ({ open, close }: { open: boolean; close: () => void }) => {
    const [listTopic, setListTopic] = useState<ITopic[]>([]);
    const [selectListTopic, setSelectListTopic] = useState<ITopic[]>([]);

    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.topics.toArray();
            if (data) {
                setListTopic(data);
            }
        };
        handleGetData();
    }, []);
    const handleSelectAll = () => {
        setSelectListTopic(listTopic);
    };
    return (
        <Dialog
            open={open}
            onClose={close}
            sx={{
                "& .MuiDialog-paper": {
                    width: "100%",
                    maxWidth: "1100px",
                    maxHeight: "360px",
                    boxShadow: "4px 8px 23.8px 0px #2121213D",
                    borderRadius: "16px",
                },
            }}
        >
            <div className="p-6 h-full w-full">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3 ">
                        <p className="text-lg font-semibold">Subjects</p>
                        <span
                            className=" underline cursor-pointer text-sm font-normal"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </span>
                    </div>
                    <MtUiButton type="primary" size="large">
                        Apply Filter
                    </MtUiButton>
                </div>
                <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
                    {listTopic?.map((item) => (
                        <CardTopic
                            item={item}
                            key={item.id}
                            selectListTopic={selectListTopic}
                            setSelectListTopic={setSelectListTopic}
                        />
                    ))}
                </div>
            </div>
        </Dialog>
    );
};

export default React.memo(ModalFilter);
