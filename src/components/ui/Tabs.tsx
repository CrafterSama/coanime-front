import cn from 'classnames';

export const Tabs = ({ children, active, onClick }) => (
  <div
    className={cn(
      'inline-block p-1 font-bold text-xl	cursor-pointer border-b-2 ',
      {
        'text-gray-400 border-transparent': !active,
        'text-gray-700 border-orange-500': active,
      }
    )}
    onClick={onClick}>
    {children}
  </div>
);

export const TabsContent = ({ active, children }) => (
  <div>{active && <div className="mt-4">{children}</div>}</div>
);
