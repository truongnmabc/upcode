export type IWebDataProps = {
    appId: number;
    type: string;
    slug: string; // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
    content: any;
    isBranch: any;
    title: string;
};
