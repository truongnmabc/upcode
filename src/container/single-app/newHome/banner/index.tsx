import { IAppInfo } from "@/models/AppInfo";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BannerHome = ({ appInfo, _state }: { appInfo: IAppInfo; _state: string }) => {
    const list = [
        {
            icon: <IconWifi />,
            name: "No Internet Required",
        },
        {
            icon: <IconFeedback />,
            name: "Instant Feedback",
        },
        {
            icon: <IconFriendly />,
            name: "User-friendly",
        },
        {
            icon: <IconUni />,
            name: "1400+ Unique Questions",
        },
        {
            icon: <IconReg />,
            name: "No registration required",
        },
        {
            icon: <IconState />,
            name: "State-specific questions",
        },
    ];
    const isDesktop = useMediaQuery("(min-width:769px)");

    return (
        <div className="v4-container-component v4-container-maxWidth">
            <h3 className="text-center sm:leading-[60px] text-2xl sm:mt-12 mt-6 font-semibold px-4 sm:text-[40px]">
                More <span className=" capitalize">{_state}</span> <span className="uppercase">{appInfo?.appShortName}</span>{" "}
                Study Resources
            </h3>

            <h4 className="sm:text-2xl text-lg mt-4 sm:mt-8 font-medium sm:font-semibold text-center sm:text-start">
                Practice for your <span className=" capitalize">{_state}</span>{" "}
                <span className="uppercase">{appInfo?.appShortName}</span> on any device
            </h4>
            <div
                className="flex w-full mt-3 sm:mt-6 rounded-2xl sm:flex-row flex-col"
                style={{
                    background: "linear-gradient(90deg, #DBEBFD 0%, #E2DFFF 100%)",
                }}
            >
                <div className="flex-1 p-4 sm:p-6">
                    <p className="text-[#343F82] sm:leading-[68px] font-semibold text-2xl text-center sm:text-start sm:text-[38px]">
                        Download our app
                    </p>
                    <p className=" font-normal sm:text-xl text-center sm:text-start text-smh ">
                        to practice anytime, anywhere!
                    </p>

                    <div
                        className="grid sm:max-w-[800px] rounded-lg sm:mt-6 mt-4 sm:w-full w-fit p-2 sm:p-0 grid-cols-1 gap-4 sm:grid-cols-3"
                        style={{
                            background: isDesktop
                                ? "transparent"
                                : "linear-gradient(151.29deg, rgba(255, 255, 255, 0.56) 5.17%, rgba(255, 255, 255, 0) 50.54%, rgba(255, 255, 255, 0.13) 67.35%, rgba(255, 255, 255, 0) 91.02%)",
                        }}
                    >
                        {list?.map((item) => (
                            <div key={item.name} className="flex gap-2 w-full  items-center">
                                <div className="w-6 h-6">{item.icon}</div>
                                <span className="text-xs whitespace-nowrap flex-1 sm:text-base font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="hidden sm:flex gap-6 mt-8 items-center ">
                        <Link href={appInfo.linkIos} passHref>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" cursor-pointer hover:scale-105 transition-all"
                            >
                                <Image src={"/images/download_ios.webp"} width={180} height={56} />
                            </a>
                        </Link>
                        <Link href={appInfo.linkAndroid} passHref>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" cursor-pointer hover:scale-105 transition-all"
                            >
                                <Image src={"/images/download_android.webp"} width={180} height={56} />
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="sm:h-[325px] hidden sm:block sm:w-[440px] relative">
                    <div className=" absolute right-0 h-full bottom-0">
                        <Image width={441} height={325} src={"/images/cdl_v2/home/banner.png"} />
                    </div>
                    <div className=" absolute h-full right-0 bottom-0">
                        <Image width={118} height={325} src={"/images/cdl_v2/home/banner_1.png"} />
                    </div>
                </div>
                <div className="w-full flex justify-end  sm:hidden">
                    <Image width={280} height={180} src={"/images/cdl_v2/home/banner.png"} />
                </div>
            </div>
        </div>
    );
};

export default BannerHome;

const IconWifi = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.3533 19.0486C14.3533 20.4024 13.2995 21.5 11.9997 21.5C10.6999 21.5 9.64609 20.4024 9.64609 19.0486C9.64609 17.6949 10.6999 16.5972 11.9997 16.5972C13.2995 16.5972 14.3533 17.6949 14.3533 19.0486ZM20.0709 7.69385C20.8717 8.28341 21.5172 8.87787 21.9955 9.3663C22.4574 9.83881 23.197 9.83758 23.6548 9.36079C24.1161 8.88032 24.1155 8.09894 23.6501 7.62215C23.1088 7.06753 22.3915 6.40749 21.5071 5.74869C18.6528 3.62334 15.3648 2.5 12.0003 2.5C8.6358 2.5 5.34779 3.62334 2.49344 5.74869C1.60907 6.40749 0.891804 7.06753 0.349883 7.62215C-0.115545 8.09833 -0.116133 8.8797 0.345176 9.36017C0.801778 9.83574 1.54081 9.83942 2.00153 9.36814C3.58611 7.74717 7.03887 4.95138 12.0003 4.95138C14.8847 4.95138 17.6001 5.87371 20.0714 7.69324L20.0709 7.69385ZM16.0744 10.6104L17.3424 8.52855C15.8314 7.72572 14.0332 7.14045 11.9997 7.14045C8.25863 7.14045 5.3119 9.11994 3.4902 10.793C2.98005 11.2612 2.9571 12.0806 3.43783 12.5813C3.87619 13.0379 4.58169 13.0654 5.04712 12.6377C5.27306 12.4299 5.51902 12.2173 5.78439 12.0046C7.78438 10.4032 9.87557 9.59122 12.0003 9.59122C13.3777 9.59122 14.7411 9.93318 16.075 10.6092L16.0744 10.6104ZM13.7149 14.6337C13.7602 14.4627 13.8302 14.2936 13.9291 14.1312L14.9205 12.5041C14.075 12.1027 13.0941 11.8238 11.9997 11.8238C9.62196 11.8238 7.78026 13.1371 6.69877 14.1716C6.20569 14.6435 6.1898 15.4482 6.66346 15.9415C7.11065 16.4073 7.82968 16.4195 8.2957 15.974C9.07533 15.2294 10.3887 14.2752 11.9997 14.2752C12.6199 14.2752 13.1965 14.4174 13.7149 14.6337ZM23.6242 14.4596L20.0191 8.5408C19.799 8.17922 19.4366 7.97147 19.0253 7.97147C18.614 7.97147 18.2521 8.17861 18.0314 8.5408L14.4263 14.4596C14.1927 14.8427 14.1786 15.3091 14.3886 15.7068C14.5987 16.1045 14.9841 16.3417 15.4201 16.3417H22.6304C23.0664 16.3417 23.4518 16.1045 23.6619 15.7068C23.8719 15.3091 23.8578 14.8427 23.6242 14.4596ZM20.6899 14.2494C20.9199 14.4891 20.9199 14.877 20.6899 15.116C20.4598 15.3556 20.0873 15.3556 19.8578 15.116L19.0258 14.2494L18.1938 15.116C17.9638 15.3556 17.5913 15.3556 17.3618 15.116C17.1318 14.8764 17.1318 14.4885 17.3618 14.2494L18.1938 13.3829L17.3618 12.5163C17.1318 12.2767 17.1318 11.8888 17.3618 11.6498C17.5919 11.4101 17.9644 11.4101 18.1938 11.6498L19.0258 12.5163L19.8578 11.6498C20.0879 11.4101 20.4604 11.4101 20.6899 11.6498C20.9199 11.8894 20.9199 12.2773 20.6899 12.5163L19.8578 13.3829L20.6899 14.2494Z"
                fill="#212121"
            />
        </svg>
    );
};

const IconFeedback = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.6875 13.2109C6.6875 13.539 6.42973 13.7969 6.10156 13.7969C5.7734 13.7969 5.51562 13.539 5.51562 13.2109C5.51562 12.8828 5.7734 12.625 6.10156 12.625C6.42973 12.625 6.6875 12.8828 6.6875 13.2109Z"
                fill="#212121"
            />
            <path
                d="M10.7891 12.625C10.4609 12.625 10.2031 12.8828 10.2031 13.2109C10.2031 13.539 10.4609 13.7969 10.7891 13.7969C11.1172 13.7969 11.375 13.539 11.375 13.2109C11.375 12.8828 11.1172 12.625 10.7891 12.625ZM15.4766 12.625C15.1484 12.625 14.8906 12.8828 14.8906 13.2109C14.8906 13.539 15.1484 13.7969 15.4766 13.7969C15.8047 13.7969 16.0625 13.539 16.0625 13.2109C16.0625 12.8828 15.8047 12.625 15.4766 12.625ZM15.4766 12.625C15.1484 12.625 14.8906 12.8828 14.8906 13.2109C14.8906 13.539 15.1484 13.7969 15.4766 13.7969C15.8047 13.7969 16.0625 13.539 16.0625 13.2109C16.0625 12.8828 15.8047 12.625 15.4766 12.625ZM10.7891 12.625C10.4609 12.625 10.2031 12.8828 10.2031 13.2109C10.2031 13.539 10.4609 13.7969 10.7891 13.7969C11.1172 13.7969 11.375 13.539 11.375 13.2109C11.375 12.8828 11.1172 12.625 10.7891 12.625ZM6.10156 14.9687C5.12887 14.9687 4.34375 14.1836 4.34375 13.2109C4.34375 12.2382 5.12887 11.4531 6.10156 11.4531C7.07426 11.4531 7.85937 12.2382 7.85937 13.2109C7.85937 14.1836 7.07426 14.9687 6.10156 14.9687ZM10.7891 14.9687C9.81637 14.9687 9.03125 14.1836 9.03125 13.2109C9.03125 12.2382 9.81637 11.4531 10.7891 11.4531C11.7618 11.4531 12.5469 12.2382 12.5469 13.2109C12.5469 14.1836 11.7618 14.9687 10.7891 14.9687ZM15.4766 14.9687C14.5039 14.9687 13.7187 14.1836 13.7187 13.2109C13.7187 12.2382 14.5039 11.4531 15.4766 11.4531C16.4493 11.4531 17.2344 12.2382 17.2344 13.2109C17.2344 14.1836 16.4493 14.9687 15.4766 14.9687ZM15.4766 12.625C15.1484 12.625 14.8906 12.8828 14.8906 13.2109C14.8906 13.539 15.1484 13.7969 15.4766 13.7969C15.8047 13.7969 16.0625 13.539 16.0625 13.2109C16.0625 12.8828 15.8047 12.625 15.4766 12.625ZM10.7891 12.625C10.4609 12.625 10.2031 12.8828 10.2031 13.2109C10.2031 13.539 10.4609 13.7969 10.7891 13.7969C11.1172 13.7969 11.375 13.539 11.375 13.2109C11.375 12.8828 11.1172 12.625 10.7891 12.625ZM10.7891 12.625C10.4609 12.625 10.2031 12.8828 10.2031 13.2109C10.2031 13.539 10.4609 13.7969 10.7891 13.7969C11.1172 13.7969 11.375 13.539 11.375 13.2109C11.375 12.8828 11.1172 12.625 10.7891 12.625ZM10.7891 12.625C10.4609 12.625 10.2031 12.8828 10.2031 13.2109C10.2031 13.539 10.4609 13.7969 10.7891 13.7969C11.1172 13.7969 11.375 13.539 11.375 13.2109C11.375 12.8828 11.1172 12.625 10.7891 12.625ZM17.8984 11.375C15.2156 11.375 12.9941 9.36133 12.6668 6.76562H3.75781C2.78516 6.76562 2 7.55078 2 8.52344V17.8984C2 18.8711 2.78516 19.6562 3.75781 19.6562H5.51562V21.4141C5.51562 21.625 5.63281 21.8242 5.82031 21.9297C6.03301 22.036 6.23117 22.0165 6.42969 21.9062L9.79297 19.6562H17.8203C18.793 19.6562 19.5781 18.8711 19.5781 17.8984V11.1008C19.0504 11.2785 18.4855 11.375 17.8984 11.375Z"
                fill="#212121"
            />
            <path
                d="M17.8984 2C15.6367 2 13.7969 3.83984 13.7969 6.10156C13.7969 8.36328 15.6367 10.2031 17.8984 10.2031C20.1602 10.2031 22 8.36328 22 6.10156C22 3.83984 20.1602 2 17.8984 2ZM19.4804 5.92574L17.7226 7.68355C17.6172 7.80078 17.4648 7.85937 17.3125 7.85937C17.1602 7.85937 17.0078 7.80078 16.9024 7.68355L16.3164 7.09762C16.0821 6.87496 16.0821 6.49996 16.3164 6.2773C16.5391 6.04297 16.914 6.04297 17.1367 6.2773L17.3125 6.44137L18.6602 5.10543C18.8829 4.87109 19.2578 4.87109 19.4805 5.10543C19.7148 5.32809 19.7148 5.70309 19.4804 5.92574Z"
                fill="#212121"
            />
        </svg>
    );
};

