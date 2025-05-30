import Image from "next/image";
import { getAboutUs } from "../lib/api";

export default async function AboutUsPage() {
  const aboutUs = await getAboutUs();
  if (!aboutUs) return 
  <div className="flex justify-center items-center min-h-screen bg-off-white">
    <p className="text-xl text-main-text flex items-center">Failed to load About Us content.</p>
  </div>;
  
  return (
    <main>
      <div className="flex flex-col sm:gap-8 lg:gap-16 pt-10 items-center lg:items-start pb-10 px-4 lg:flex-row lg:min-w-80 lg:place-content-around lg:min-h-80  bg-off-white">
        <div className="flex flex-col mb-4 max-w-[550px]">
          <h1 className="font-bold text-3xl text-center mb-6">
            {aboutUs.title1}
          </h1>
          <p className="font-medium text-main-text">{aboutUs.description1}</p>
        </div>
        <div className="flex items-center max-w-[550px]">
          {aboutUs.image1 && (
            <Image
              className="rounded-md"
              src={aboutUs.image1}
              alt={aboutUs.title1}
              width={600}
              height={400}
              layout="intrinsic"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:gap-8 lg:gap-16 pt-10 items-center lg:items-start pb-10 px-4 lg:flex-row-reverse lg:min-w-80 lg:place-content-around lg:min-h-80 ">
        <div className="flex flex-col mb-4 max-w-[550px]">
          <h1 className="font-bold text-3xl text-center mb-6">
            {aboutUs.title2}
          </h1>
          <p className="font-medium text-main-text">{aboutUs.description2}</p>
        </div>
        <div className="flex items-center max-w-[550px]">
          {aboutUs.image2 && (
            <Image
              className="rounded-md"
              src={aboutUs.image2}
              alt={aboutUs.title2}
              width={600}
              height={400}
              layout="intrinsic"
            />
          )}
        </div>
      </div>
    </main>
  );
}
