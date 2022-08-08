import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import LoginButtons from "./LoginButtons";
import ProfileInfo from "./ProfileInfo";

export default function LandingNav() {
  const { data: session, status } = useSession();
  return (
    <div className="left-0 top-0 fixed z-50 flex w-screen justify-center bg-white/30 backdrop-blur-xl">
      <nav
        className={`sm:px-20 px-5 w-full max-w-screen-2xl flex justify-between ${
          0 > 0 ? "py-5" : "py-12"
        }`}
      >
        <Link href="/">
          <a className="flex items-center gap-2">
            <h2>cuota.</h2>
            {process.env.NEXT_PUBLIC_SITE_STATE === "beta" ? (
              <Badge>Beta</Badge>
            ) : process.env.NEXT_PUBLIC_SITE_STATE === "dev" ? (
              <Badge variant="warning">Dev</Badge>
            ) : null}
          </a>
        </Link>
        <div>
          <AnimatePresence>
            {session ? (
              <ProfileInfo
                name={session.user?.name}
                avatar={session.user?.image}
                email={session.user?.email}
              />
            ) : (
              <LoginButtons />
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}
