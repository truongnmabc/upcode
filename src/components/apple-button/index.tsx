import AppleIcon from "@mui/icons-material/Apple";

const LoginAppleButton = () => {
    return (
        <div className="w-full flex justify-center">
            <div
                className="apple-button "
                onClick={() => {
                    if (window && window?.AppleID) {
                        window.AppleID.auth.signIn();
                    }
                }}
            >
                <div className="apple-icon">
                    <AppleIcon htmlColor="#fff" />
                </div>
                <span>Login with Apple</span>
            </div>
        </div>
    );
};
export default LoginAppleButton;
