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
        <div className={`relative w-[400px] h-[265px]`}>
          <img src="/images/saitama.gif" alt="Loading" />
        </div>
      )}
      {showText && <span className="text-xs">Cargando</span>}
    </div>
  );
};

export default Loading;
