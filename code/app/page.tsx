import Image from "next/image";

function HeroSection(){
  return(
    <section className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-20 bg-off-white w-full pt-32 md:pt-20 md:pb-20 space-y-10">
      <div className="flex flex-col px-3 space-y-2 items-center md:items-start">
        <h1 className="text-center md:text-left font-extrabold text-main-text text-[27px] md:text-5xl md:leading-[60px] md:max-w-96">
          Challenge your knowledge!
        </h1>
        <p className="text-center md:text-left font-normal text-[13px] md:text-base text-secondary-text max-w-80">
          Create or solve fun and challenging quizzes instantly. Learn something new, expand your horizons, and explore a world of trivia!
        </p>
        <div className="flex justify-center">
          <button className="font-semibold md:text-lg bg-brand text-white px-8 md:px-10 py-[7px] mt-4 rounded-md hover:bg-brand-hover active:bg-brand-hover">
            Solve Quiz
          </button>
        </div>
      </div>
      <div className="py-10 md:py-0">
        <div className="relative h-52 md:h-96 md:w-96">
          <Image 
            fill
            src="/images/undraw_online_test_re_kyfx.svg"
            alt="Online quiz vector graphic"
          />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection/>
      <div className="h-32 w-full bg-gradient-to-b from-off-white to-white"></div>
    </main>
  );
}