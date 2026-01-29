import { FC, ReactNode } from 'react';

type SerieItemInfoProps = {
  title: string;
  value: string | ReactNode;
};
const SerieItemInfo: FC<SerieItemInfoProps> = ({ title, value }) => (
  <li className="flex gap-1 md:gap-0 flex-row justify-start items-center">
    <div className="font-bold min-w-[120px] md:min-w-[180px] md:max-w-[480px]">
      {title}:
    </div>
    <div className="min-w-[120px] max-w-[480px]">{value}</div>
  </li>
);

export default SerieItemInfo;
