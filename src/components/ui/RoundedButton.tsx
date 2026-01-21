import React from 'react';

export const RoundedButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      className="flex justify-center content-center p-2 rounded-full text-orange-500 border-2 border-orange-500 bg-orange-200 hover:bg-orange-300 transition-all"
      onClick={onClick}>
      {children}
    </button>
  );
};
