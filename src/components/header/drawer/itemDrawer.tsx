const ItemDrawerFullTest = ({
  name,
  handleClick,
}: {
  handleClick: () => void;
  name: string;
}) => {
  return (
    <div className="p-3 ">
      <div
        onClick={() => {
          handleClick();
        }}
        className="cursor-pointer font-poppins text-lg font-semibold"
      >
        {name}
      </div>
    </div>
  );
};

export default ItemDrawerFullTest;
