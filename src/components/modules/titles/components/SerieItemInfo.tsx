import { FC, ReactNode } from 'react';

type SerieItemInfoProps = {
  title: string;
  value: string | ReactNode;
};
const SerieItemInfo: FC<SerieItemInfoProps> = ({ title, value }) => (
  <li>
    <div className="font-bold w-[180px] mr-4">{title}:</div>
    <div>{value}</div>
  </li>
);

export default SerieItemInfo;
