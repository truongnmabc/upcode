const InstagramIcon = ({ color = "#212121", width = 24, height = 24 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.50075 11.7445C8.50075 9.95069 9.95543 8.4961 11.7504 8.4961C13.5453 8.4961 15.0007 9.95069 15.0007 11.7445C15.0007 13.5384 13.5453 14.993 11.7504 14.993C9.95543 14.993 8.50075 13.5384 8.50075 11.7445ZM6.74365 11.7445C6.74365 14.5081 8.98515 16.7482 11.7504 16.7482C14.5156 16.7482 16.7571 14.5081 16.7571 11.7445C16.7571 8.98099 14.5156 6.74084 11.7504 6.74084C8.98515 6.74084 6.74365 8.98099 6.74365 11.7445ZM15.7852 6.54244C15.7851 6.77371 15.8537 6.99982 15.9822 7.19217C16.1106 7.38452 16.2933 7.53447 16.5071 7.62306C16.7208 7.71165 16.9561 7.7349 17.1831 7.68987C17.4101 7.64485 17.6186 7.53356 17.7823 7.37009C17.946 7.20662 18.0575 6.99831 18.1027 6.77149C18.148 6.54468 18.1249 6.30955 18.0364 6.09585C17.948 5.88214 17.7981 5.69946 17.6057 5.57089C17.4133 5.44232 17.1872 5.37365 16.9557 5.37356H16.9553C16.6451 5.37371 16.3476 5.49689 16.1283 5.71605C15.9089 5.93521 15.7855 6.23243 15.7852 6.54244ZM7.8112 19.6764C6.86058 19.6331 6.34389 19.4748 6.00052 19.3412C5.54529 19.164 5.22048 18.9531 4.87899 18.6123C4.53749 18.2714 4.3261 17.9471 4.14966 17.4922C4.0158 17.1492 3.85746 16.6326 3.81424 15.6826C3.76697 14.6554 3.75754 14.3469 3.75754 11.7446C3.75754 9.14236 3.76775 8.83467 3.81424 7.80666C3.85754 6.8566 4.01705 6.34108 4.14966 5.99706C4.32688 5.5421 4.53796 5.21749 4.87899 4.8762C5.22002 4.53491 5.54451 4.32364 6.00052 4.14731C6.34373 4.01353 6.86058 3.85528 7.8112 3.8121C8.83897 3.76485 9.14771 3.75542 11.7504 3.75542C14.353 3.75542 14.6621 3.76563 15.6907 3.8121C16.6413 3.85536 17.1571 4.01478 17.5014 4.14731C17.9566 4.32364 18.2814 4.53537 18.6229 4.8762C18.9644 5.21702 19.175 5.5421 19.3522 5.99706C19.4861 6.34006 19.6444 6.8566 19.6876 7.80666C19.7349 8.83467 19.7444 9.14236 19.7444 11.7446C19.7444 14.3469 19.7349 14.6546 19.6876 15.6826C19.6444 16.6326 19.4852 17.149 19.3522 17.4922C19.175 17.9471 18.9639 18.2717 18.6229 18.6123C18.2819 18.9528 17.9566 19.164 17.5014 19.3412C17.1582 19.4749 16.6413 19.6332 15.6907 19.6764C14.6629 19.7236 14.3542 19.733 11.7504 19.733C9.14654 19.733 8.83866 19.7236 7.8112 19.6764ZM7.73047 2.05901C6.69248 2.10625 5.9832 2.27074 5.36378 2.51163C4.72228 2.76039 4.17922 3.09412 3.63655 3.6356C3.09389 4.17709 2.76081 4.72068 2.5119 5.36179C2.27087 5.98123 2.10629 6.6897 2.05902 7.72706C2.01097 8.76607 1.99997 9.09824 1.99997 11.7445C1.99997 14.3908 2.01097 14.723 2.05902 15.762C2.10629 16.7995 2.27087 17.5079 2.5119 18.1273C2.76081 18.768 3.09396 19.3122 3.63655 19.8535C4.17914 20.3947 4.72228 20.728 5.36378 20.9775C5.98437 21.2183 6.69248 21.3828 7.73047 21.4301C8.77064 21.4773 9.10247 21.4891 11.7504 21.4891C14.3983 21.4891 14.7306 21.4781 15.7703 21.4301C16.8083 21.3828 17.5171 21.2183 18.1369 20.9775C18.7781 20.728 19.3215 20.395 19.8642 19.8535C20.4068 19.312 20.7392 18.768 20.9888 18.1273C21.2298 17.5079 21.3952 16.7994 21.4417 15.762C21.489 14.7222 21.5 14.3908 21.5 11.7445C21.5 9.09824 21.489 8.76607 21.4417 7.72706C21.3944 6.68962 21.2298 5.98084 20.9888 5.36179C20.7392 4.72107 20.406 4.17794 19.8642 3.6356C19.3224 3.09326 18.7781 2.76039 18.1377 2.51163C17.5171 2.27074 16.8082 2.10547 15.771 2.05901C14.7314 2.01177 14.399 2 11.7511 2C9.10325 2 8.77064 2.01099 7.73047 2.05901Z"
                fill={color}
            />
        </svg>
    );
};

export default InstagramIcon;
