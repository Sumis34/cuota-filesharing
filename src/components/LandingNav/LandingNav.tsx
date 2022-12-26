import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import LoginButtons from "./LoginButtons";
import ProfileInfo from "./ProfileInfo";

export default function LandingNav() {
  const { data: session, status } = useSession();
  const { scrollY } = useViewportScroll();

  const padding = useTransform(
    scrollY,
    // Map x from these values:
    [0, 200],
    // Into these values:
    [48, 20]
  );

  return (
    <div className="left-0 top-0 fixed z-50 flex w-screen justify-center bg-white/90 backdrop-blur-xl">
      <motion.nav
        className={`sm:px-20 px-5 w-full max-w-screen-2xl flex justify-between`}
        style={{
          paddingTop: padding,
          paddingBottom: padding,
        }}
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
      </motion.nav>
    </div>
  );
}
