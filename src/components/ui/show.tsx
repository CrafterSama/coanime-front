import { FC, Fragment } from 'react';

type ShowProps = {
  when?: boolean;
  children: React.ReactNode | any;
};

type ShowAdvancedProps = {
  when?: boolean;
  whenIsTrue: React.ReactNode | any;
  whenIsFalse?: React.ReactNode | any;
};

export const Show: FC<ShowProps> = ({ when, children }) => {
  if (when) {
    return <Fragment>{children}</Fragment>;
  }
  return null;
};

export const ShowAdvanced: FC<ShowAdvancedProps> = ({
  when,
  whenIsTrue,
  whenIsFalse = null,
}) => {
  if (when) {
    return <Fragment>{whenIsTrue}</Fragment>;
  } else {
    return whenIsFalse ? <Fragment>{whenIsFalse}</Fragment> : null;
  }
};
