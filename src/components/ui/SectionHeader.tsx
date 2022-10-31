import { FC } from 'react';

import Link from 'next/link';

import Errors from '@/components/ui/Errors';
import { ChevronLeftIcon } from '@heroicons/react/outline';

type SectionHeaderProps = {
  backlink: string;
  text: string;
  errors?: any;
  rightElement?: React.ReactElement | string;
};

const SectionHeader: FC<SectionHeaderProps> = ({
  backlink,
  text,
  errors = {},
  rightElement = null,
}) => (
  <div className="flex flex-row gap-4 justify-between items-center">
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <div className="flex justify-center items-center">
          <Link href={backlink} className="bg-gray-200 text-orange-400 rounded">

            <ChevronLeftIcon className="w-6 h-6" />

          </Link>
        </div>
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
          {text}
        </h2>
      </div>
      <Errors errors={Object.values(errors)} />
    </div>
    {rightElement}
  </div>
);

export default SectionHeader;
