import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const Paginator = ({ page, setPage, data }) => {
  const back = () => {
    if (page > 1) {
      setPage(Number(page) - 1);
    }
  };

  const { total, lastPage } = data;

  const next = () => {
    if (page < lastPage) {
      setPage(Number(page) + 1);
    }
  };

  return (
    <div className="flex flex-row justify-around content-center w-full h-11 py-2">
      <button
        disabled={page === 1 || !page}
        className="px-1 py-4 flex justify-center items-center bg-orange-600 text-white rounded hover:shadow-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={back}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <div className="flex justify-center items-center gap-2 px-2">
        <span className="text-orange-400 font-semibold">{`Pagina ${page} de`}</span>
        <span className="text-orange-400 font-semibold">{`${lastPage} ${
          lastPage === 1 ? 'pagina' : 'paginas'
        }`}</span>
      </div>
      <button
        disabled={page === lastPage}
        className="px-1 py-4 flex justify-center items-center bg-orange-600 text-white rounded hover:shadow-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={next}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Paginator;
