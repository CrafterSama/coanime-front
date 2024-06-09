type FancyTextProps = {
  fancyText: string;
};

const FancyText = ({ fancyText }: FancyTextProps) => {
  return (
    <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-orange-400 relative flex justify-center mr-4">
      <span className="relative px-2 text-white">{fancyText}</span>
    </span>
  );
};

export default FancyText;
