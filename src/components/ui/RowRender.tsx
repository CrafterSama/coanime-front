import { FC, Fragment } from 'react';

type RowRenderProps = {
  data?: any[];
  columns?: any[];
  component: React.ReactNode | any;
};

export const RowRender: FC<RowRenderProps> = ({
  data = [],
  columns = [],
  component: Component,
}) => {
  return (
    <Fragment>
      {data?.length >= 1 ? (
        data?.map((item, index) => (
          <Component key={item.id || index} columns={columns} row={item} />
        ))
      ) : data?.length === 0 ? (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          No Results
        </div>
      ) : null}
    </Fragment>
  );
};
