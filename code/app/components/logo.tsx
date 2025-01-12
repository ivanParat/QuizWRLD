type LogoProps = {
  theme?: "light" | "dark";
  className?: string;
};

const Logo = ({ theme = "light", className = "" }: LogoProps) => {
  return (
    <p className={`text-xl md:text-2xl ${className}`}>
      {theme === "light" ? (
        <>
          <span className="text-brand font-bold">Quiz</span>
          <span className="font-bold">WRLD</span>
        </>
      ) : (
        <>
          <span className="text-brand-light font-bold">Quiz</span>
          <span className="text-white font-bold">WRLD</span>
        </>
      )}
    </p>
  );
};

export default Logo;