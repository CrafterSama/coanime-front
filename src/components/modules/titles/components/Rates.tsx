import toast from 'react-hot-toast';

import Dropdown from '@/components/ui/Dropdown';
import { DropdownButton } from '@/components/ui/DropdownLink';
import { httpClientExternal } from '@/lib/http';
import { CheckCircleIcon, PlusSmIcon } from '@heroicons/react/outline';

const Rates = ({ serie, rates, userRates, refetch }) => {
  const updateRates = async (serie, rate) => {
    try {
      const response = await httpClientExternal.post(
        `titles/${serie}/${rate}/rates`
      );
      toast.success(response.data.message.text);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message.text);
    }
  };
  return (
    <div className="rates">
      <Dropdown
        align="right"
        width={32}
        trigger={
          <button className="flex items-center text-sm font-medium rounded-lg py-1 px-2 bg-orange-100 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
            {userRates?.id ? (
              <>
                <div className="mr-1">
                  <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                </div>
                <div className="flex flex-row justify-start items-center gap-4 relative">
                  {userRates.rateName}
                </div>
              </>
            ) : (
              <>
                <div className="mr-1">
                  <PlusSmIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-row justify-start items-center gap-4 relative">
                  Rate Options
                </div>
              </>
            )}
          </button>
        }>
        {rates?.map((rate) => (
          <DropdownButton
            key={rate.id}
            onClick={() => updateRates(serie.id, rate.id)}>
            {rate.rateName}
          </DropdownButton>
        ))}
      </Dropdown>
    </div>
  );
};

export default Rates;
