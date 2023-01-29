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
import { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import LoginButtons from "./LoginButtons";
import ProfileInfo from "./ProfileInfo";

export default function LandingNav() {
  const { data: session, status } = useSession();
  const { scrollY } = useViewportScroll();
  const { toggleDark, dark } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  const padding = useTransform(
    scrollY,
    // Map x from these values:
    [0, 200],
    // Into these values:
    [48, 20]
  );

  useEffect(() => {
    scrollY.onChange((v) => setScrolled(v > 50));
  }, []);

  return (
    <motion.div
      className={`left-0 top-0 fixed z-50 flex w-screen justify-center transition-all duration-400 bg-gradient-to-b from-white dark:from-black ${
        scrolled ? "bg-white/90 dark:bg-black/90 backdrop-blur-xl" : ""
      }`}
    >
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
    </motion.div>
  );
}
