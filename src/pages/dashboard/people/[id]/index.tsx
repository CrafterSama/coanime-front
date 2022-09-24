import { useRouter } from 'next/router';

const UdatePeople = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Update People</h1>
      <p>id: {id}</p>
    </div>
  );
};

export default UdatePeople;
