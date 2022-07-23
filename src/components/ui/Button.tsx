import cn from 'classnames';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'solid' | 'outline' | 'text';
  className?: string;
  children: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({
  type = 'submit',
  variant = 'outline',
  className,
  ...props
}: ButtonProps) => {
  const classes = cn(
    'font-semibold py-2 px-4 rounded-lg transition-colors border-2',
    {
      'text-white bg-orange-500 border-orange-500': variant === 'solid',
      'text-orange-500 bg-orange-100 border-orange-500 hover:bg-orange-200':
        variant === 'outline',
      'text-orange-500 bg-transparent border-transparent hover:border-orange-500':
        variant === 'text',
    }
  );

  return <button type={type} className={classes} {...props} />;
};

export default Button;
