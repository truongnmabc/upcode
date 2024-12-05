"use client";
import { MtUiButton } from "@/components/button";
import Sheet from "@/components/sheet";
import { useRouter } from "next/navigation";
import React from "react";
import { eventSendGA4 } from "@/lib/services/googleEvent";
import { useAppDispatch } from "@/lib/redux/hooks";

const FN = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (agr: boolean) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allowSubmit = false;
  const handleExitStudy = () => {
    setOpen(false);
    router.back();
  };

  const handleSubmit = () => {
    eventSendGA4({
      eventName: "drawer_submit_mobile",
      value: {
        from: window.location.href,
      },
    });
    //   dispatch(onGameSubmitted());
  };
  return (
    <Sheet
      visible={open}
      onClose={() => setOpen(false)}
      mask
      swipeToClose
      handler
      maskClosable
      autoHeight
    >
      <div className="px-6 w-full flex flex-col gap-4 h-full pt-2 pb-4">
        <div className="text-lg font-poppins text-center font-semibold">
          Do you really want to exit?
        </div>
        <div className="text-sm font-poppins text-center font-medium">
          Your progress will be saved!
        </div>
        <div className="w-full flex flex-col gap-3">
          {allowSubmit && (
            <MtUiButton block type="primary" onClick={handleSubmit}>
              Submit
            </MtUiButton>
          )}
          <MtUiButton animated onClick={handleExitStudy} block type="default">
            Exit
          </MtUiButton>
        </div>
      </div>
    </Sheet>
  );
};
const MobileDrawerConfirmExit = React.memo(FN);
export default MobileDrawerConfirmExit;
