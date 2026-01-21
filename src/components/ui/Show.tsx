import { FC, Fragment } from 'react';

type ShowProps = {
  condition?: boolean | string | null | undefined;
  children: React.ReactNode | any;
};

type ShowAdvancedProps = {
  condition?: boolean;
  conditionTrue: React.ReactNode | any;
  conditionFalse?: React.ReactNode | any;
};

export const Show: FC<ShowProps> = ({ condition, children }) => {
  if (condition) {
    return <Fragment>{children}</Fragment>;
  }
  return null;
};

export const ShowAdvanced: FC<ShowAdvancedProps> = ({
  condition,
  conditionTrue,
  conditionFalse = null,
}) => {
  if (condition) {
    return <Fragment>{conditionTrue}</Fragment>;
  } else {
    return conditionFalse ? <Fragment>{conditionFalse}</Fragment> : null;
  }
};
