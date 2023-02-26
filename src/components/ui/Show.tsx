import { FC, Fragment } from 'react';

type ShowProps = {
  condition?: boolean;
  children: React.ReactNode | any;
};

export const Show: FC<ShowProps> = ({ condition, children }) => {
  if (condition) {
    return <Fragment>{children}</Fragment>;
  }
  return null;
};