const IconFriendly = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.0763 14.3047C16.5621 14.3047 17.8046 13.246 18.0906 11.8438H12.062C12.348 13.246 13.5905 14.3047 15.0763 14.3047Z"
                fill="#212121"
            />
            <path
                d="M15.0762 4.46094C11.2833 4.46094 8.30859 7.55323 8.30859 11.2285C8.30859 13.0171 9.03679 14.7325 10.3237 16.0134L9.64181 17.0408C9.51622 17.2295 9.50481 17.4722 9.61236 17.6717C9.71929 17.8717 9.92777 17.9961 10.1543 17.9961H15.0762C18.8078 17.9961 21.8438 14.9602 21.8438 11.2285C21.8438 7.49687 18.8078 4.46094 15.0762 4.46094ZM16.3066 8.15234H17.5371C17.8772 8.15234 18.1523 8.42752 18.1523 8.76758C18.1523 9.10764 17.8772 9.38281 17.5371 9.38281H16.3066C15.9666 9.38281 15.6914 9.10764 15.6914 8.76758C15.6914 8.42752 15.9666 8.15234 16.3066 8.15234ZM12.6152 8.15234H13.8457C14.1858 8.15234 14.4609 8.42752 14.4609 8.76758C14.4609 9.10764 14.1858 9.38281 13.8457 9.38281H12.6152C12.2752 9.38281 12 9.10764 12 8.76758C12 8.42752 12.2752 8.15234 12.6152 8.15234ZM15.0762 15.5352C12.7017 15.5352 10.7695 13.603 10.7695 11.2285C10.7695 10.8885 11.0447 10.6133 11.3848 10.6133H18.7676C19.1076 10.6133 19.3828 10.8885 19.3828 11.2285C19.3828 13.603 17.4506 15.5352 15.0762 15.5352Z"
                fill="#212121"
            />
            <path
                d="M10.1543 19.2266C9.47176 19.2266 8.84873 18.8529 8.52729 18.2515C8.20523 17.6542 8.23891 16.9278 8.6174 16.3589L8.77601 16.1204C7.67474 14.7162 7.07812 13.0123 7.07812 11.2285C7.07812 7.76905 9.39284 4.37521 13.1893 3.46245C13.0122 2.62824 12.271 2 11.3848 2H4.00195C2.98419 2 2.15625 2.82794 2.15625 3.8457V21.1543C2.15625 22.1721 2.98419 23 4.00195 23H11.3848C12.4025 23 13.2305 22.1721 13.2305 21.1543V19.2266H10.1543ZM6.46289 5.07617C6.46289 4.73611 6.73806 4.46094 7.07812 4.46094H8.30859C8.64865 4.46094 8.92383 4.73611 8.92383 5.07617C8.92383 5.41623 8.64865 5.69141 8.30859 5.69141H7.07812C6.73806 5.69141 6.46289 5.41623 6.46289 5.07617ZM7.69336 20.457C7.35359 20.457 7.07812 20.1816 7.07812 19.8418C7.07812 19.5019 7.35359 19.2266 7.69336 19.2266C8.03313 19.2266 8.30859 19.5019 8.30859 19.8418C8.30859 20.1816 8.03313 20.457 7.69336 20.457Z"
                fill="#212121"
            />
        </svg>
    );
};

