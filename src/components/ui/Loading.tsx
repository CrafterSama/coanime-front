import { SpinerIcon } from '@/components/icons';

const Loading = ({ size = 40, showText = false, showFancySpiner = false }) => {
  return (
    <div className="flex flex-col justify-center content-center">
      {!showFancySpiner && <SpinerIcon className={`animate-spin w-${size} h-${size} text-orange-500`} />}
      {showFancySpiner && <img src="images/saitama.gif" alt="Loading" />}
      {showText && <span className="text-xs">Cargando</span>}
    </div>
  );
};

export default Loading;
