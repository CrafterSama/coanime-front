import React from 'react';

import cn from 'classnames';
import Icon from '@/components/ui/Icon';

export interface AlertProps {
  variant?: 'positive' | 'negative' | 'caution' | 'info';
  message: string;
}

const intentStyle = {
  positive: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: <Icon icon="check_circle" className="text-green-400" />,
  },
  negative: {
    bg: 'bg-negative-50',
    text: 'text-negative-800',
    icon: <Icon icon="cancel" className="text-negative-400" />,
  },
  caution: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    iconColor: 'text-yellow-400',
    icon: <Icon icon="warning" className="text-caution-400" />,
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    icon: <Icon icon="info" className="text-blue-400" />,
  },
};

export const Alert = ({ message, variant = 'positive' }: AlertProps) => {
  const { bg, text, icon } = intentStyle[variant];

  const alertBoxStyles = cn(
    'p-4 rounded-none text-sm font-medium flex flex-row gap-3 items-center justify-start',
    bg,
    text
  );

  return (
    <div className={alertBoxStyles}>
      {icon}
      <span className="flex-1">{message}</span>
    </div>
  );
};
