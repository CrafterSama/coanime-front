type AlertProps = {
  info?: string;
};

const Alert = ({ info }: AlertProps) => {
  if (!info) return null;

  return (
    <div className="p-4 flex flex-row gap-4 rounded-b-lg">
      <div className="w-full">{info}</div>
    </div>
  );
};

export default Alert;
