import useTheme from "../../hooks/useTheme";
import { motion } from "framer-motion";

export default function Empty({ message }: { message: string }) {
  const theme = useTheme();
  return (
    <div className="w-full flex justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <img
          src={
            theme.dark
              ? "/assets/images/international-philanthropy-day-dark.svg"
              : "/assets/images/international-philanthropy-day-1.svg"
          }
          className="h-80 block"
          alt="illustration"
        />
        <p className="dark:text-neutral-400 text-center">{message}</p>
      </motion.div>
    </div>
  );
}
