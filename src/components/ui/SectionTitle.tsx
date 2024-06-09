import Link from 'next/link';

import { PlusIcon } from '@heroicons/react/24/outline';
import FancyText from '@/components/ui/FancyText';

const SectionTitle = (
  {
    title,
    subtitle,
    fancyText = null,
    justify = 'justify-start',
    actionLink = '',
    subTitleBackground = 'bg-white',
  },
  props
) => (
  <div className="section-title mt-4 px-4 xl:px-0" {...props}>
    <h2 className="lg:text-4xl md:text-2xl text-xl font-bold">{title}</h2>
    <div className={`mini-header-separator relative ${justify}`}>
      <span className={`mr-2 flex text-orange-400 ${subTitleBackground}`}>
        <span className="mr-4">{subtitle}</span>
        {fancyText ? <FancyText fancyText={fancyText} /> : null}
      </span>
      {actionLink && (
        <span
          className={`flex justify-end w-[165px] h-6 ${subTitleBackground}`}>
          <Link href={actionLink} className="flex text-orange-400">
            <PlusIcon className="w-6 h-6 text-orange-400" />
            Mas Estrenos
          </Link>
        </span>
      )}
    </div>
  </div>
);

export default SectionTitle;
