import Image from 'next/image';

import { SpinerIcon } from '@/components/icons';

const Loading = ({ size = 40, showText = false, showFancySpiner = true }) => {
  return (
    <div className="flex flex-col justify-center content-center">
      {!showFancySpiner && (
        <SpinerIcon
          className={`animate-spin w-[${size}px] h-[${size}px] text-orange-500`}
        />
      )}
      {showFancySpiner && (
        <div className={`relative`}>
          <Image
            src="/images/saitama.gif"
            alt="Loading"
            width={'280%'}
            height={'280%'}
            objectFit="cover"
          />
        </div>
      )}
      {showText && <span className="text-xs">Cargando</span>}
    </div>
  );
};

export default Loading;
