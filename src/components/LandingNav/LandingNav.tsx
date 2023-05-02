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
import RecentUpload from "../RecentUpload";
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
    <div className="left-0 top-0 fixed w-screen z-50">
      <RecentUpload />
      <motion.div
        className={`flex justify-center transition-all duration-500 after:bg-gradient-to-b after:from-white after:dark:from-black after:inset-0 after:absolute ${
          scrolled || session?.user
            ? "bg-white/80 dark:bg-black/60 backdrop-blur-xl"
            : "bg-white/0 dark:bg-black/0"
        }`}
      >
        <motion.nav
          className={`sm:px-20 sm:py-4 py-2 px-5 w-full max-w-screen-2xl flex justify-between relative z-30`}
          style={{
            ...(session === null && {
              paddingTop: padding,
              paddingBottom: padding,
            }),
          }}
        >
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-2">
              <h2>cuota.</h2>
              {process.env.NEXT_PUBLIC_SITE_STATE === "beta" ? (
                <Badge>Beta</Badge>
              ) : process.env.NEXT_PUBLIC_SITE_STATE === "dev" ? (
                <Badge variant="warning">Dev</Badge>
              ) : null}
            </a>
          </Link>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Link href="/bin" legacyBehavior>
                <a className="flex items-center gap-2 font-bold text-lg dark:hover:bg-neutral-900/80 dark:active:bg-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 px-3 py-2 rounded-md transition-all">
                  <p>Bins</p>
                  <span className="text-xs bg-red-500 rounded-md px-1 py-0.5 -translate-y-1">
                    New
                  </span>
                </a>
              </Link>
            </div>
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
    </div>
  );
}
