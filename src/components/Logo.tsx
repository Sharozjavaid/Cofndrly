interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-full h-full'
  };

  return (
    <img
      src="/logo.png"
      alt="Cofndrly Logo"
      className={className || sizeClasses[size]}
      style={{ 
        mixBlendMode: 'multiply',
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))'
      }}
    />
  );
};

export default Logo;

