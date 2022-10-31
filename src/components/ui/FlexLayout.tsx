import { FC } from 'react';

type LayoutProps = {
  direction?: 'col' | 'row';
  justify?: 'center' | 'start' | 'end';
  gap?: number;
  className?: string;
  children: React.ReactNode;
};

const FlexLayout: FC<LayoutProps> = ({
  direction = 'col',
  justify = 'start',
  gap = 4,
  className = '',
  children,
}) => {
  return (
    <div
      className={`flex flex-${direction} gap-${gap} justify-${justify} ${className}`}>
      {children}
    </div>
  );
};

export default FlexLayout;
