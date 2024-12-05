"use client";
import React, { useEffect } from "react";

const FN = () => {
  useEffect(() => {
    try {
      window.google?.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          logo_alignment: "center",
          width: 300,
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  return (
    <div className="w-full h-10 flex justify-center" id="google-login-button">
      <div id="google-signin-button"></div>
    </div>
  );
};
const GoogleAuthButton = React.memo(FN);
export default GoogleAuthButton;
