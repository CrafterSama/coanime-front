import { MaterialSymbol } from 'react-material-symbols';
import { type SymbolCodepoints } from 'react-material-symbols/dist/types';

type Icons = SymbolCodepoints;

type Sizes = 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48;

interface IconProps {
  icon: Icons;
  size?: Sizes;
  className?: string;
}

const Icon = ({ icon, size = 24, className = '' }: IconProps) => {
  return <MaterialSymbol icon={icon} size={size} className={className} />;
};

export default Icon;
