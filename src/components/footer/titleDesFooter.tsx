import NextLink from "../nextLink";
export const TitleDesFooter = ({
  title,
  link,
}: {
  title: string;
  link: string;
}) => {
  return (
    <NextLink href={link} scroll>
      <p className=" capitalize text-white cursor-pointer text-sm font-medium ">
        {title}
      </p>
    </NextLink>
  );
};
