import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaReact,
  FaTwitter,
} from 'react-icons/fa';

import Link from 'next/link';

import Section from '@/components/ui/Section';
import { format } from 'date-fns';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="flex">
        <Section withContainer>
          <div className="py-4 px-4 sm:px-0">
            <div className="flex flex-row gap-4 items-center justify-start py-4">
              <h4 className="text-base font-bold text-white">Síguenos</h4>
              <Link href="https://www.facebook.com/Coanime/">
                <a
                  target="_blank"
                  className="text-white hover:text-orange-200 transition-all"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
              </Link>
              <Link href="https://twitter.com/coanime">
                <a
                  target="_blank"
                  className="text-white hover:text-orange-200 transition-all"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
              </Link>
              <Link href="https://www.instagram.com/coanimenet">
                <a
                  target="_blank"
                  className="text-white hover:text-orange-200 transition-all"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              </Link>
            </div>
            <div className="flex flex-row gap-4 items-center justify-start py-4">
              <p className="text-white">
                &copy; 2007 - {format(new Date(), 'yyyy')} Coanime. Algunos
                derechos reservados. Los derechos de la mayoría de las imágenes
                aca publicadas son de sus respectivos autores, no de Coanime.
              </p>
            </div>
            {/*<div className="flex flex-row gap-4 items-center justify-start py-4">
              <p className="text-center flex flex-row gap-2 text-white">
                Made with the <FaHeart className="w-6 h-6 fill-red-500" /> for
                you with
                <FaReact className="w-6 h-6 fill-blue-300" />
              </p>
            </div>*/}
          </div>
        </Section>
      </div>
    </footer>
  );
};

export default Footer;
