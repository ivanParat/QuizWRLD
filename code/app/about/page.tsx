import Image from "next/image";
import { getAboutUs } from "../lib/api";

export default async function AboutUsPage() {
  const aboutUs = await getAboutUs();
  if (!aboutUs) return <p>Failed to load About Us content.</p>;
  return (
    <div>
      <div className="flex flex-col sm:gap-8 lg:gap-16 sm:mt-10 items-center lg:items-start mb-20 px-2 lg:flex-row lg:min-w-80 lg:place-content-around lg:min-h-80 lg:max-h-96  ">
        <div className="flex flex-col mb-4 max-w-[550px]">
          <h1 className="font-bold text-3xl text-center mb-6">
            {aboutUs.title1}
          </h1>
          <p>{aboutUs.description1}</p>
        </div>
        <div className="flex items-center max-w-[550px]">
          {aboutUs.image1 && (
            <Image
              className=""
              src={aboutUs.image1}
              alt={aboutUs.title1}
              width={600}
              height={400}
              layout="intrinsic"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:gap-8 lg:gap-16 sm:mt-10 items-center lg:items-start  px-2 mb-14 lg:flex-row-reverse lg:min-w-80 lg:place-content-around lg:min-h-80 lg:max-h-96  ">
        <div className="flex flex-col mb-4 max-w-[550px]">
          <h1 className="font-bold text-3xl text-center mb-6">
            {aboutUs.title2}
          </h1>
          <p>{aboutUs.description2}</p>
        </div>
        <div className="flex items-center max-w-[550px]">
          {aboutUs.image2 && (
            <Image
              className=""
              src={aboutUs.image2}
              alt={aboutUs.title2}
              width={600}
              height={400}
              layout="intrinsic"
            />
          )}
        </div>
      </div>
    </div>
  );
}