const IconUni = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_3113_6561)">
                <path
                    d="M13.6795 7.49086C12.3063 6.42687 10.2114 6.92308 9.39129 8.45466C9.30693 8.59303 9.32568 8.70277 9.45222 8.80296C9.75216 9.03676 10.0474 9.26578 10.3474 9.49957C10.488 9.60931 10.6051 9.59499 10.7176 9.45663C10.9144 9.22761 11.0925 8.96519 11.3409 8.78865C11.6877 8.55963 12.2314 8.58348 12.5688 8.83159C12.8828 9.06061 12.9109 9.4948 12.6157 9.75245C12.3017 10.0149 11.8939 10.1341 11.5987 10.4252C11.1769 10.8021 10.9379 11.2554 10.9988 11.8423C11.0222 11.9806 11.0597 12.1858 11.2378 12.1715H11.8892H12.5407C12.9672 12.1381 12.6391 11.7182 13.164 11.2697C13.5342 10.9787 14.0076 10.8021 14.2888 10.4013C15.0058 9.47094 14.5981 8.10159 13.6795 7.49086Z"
                    fill="#212121"
                />
                <path
                    d="M21.2162 2H2.77914C1.24194 2 0 3.26916 0 4.82937V16.4999C0 18.0601 1.24194 19.3245 2.77914 19.3245H8.77329L10.976 21.567C11.5431 22.1443 12.4616 22.1443 13.0287 21.567L15.2314 19.3245H21.2209C22.7534 19.3245 24 18.0601 24 16.4999V4.82937C23.9953 3.26916 22.7534 2 21.2162 2ZM11.9977 16.1612C9.02168 16.1612 6.60808 13.7039 6.60808 10.6742C6.60808 7.64442 9.02168 5.18721 11.9977 5.18721C14.9736 5.18721 17.3872 7.64442 17.3872 10.6742C17.3872 13.7039 14.9736 16.1612 11.9977 16.1612Z"
                    fill="#212121"
                />
                <path
                    d="M11.9368 12.5499C10.6855 12.5403 11.051 12.4067 10.9995 14.1721C10.9901 14.3057 11.0885 14.4155 11.2197 14.425H11.2525H12.5741C12.7476 14.425 12.8413 14.3296 12.8413 14.153C12.785 12.4163 13.1365 12.5356 11.9368 12.5499Z"
                    fill="#212121"
                />
            </g>
            <defs>
                <clipPath id="clip0_3113_6561">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

