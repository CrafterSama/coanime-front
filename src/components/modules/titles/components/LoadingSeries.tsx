import { fakeArray } from '@/utils/common';
import { CgSpinner } from 'react-icons/cg';

const LoadingSeries = () =>
  fakeArray(30).map((_, index) => (
    <div
      key={index}
      className="title-item bg-slate-200 relative overflow-hidden rounded animate-pulse grid place-content-center">
      <div className="absolute skeleton w-full h-full grid place-content-center text-orange-300">
        <CgSpinner className="w-10 h-10 animate-spin" />
      </div>
    </div>
  ));

export default LoadingSeries;
