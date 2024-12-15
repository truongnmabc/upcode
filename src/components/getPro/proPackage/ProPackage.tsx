"use client";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { getConfigProV2 } from "@/utils/config_paypal";
import "./ProPackage.scss";

const ProPackage = () => {
    const { appInfo } = useAppSelector(appInfoState);

    const { prices } = getConfigProV2(appInfo);

    // const handleClickGetPro = async (e) => {};
    // let dataConfigPro = prices;
    return (
        <div className="app-pro-package">
            <div className="max-w-page mx-auto w-full">
                <div className="flex items-center justify-center">
                    {prices.map((price, i) => (
                        // <PriceItem
                        //     price={price}
                        //     key={i}
                        //     active={i === active}
                        //     handleActive={() => setActive(i)}
                        //     isMobile={isMobile}
                        // />
                        <div key={i}></div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <MtUiButton
                    className="text-white font-bold text-base text-center"
                    style={{
                        background:
                            "linear-gradient(93.11deg, #0bb177 0.93%, #3b6b5a 100%)",
                    }}
                    onClick={() => {
                        // handleClickGetPro(active);
                    }}
                >
                    Upgrade Now
                </MtUiButton>
            </div>
        </div>
    );
};

// const PriceItem = ({ price, active = false, handleActive, isMobile }) => {
//     const {
//         price: salePrice,
//         initPrice,
//         type,
//         averagePrice,
//         trialDay,
//         savePrice,
//     } = price;
//     return (
//         <div
//             className={`price-item ${active ? "active" : ""}`}
//             onClick={handleActive}
//         >
//             {active && (
//                 <div className="icon-check">
//                     <LazyLoadImage
//                         src="./images/new-pro/check-price.png"
//                         alt="icon-check"
//                     />
//                 </div>
//             )}
//             {isMobile ? (
//                 <>
//                     <div
//                         className={
//                             "text-save-price " + (active ? "active" : "")
//                         }
//                         id="text-save-price"
//                     >
//                         {savePrice?.text && (
//                             <div className="text">{savePrice?.text}</div>
//                         )}
//                     </div>
//                     <div className="price-item-container">
//                         <div className="price-section">
//                             <span className="sale-price">${salePrice}</span>
//                         </div>
//                         <div className="type">{type}</div>
//                         <div className="divide"></div>
//                         <div className="average-price">
//                             Just <b>${averagePrice} </b>
//                         </div>
//                         <div className="day">Per Day</div>
//                         <div className="trial-day">
//                             {trialDay && (
//                                 <>
//                                     {trialDay}-days <b>FREE</b> trial
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                     {savePrice?.text && (
//                         <div className="percent-save-price">
//                             Save {savePrice?.percent} %
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <>
//                     <div className="price-item-container">
//                         <div className="price-section">
//                             <span className="sale-price" id="text-save-price">
//                                 ${salePrice}{" "}
//                             </span>
//                             {initPrice && (
//                                 <span className="current-price">
//                                     ${initPrice}
//                                 </span>
//                             )}
//                         </div>
//                         <div className="type">{type}</div>
//                         <div className="divide"></div>
//                         <div className="average-price">
//                             Just <b>${averagePrice} </b>
//                             <span className="day">per Day</span>
//                         </div>
//                         <div className="trial-day">
//                             {trialDay && (
//                                 <>
//                                     {trialDay}-days <b>FREE</b> trial
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                     <div className="save-price">
//                         {savePrice.text && (
//                             <div className="save-price-container">
//                                 <div className="text">{savePrice?.text}</div>
//                                 <div className="save-percent">
//                                     Save{" "}
//                                     <span className="percent">
//                                         {savePrice?.percent}
//                                     </span>
//                                     %
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };
export default ProPackage;
