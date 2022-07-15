type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({ type = 'submit', className, ...props }: ButtonProps) => (
  <button
    type={type}
    className={`${className} inline-flex items-center px-6 py-3 bg-orange-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-400 active:bg-orange-600 focus:outline-none focus:border-orange-600 focus:ring ring-orange-100 disabled:opacity-25 transition ease-in-out duration-150`}
    {...props}
  />
);

export default Button;
