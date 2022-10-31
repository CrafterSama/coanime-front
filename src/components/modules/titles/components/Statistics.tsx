import toast from 'react-hot-toast';

import Dropdown from '@/components/ui/Dropdown';
import { DropdownButton } from '@/components/ui/DropdownLink';
import { httpClientExternal } from '@/lib/http';
import { CheckCircleIcon, PlusSmIcon } from '@heroicons/react/outline';

const Statistics = ({ serie, statistics, userStatistics, refetch }) => {
  const updateStatistics = async (serie, statistics) => {
    try {
      const response = await httpClientExternal.post(
        `titles/${serie}/${statistics}/stats`
      );
      toast.success(response.data.message.text);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message.text);
    }
  };
  return (
    <div className="statistics">
      <Dropdown
        align="right"
        width={40}
        trigger={
          <button className="flex items-center text-sm font-medium rounded-lg py-1 px-2 bg-orange-100 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
            {userStatistics?.id ? (
              <>
                <div className="mr-1">
                  <CheckCircleIcon className="w-4 h-4 text-lime-500" />
                </div>
                <div className="flex flex-row justify-start items-center gap-4 relative">
                  {userStatistics?.name}
                </div>
              </>
            ) : (
              <>
                <div className="mr-1">
                  <PlusSmIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-row justify-start items-center gap-4 relative">
                  Watch Options
                </div>
              </>
            )}
          </button>
        }>
        {statistics?.map((stats) => (
          <DropdownButton
            key={stats.id}
            onClick={() => updateStatistics(serie.id, stats.id)}>
            {stats.name}
          </DropdownButton>
        ))}
      </Dropdown>
    </div>
  );
};

export default Statistics;
