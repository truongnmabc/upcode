import IconProps from "./IconProp";

const YoutubeIcon = ({ color = "#212121", width = 24, height = 24 }: IconProps) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM15.948 7C17.628 7 19 8.4 19 10.1143V13.8857C19 15.6 17.628 17 15.948 17H8.052C6.372 17 5 15.6 5 13.8857V10.1143C5 8.4 6.372 7 8.052 7H15.948ZM10.824 13.9714L13.988 12.2C14.128 12.1143 14.156 11.9143 13.988 11.8286L10.824 9.97143C10.712 9.88571 10.572 9.97143 10.572 10.1429V13.8C10.572 13.9429 10.684 14.0571 10.824 13.9714Z"
                fill={color}
            />
        </svg>
    );
};

export default YoutubeIcon;