const IconReg = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_3113_6577)">
                <path
                    d="M5.14357 20.3054C4.6372 20.3054 4.22053 19.8887 4.22053 19.3823V5.66868C4.22053 5.20453 4.56338 4.82474 5.0117 4.76145V3.55889C5.0117 3.42702 5.02754 3.30044 5.04863 3.17383C3.71417 3.22131 2.63818 4.31841 2.63818 5.66868V19.3823C2.63818 20.7643 3.76165 21.8877 5.14357 21.8877H11.9582C11.6997 21.3972 11.5152 20.8645 11.4202 20.3054H5.14357Z"
                    fill="#212121"
                />
                <path
                    d="M15.824 4.76145C16.2724 4.82475 16.6152 5.20453 16.6152 5.66868V13.976H16.7471C17.2482 13.976 17.7334 14.0446 18.1976 14.1764V5.66868C18.1976 4.31841 17.1216 3.22131 15.7871 3.17383C15.8082 3.30044 15.824 3.42702 15.824 3.55889V4.76145Z"
                    fill="#212121"
                />
                <path
                    d="M5.01172 19.3828C5.01172 19.4567 5.06973 19.5147 5.14358 19.5147H11.3411V19.3828C11.3411 16.7192 13.2821 14.4934 15.8244 14.0556V5.66915C15.8244 5.63223 15.8086 5.60059 15.7822 5.57422C15.5765 6.60272 14.6693 7.38336 13.5828 7.38336H7.25338C6.16683 7.38336 5.2596 6.60272 5.05393 5.57422C5.02756 5.60059 5.01172 5.63223 5.01172 5.66915V19.3828ZM6.72593 8.96571H9.89062C10.1069 8.96571 10.2862 9.14503 10.2862 9.3613C10.2862 9.57753 10.1069 9.75688 9.89062 9.75688H6.72593C6.50969 9.75688 6.33034 9.57753 6.33034 9.3613C6.33034 9.14503 6.50969 8.96571 6.72593 8.96571ZM6.72593 11.0755H14.1102C14.3264 11.0755 14.5058 11.2548 14.5058 11.4711C14.5058 11.6873 14.3264 11.8667 14.1102 11.8667H6.72593C6.50969 11.8667 6.33034 11.6873 6.33034 11.4711C6.33034 11.2548 6.50969 11.0755 6.72593 11.0755ZM6.72593 13.1853H14.1102C14.3264 13.1853 14.5058 13.3646 14.5058 13.5809C14.5058 13.7971 14.3264 13.9765 14.1102 13.9765H6.72593C6.50969 13.9765 6.33034 13.7971 6.33034 13.5809C6.33034 13.3646 6.50969 13.1853 6.72593 13.1853ZM6.72593 15.2951H12.0004C12.2167 15.2951 12.396 15.4744 12.396 15.6907C12.396 15.9069 12.2167 16.0863 12.0004 16.0863H6.72593C6.50969 16.0863 6.33034 15.9069 6.33034 15.6907C6.33034 15.4744 6.50969 15.2951 6.72593 15.2951ZM6.72593 17.4049H9.89062C10.1069 17.4049 10.2862 17.5842 10.2862 17.8005C10.2862 18.0167 10.1069 18.1961 9.89062 18.1961H6.72593C6.50969 18.1961 6.33034 18.0167 6.33034 17.8005C6.33034 17.5842 6.50969 17.4049 6.72593 17.4049Z"
                    fill="#212121"
                />
                <path
                    d="M7.25371 6.59311H13.5831C14.383 6.59311 15.0336 5.94255 15.0336 5.14263V3.56028C15.0336 2.76035 14.383 2.1098 13.5831 2.1098H12.8926C12.7023 0.915567 11.6654 0 10.4184 0C9.17137 0 8.1345 0.915567 7.94418 2.1098H7.25371C6.45378 2.1098 5.80322 2.76035 5.80322 3.56028V5.14263C5.80322 5.94255 6.45378 6.59311 7.25371 6.59311Z"
                    fill="#212121"
                />
                <path
                    d="M16.7475 14.7695C14.2052 14.7695 12.1323 16.8424 12.1323 19.3847C12.1323 21.927 14.2052 23.9999 16.7475 23.9999C19.2898 23.9999 21.3627 21.927 21.3627 19.3847C21.3627 16.8424 19.2898 14.7695 16.7475 14.7695ZM13.4509 19.3847C13.4509 17.565 14.9278 16.0882 16.7475 16.0882C17.3788 16.0882 17.9667 16.2691 18.4681 16.5772L13.94 21.1054C13.6319 20.6039 13.4509 20.016 13.4509 19.3847ZM16.7475 22.6813C16.1162 22.6813 15.5283 22.5003 15.0269 22.1922L19.555 17.6641C19.8631 18.1655 20.0441 18.7534 20.0441 19.3847C20.0441 21.2044 18.5672 22.6813 16.7475 22.6813Z"
                    fill="#212121"
                />
            </g>
            <defs>
                <clipPath id="clip0_3113_6577">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

