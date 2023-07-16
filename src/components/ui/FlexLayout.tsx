import { FC } from 'react';

type LayoutProps = {
  direction?: 'col' | 'row';
  justify?: 'center' | 'start' | 'end' | 'between' | 'around';
  align?: 'center' | 'start' | 'end';
  gap?: number;
  className?: string;
  children: React.ReactNode;
};

const FlexLayout: FC<LayoutProps> = ({
  direction = 'col',
  justify = 'start',
  align = 'start',
  gap = 4,
  className = '',
  children,
}) => {
  return (
    <div
      className={`flex flex-${direction} gap-${gap} justify-${justify} items-${align} ${className}`}>
      {children}
    </div>
  );
};

export default FlexLayout;
