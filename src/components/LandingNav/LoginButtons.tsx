import { motion } from "framer-motion";
import Button from "../UI/Button";

export default function LoginButtons() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-2 items-center"
    >
      <Button
        variant="secondary"
        className="scale-90 border-none !px-2 "
        href="/auth/signin"
      >
        Sign in
      </Button>
      <Button href="/auth/signin" className="scale-90">
        Sign Up
      </Button>
    </motion.div>
  );
}
