import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/header/Header1";
import React from "react";

const Layout1 = ({ children }: { children: any }) => {
    return (
        <div>
            <Header1 />
            {children}
            <Footer1 />
        </div>
    );
};

export default Layout1;
