// Component: Home
import PrizeWheel from '@/components/PrizeWheel';
import EmailList from '@/components/EmailList'

const Home = () => {
  return (
    <div
      id='app-container'
      className='w-screen h-screen grid grid-cols-[1fr,24%]'
    >
      <PrizeWheel />
      <EmailList />
    </div>
  );
};

export default Home;
