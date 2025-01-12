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

const UsefulLinks = ({ pages }: { pages: Page[] }) => {
  return (
    <ul className="space-y-1">
      {pages.map((page) => (
        <li key={page.title}>
          <Link
            href={page.path}
            className="hover:text-brand text-[15px] md:text-[17px]"
          >
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Footer = () => {
  return (
    <div className="bg-brand-dark w-svw flex flex-col md:flex-row justify-between xl:px-72 lg:px-40 md:px-20 sm:px-20 py-6 lg:wgap-72 md:wgap-1  px-4 absolute bottom-0">
      <div className="md:block flex flex-col  justify-start item-start">
        <Logo className="mb-2" />
        <div className="text-[14px] md:text-[15px]">
          Don't have an account yet?
        </div>
        <Link href="/login">
          <button className="bg-brand-light text-brand-dark w-24 rounded-md p-1 font-bold mt-1">
            Sign in
          </button>
        </Link>
      </div>

      <div className="flex flex-row md:contents justify-between items-start gap-4 mt-8 md:mt-0">
        <div className="md:block flex flex-col justify-start items-start">
          <div className="font-bold text-xl mb-2">Contact Us</div>
          <div className="flex gap-1">
            <Image
              src={emailicon}
              alt="Email"
              className="hover:text-brand"
            ></Image>
            <a href="mailto:support@quizwrld.com" className="hover:text-brand">
              <div className="text-[15px] md:text-[17px]">
                support@quizwrld.com
              </div>
            </a>
          </div>
          <div className="flex gap-3 mt-1">
            <Link href="https://www.facebook.com">
              <Image src={FacebookIcon} alt="Facebook"></Image>
            </Link>
            <Link href="https://www.linkedin.com">
              <Image src={LinkedinIcon} alt="LinkedIn"></Image>
            </Link>
            <Link href="https://www.instagram.com">
              <Image src={InstagramIcon} alt="Instagram"></Image>
            </Link>
            <Link href="https://www.youtube.com">
              <Image src={YoutubeIcon} alt="Youtube"></Image>
            </Link>
          </div>
        </div>

        <div className="md:block flex flex-col justify-center items-start">
          <div className="font-bold text-xl mb-2 ">Useful Links</div>
          <UsefulLinks pages={pages}></UsefulLinks>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 opacity-80 text-[15px]">
        © Copyright QuizWRLD 2024
      </div>
    </div>
  );
};
export default Footer;
