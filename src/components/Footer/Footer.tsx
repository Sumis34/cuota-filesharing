import Link from "next/link";
import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";

const SOCIAL_LINKS: { href: string; icon: React.ReactNode }[] = [
  {
    href: "https://github.com/Sumis34/cuota-filesharing",
    icon: (
      <FaGithub className="text-2xl fill-black/30 hover:fill-indigo-500 transition-all" />
    ),
  },
  {
    href: "https://www.youtube.com/channel/UCrMHiwrrOGY3sAtQV3KgZyAs",
    icon: (
      <FaYoutube className="text-2xl fill-black/30 hover:fill-indigo-500 transition-all" />
    ),
  },
  {
    href: "https://www.instagram.com/noekrebs/",
    icon: (
      <FaInstagram className="text-2xl fill-black/30 hover:fill-indigo-500 transition-all" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="h-64 w-full">
      <img
        src="/assets/shapes/flat_ellipse.svg"
        className="-translate-y-full w-full"
        alt="ellipse"
      />
      <div className="w-full flex items-center justify-center flex-col">
        <Link href="/">
          <a className="hover:opacity-80 cursor-pointer transition-all text-5xl font-serif font-bold mb-2">
            Cuota.
          </a>
        </Link>
        <p className="opacity-70 text-center leading-tight">
          Wanna learn more about{" "}
          <Link href="/article/why-cuota">
            <a>
              <span className="text-indigo-500 underline">Cuota</span>?
            </a>
          </Link>
        </p>
      </div>
      <div className="w-full flex gap-2 justify-center mt-4">
        {SOCIAL_LINKS.map(({ icon, href }) => (
          <a key={href} href={href}>
            {icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
