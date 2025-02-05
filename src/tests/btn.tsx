"use client";
import { userState } from "@/redux/features/user";
import { useAppSelector } from "@/redux/hooks";

const BtnTets = ({ correct }: { correct: boolean }) => {
    const { isTester } = useAppSelector(userState);
    if (isTester && correct)
        return (
            <div>
                <span>★</span>
            </div>
        );
    return null;
};
export default BtnTets;