const IconState = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.5 14.625C14.0876 14.625 12.125 16.5876 12.125 19C12.125 21.4124 14.0876 23.375 16.5 23.375C18.9124 23.375 20.875 21.4124 20.875 19C20.875 16.5876 18.9124 14.625 16.5 14.625ZM16.5 21.375C16.2929 21.375 16.125 21.2071 16.125 21C16.125 20.7929 16.2929 20.625 16.5 20.625C16.7071 20.625 16.875 20.7929 16.875 21C16.875 21.2071 16.7071 21.375 16.5 21.375ZM17.0347 19.2651C16.9375 19.3059 16.875 19.3982 16.875 19.5C16.875 19.707 16.707 19.875 16.5 19.875C16.293 19.875 16.125 19.707 16.125 19.5C16.125 19.0957 16.3677 18.7322 16.7432 18.574C16.9751 18.4761 17.125 18.2502 17.125 17.9988C17.125 17.6548 16.8447 17.375 16.5 17.375C16.1553 17.375 15.875 17.6548 15.875 17.9988C15.875 18.2058 15.707 18.3738 15.5 18.3738C15.293 18.3738 15.125 18.2058 15.125 17.9988C15.125 17.2412 15.7417 16.625 16.5 16.625C17.2583 16.625 17.875 17.2412 17.875 17.9988C17.875 18.5525 17.5449 19.0496 17.0347 19.2651Z"
                fill="#212121"
            />
            <path
                d="M5.5 19.8748C5.01999 19.8748 4.625 19.4798 4.625 18.9998V5.99979C4.625 5.55979 4.95001 5.19977 5.375 5.13977V3.99979C5.375 3.87479 5.39002 3.75479 5.41001 3.63477C4.14499 3.67978 3.125 4.71979 3.125 5.99979V18.9998C3.125 20.3098 4.19 21.3748 5.5 21.3748H11.96C11.715 20.9098 11.54 20.4048 11.45 19.8748H5.5Z"
                fill="#212121"
            />
            <path
                d="M15.6248 5.13977C16.0498 5.19977 16.3748 5.55979 16.3748 5.99979V13.8748H16.4998C16.9749 13.8748 17.4348 13.9398 17.8748 14.0648V5.99979C17.8748 4.71979 16.8549 3.67978 15.5898 3.63477C15.6098 3.75479 15.6248 3.87479 15.6248 3.99979V5.13977Z"
                fill="#212121"
            />
            <path
                d="M5.375 19.0002C5.375 19.0702 5.43 19.1252 5.5 19.1252H11.375V19.0002C11.375 16.4752 13.215 14.3651 15.625 13.9501V6.00015C15.625 5.96515 15.61 5.93515 15.585 5.91016C15.39 6.88513 14.53 7.62515 13.5 7.62515H7.5C6.47 7.62515 5.60998 6.88513 5.41501 5.91016C5.39001 5.93515 5.375 5.96515 5.375 6.00015V19.0002ZM7 9.12515H10C10.205 9.12515 10.375 9.29514 10.375 9.50015C10.375 9.70514 10.205 9.87515 10 9.87515H7C6.79501 9.87515 6.625 9.70514 6.625 9.50015C6.625 9.29514 6.79501 9.12515 7 9.12515ZM7 11.1252H14C14.205 11.1252 14.375 11.2951 14.375 11.5002C14.375 11.7051 14.205 11.8752 14 11.8752H7C6.79501 11.8752 6.625 11.7051 6.625 11.5002C6.625 11.2951 6.79501 11.1252 7 11.1252ZM7 13.1252H14C14.205 13.1252 14.375 13.2951 14.375 13.5002C14.375 13.7051 14.205 13.8752 14 13.8752H7C6.79501 13.8752 6.625 13.7051 6.625 13.5002C6.625 13.2951 6.79501 13.1252 7 13.1252ZM7 15.1252H12C12.205 15.1252 12.375 15.2951 12.375 15.5002C12.375 15.7051 12.205 15.8752 12 15.8752H7C6.79501 15.8752 6.625 15.7051 6.625 15.5002C6.625 15.2951 6.79501 15.1252 7 15.1252ZM7 17.1252H10C10.205 17.1252 10.375 17.2951 10.375 17.5002C10.375 17.7051 10.205 17.8752 10 17.8752H7C6.79501 17.8752 6.625 17.7051 6.625 17.5002C6.625 17.2951 6.79501 17.1252 7 17.1252Z"
                fill="#212121"
            />
            <path
                d="M7.5 6.875H13.5C14.2583 6.875 14.875 6.2583 14.875 5.5V4C14.875 3.2417 14.2583 2.625 13.5 2.625H12.8455C12.665 1.49292 11.6821 0.625 10.5 0.625C9.31787 0.625 8.33496 1.49292 8.15454 2.625H7.5C6.7417 2.625 6.125 3.2417 6.125 4V5.5C6.125 6.2583 6.7417 6.875 7.5 6.875Z"
                fill="#212121"
            />
        </svg>
    );
};
