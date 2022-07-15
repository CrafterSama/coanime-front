const Input = ({ disabled = false, className, ...props }) => (
  <input
    disabled={disabled}
    className={`${className} rounded-md shadow-sm border-orange-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:outline-orange-500 focus:ring-opacity-50 p-2`}
    {...props}
  />
);

export default Input;
