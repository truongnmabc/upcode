const TwitterIcon = ({ color = "#212121", colorApp = "#fff", width = 24, height = 24 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2793_1289)">
                <path
                    d="M24 12C24 18.6274 18.6274 24 12 24C5.37259 24 0 18.6274 0 12C0 5.37258 5.37259 0 12 0C18.6274 0 24 5.37258 24 12Z"
                    fill={color}
                />
                <path
                    d="M19.302 7.36235C18.8231 7.57183 18.3144 7.69153 17.8057 7.78131C18.0451 7.75138 18.4042 7.3025 18.5538 7.12295C18.7633 6.85362 18.9428 6.55437 19.0626 6.22519C19.0626 6.19527 19.0925 6.16535 19.0626 6.13542C19.0326 6.13542 19.0027 6.13542 18.9728 6.13542C18.4042 6.43467 17.8356 6.64415 17.2072 6.8237C17.1473 6.8237 17.1174 6.8237 17.0875 6.79377C17.0276 6.73392 16.9977 6.67407 16.9379 6.64415C16.6685 6.43467 16.3992 6.25512 16.07 6.10549C15.6511 5.92594 15.2022 5.86609 14.7533 5.89602C14.3044 5.92594 13.8855 6.04564 13.4965 6.25512C13.1074 6.4646 12.7483 6.73392 12.479 7.09303C12.1798 7.45213 11.9703 7.87108 11.8805 8.29003C11.7907 8.70899 11.7907 9.12794 11.8506 9.57682C11.8506 9.63667 11.8506 9.66659 11.7907 9.63667C9.36683 9.27756 7.33192 8.40973 5.68603 6.52445C5.62618 6.43467 5.56633 6.43467 5.50648 6.52445C4.78827 7.60175 5.14738 9.33742 6.04513 10.1753C6.16483 10.295 6.28453 10.4147 6.43416 10.5045C6.37431 10.5045 5.77581 10.4446 5.26708 10.1753C5.20723 10.1154 5.14738 10.1454 5.14738 10.2351C5.14738 10.3548 5.14738 10.4446 5.1773 10.5942C5.32693 11.6715 6.07506 12.689 7.09251 13.078C7.21221 13.1379 7.36184 13.1678 7.48154 13.1977C7.24214 13.2576 7.00274 13.2875 6.31446 13.2277C6.22468 13.1977 6.19476 13.2576 6.22468 13.3474C6.73341 14.7239 7.84064 15.1429 8.64862 15.3823C8.76832 15.4122 8.8581 15.4122 8.9778 15.4421C8.9778 15.4421 8.9778 15.4421 8.94788 15.472C8.67855 15.891 7.72094 16.1903 7.30199 16.3399C6.49401 16.6092 5.62618 16.7588 4.78827 16.6691C4.63865 16.6391 4.63865 16.6391 4.5788 16.6691C4.54887 16.699 4.5788 16.7289 4.60872 16.7588C4.78827 16.8785 4.96783 16.9683 5.11745 17.0581C5.6561 17.3274 6.22468 17.5668 6.79326 17.7164C9.81571 18.5543 13.2271 17.9259 15.4715 15.6815C17.267 13.9159 17.8655 11.4621 17.8655 9.03816C17.8655 8.94839 17.9852 8.88854 18.0451 8.82869C18.494 8.46958 18.883 8.05063 19.2122 7.60175C19.302 7.51198 19.272 7.39228 19.272 7.36235C19.3618 7.33243 19.3618 7.33243 19.302 7.36235Z"
                    fill={colorApp}
                />
            </g>
            <defs>
                <clipPath id="clip0_2793_1289">
                    <rect width={`${width}`} height={`${height}`} fill={color} />
                </clipPath>
            </defs>
        </svg>
    );
};

export default TwitterIcon;
