import { Logotype } from '@/components/ui/ApplicationLogo';
import { useRandomImageByTitle } from '@/hooks/random-images';

const ANIME_NAME = [
  'kimetsu-no-yaiba',
  'one-piece',
  'shingeki-no-kyojin',
  'naruto',
  'bleach',
  'boku-no-hero-academia',
  'one-punch-man',
  'dragon-ball-super',
];

const AuthCard = ({ logo, children }) => {
  const { data, isLoading } = useRandomImageByTitle(
    ANIME_NAME[Math.floor(Math.random() * ANIME_NAME.length)]
  );

  const image = isLoading ? '' : data?.url;

  const bgStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="min-h-screen flex flex-row sm:justify-center items-center pt-6 sm:pt-0 bg-white relative">
      <div
        className="image-side hidden lg:flex w-1/2 min-h-screen relative"
        style={bgStyle}>
        <div className="absolute inset-0 flex flex-col w-full h-full items-end justify-end bg-indigo-600 bg-opacity-50">
          <Logotype
            logoColor="#ffffff"
            lettersColor="#ffffff"
            className="text-white text-center opacity-70 fill-white h-20 mr-32 mb-2"
          />
        </div>
      </div>
      <div className="form-side flex flex-col w-full lg:w-1/2 min-h-screen justify-center content-center">
        <div className="flex flex-col gap-4 m-auto min-w-[340px] md:min-w-[400px]">
          <div className="w-20 h-20 rounded-full self-center">{logo}</div>
          <div className="px-4 pt-16 pb-8 w-full md:min-w-[480px] bg-white shadow-md overflow-hidden rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
