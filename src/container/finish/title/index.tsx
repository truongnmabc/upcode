import CloseIcon from "@/asset/icon/CloseIcon";

const TitleFinishPage = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full text-center py-2 relative bg-white rounded-full">
        <div className="top-0 flex items-center justify-center h-full w-12 rounded-full bg-white shadow-close absolute left-0">
          <CloseIcon />
        </div>
        <h1 className="text-2xl font-semibold font-poppins">
          Arithmetic Reasoning
        </h1>
      </div>

      <div>
        <h2 className="text-3xl text-center font-semibold">
          Part 2 Completed!
        </h2>
        <h3 className="text-center pt-4 text-base font-normal">
          Time for a dance break! (Disclaimer: App is not responsible for any
          injuries sustained during spontaneous dance celebrations.)
        </h3>
      </div>
    </div>
  );
};

export default TitleFinishPage;
