import Image from 'next/image';

import { CgSpinner } from 'react-icons/cg';

const Loading = ({ size = 40, showText = false, showFancySpiner = true }) => {
  return (
    <div className="flex flex-col justify-center content-center">
      {!showFancySpiner && (
        <CgSpinner
          className={`animate-spin w-[${size}px] h-[${size}px] text-orange-500`}
        />
      )}
      {showFancySpiner && (
        <div className={`relative w-[100%] h-auto`}>
          <Image
            src="/images/saitama.gif"
            alt="Loading"
            width={200}
            height={200}
            unoptimized
          />
        </div>
      )}
      {showText && <span className="text-xs">Cargando</span>}
    </div>
  );
};

export default Loading;
