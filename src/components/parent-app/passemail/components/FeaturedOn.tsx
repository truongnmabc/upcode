import React from "react";
import "./FeaturedOn.scss";
const FeaturedOn = () => {
    const totalUnit = 15;
    const unit = Array.from({ length: totalUnit }, (_, i) => i + 1);
    return (
        <div className="v0-featured-on">
            <h2 className="h2">Featured on</h2>
            <div className="featured-logo-container">
                {unit.map((value, index) => {
                    return (
                        <div className="logo-unit" key={index}>
                            <img src={"/images/homeV0/logo-" + value + ".png"} loading="lazy" alt="" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedOn;
