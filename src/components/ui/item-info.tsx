import { FC, ReactNode } from 'react';

type ItemInfoProps = {
  title: string;
  value: string | ReactNode;
};
const ItemInfo: FC<ItemInfoProps> = ({ title, value }) => (
  <li>
    <div className="font-bold w-[180px] mr-4">{title}:</div>
    <div>{value}</div>
  </li>
);

export default ItemInfo;
