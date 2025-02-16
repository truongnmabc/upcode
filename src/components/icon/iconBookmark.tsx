import React from "react";

const IconBookmark = ({ color = "#7C6F5B" }: { color?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.45 17.4C12.1833 17.2 11.8167 17.2 11.55 17.4L8.35 19.8C6.86672 20.9125 4.75 19.8541 4.75 18V5C4.75 3.75736 5.75736 2.75 7 2.75H17C18.2426 2.75 19.25 3.75736 19.25 5V18C19.25 19.8541 17.1333 20.9125 15.65 19.8L12.45 17.4Z"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 7C8 6.44772 8.44772 6 9 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H9C8.44772 8 8 7.55228 8 7Z"
        fill={color}
      />
    </svg>
  );
};

export default IconBookmark;
