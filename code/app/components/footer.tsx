import Logo from "./logo";
import Image from "next/image";
import emailicon from "../assets/emailIcon.svg";
import FacebookIcon from "../assets/FacebookIcon.svg";
import LinkedinIcon from "../assets/LinkedinIcon.svg";
import InstagramIcon from "../assets/InstagramIcon.svg";
import YoutubeIcon from "../assets/YoutubeIcon.svg";
import Link from "next/link";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Discover Quizzes",
    path: "/discover-quizzes",
  },
  {
    title: "My Quizzes",
    path: "/my-quizzes",
  },
  {
    title: "About us",
    path: "/about",
  },
  {
    title: "Sign in",
    path: "/login",
  },
];

const socialIcons = [
  { src: FacebookIcon, alt: "Facebook", href: "https://www.facebook.com" },
  { src: YoutubeIcon, alt: "YouTube", href: "https://www.youtube.com" },
  { src: LinkedinIcon, alt: "LinkedIn", href: "https://www.linkedin.com" },
  { src: InstagramIcon, alt: "Instagram", href: "https://www.instagram.com" },
];

type SocialMediaIcons = {
  src: string;
  alt: string;
  href: string;
};

const SocialLinks = ({ socialIcons }: { socialIcons: SocialMediaIcons[] }) => {
  return (
    <div className="flex gap-3 mt-1">
      {socialIcons.map((icon, index) => (
        <a
          href={icon.href}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={icon.src}
            alt={icon.alt}
            className="md:w-full md:h-full w-10/12 h-10/12"
          />
        </a>
      ))}
    </div>
  );
};

const UsefulLinks = ({ pages }: { pages: Page[] }) => {
  return (
    <ul className="space-y-1">
      {pages.map((page) => (
        <li key={page.title}>
          <Link
            href={page.path}
            className="hover:text-brand-light active:text-brand-light text-[15px] md:text-[17px]"
          >
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Footer = () => {
  return (<>
    <div className="bg-brand-dark text-white w-svw flex flex-col md:flex-row justify-between xl:px-72 lg:px-40 md:px-20 sm:px-20 pt-6 md:pb-0 md:pt-8 md:mt-3 lg:wgap-72 md:wgap-1  px-4 bottom-0">
      <div className="md:block flex flex-col  justify-start item-start">
        <Logo theme="dark" className="mb-2" />
        <div className="text-[14px] md:text-[15px]">
          Don&apos;t have an account yet?
        </div>
        <Link href="/login">
          <button className="bg-brand-light text-brand-dark w-24 rounded-md p-1 font-bold mt-1 hover:bg-brand-hover active:bg-brand-hover">
            Sign in
          </button>
        </Link>
      </div>

      <div className="flex flex-row md:contents justify-between items-start gap-4 mt-8 md:mt-0">
        <div className="md:block flex flex-col justify-start items-start">
          <div className="font-bold text-xl mb-2">Contact Us</div>
          <div className="flex gap-1 justify-center items-center">
            <Image
              src={emailicon}
              alt="Email"
              className="hover:text-brand-light"
            ></Image>
            <a href="mailto:support@quizwrld.com" className="hover:text-brand-light">
              <div className="text-[15px] md:text-[17px]">
                support@quizwrld.com
              </div>
            </a>
          </div>
          <div className="flex gap-3 mt-1">
            <SocialLinks socialIcons={socialIcons}></SocialLinks>
          </div>
        </div>

        <div className="md:block flex flex-col justify-center items-start">
          <div className="font-bold text-xl mb-2 ">Useful Links</div>
          <UsefulLinks pages={pages}></UsefulLinks>
        </div>
      </div>
    </div>
    <div className="bg-brand-dark text-[#97a9bd] pb-1 pl-4 md:pl-1 text-[15px]">
      © Copyright QuizWRLD 2024
    </div>
    </>
  );
};
export default Footer;
