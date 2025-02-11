"use client";

const BtnTets = ({ correct }: { correct: boolean }) => {
    const isTester = localStorage.getItem("isTester");
    if (isTester && correct)
        return (
            <div>
                <span>★</span>
            </div>
        );
    return null;
};
export default BtnTets;
