import Logo from "./logo";
import Image from "next/image";
import emailicon from "../assets/emailIcon.svg";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaYoutubeSquare,
  FaInstagramSquare,
} from "react-icons/fa";
import Link from "next/link";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Discover Quizzes",
    path: "/discover-quizzes/quizzes",
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
    title: "Blog",
    path: "/blog",
  }, 
  {
    title: "Log in",
    path: "/login",
  },
];

const SocialLinks = () => {
  return (
    <div className="flex gap-1 md:gap-3 mt-1 h-9">
      <Link href={"https://www.facebook.com"} className="h-full sm:hover:text-brand-light sm:active:text-brand-light">
        <FaFacebookSquare className="w-full h-full"/>
      </Link>

      <Link href={"https://www.youtube.com"} className="h-full sm:hover:text-brand-light sm:active:text-brand-light">
        <FaYoutubeSquare className="w-full h-full"/>
      </Link>

      <Link href={"https://www.linkedin.com"} className="h-full sm:hover:text-brand-light sm:active:text-brand-light">
        <FaLinkedin className="w-full h-full"/>
      </Link>

      <Link href={"https://www.instagram.com"} className="h-full sm:hover:text-brand-light sm:active:text-brand-light">
        <FaInstagramSquare className="w-full h-full"/>
      </Link>
    </div>
  )
};

const UsefulLinks = ({ pages }: { pages: Page[] }) => {
  return (
    <ul>
      {pages.map((page) => (
        <li key={page.title} className="pb-1">
          <Link
            href={page.path}
            className="sm:hover:text-brand-light sm:active:text-brand-light text-[15px] md:text-[17px] py-[5px]"
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
          <button className="bg-brand-light text-brand-dark w-24 rounded-md p-1 font-bold mt-1 sm:hover:bg-brand-hover sm:active:bg-brand-hover">
            Sign up
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
              className="sm:hover:text-brand-light"
            ></Image>
            <a href="mailto:support@quizwrld.com" className="sm:hover:text-brand-light">
              <div className="text-[15px] md:text-[17px]">
                support@quizwrld.com
              </div>
            </a>
          </div>
          <div className="flex gap-3 mt-1">
            <SocialLinks></SocialLinks>
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
