import Avatar from "../UI/Avatar";
import { motion } from "framer-motion";

interface ProfileInfoProps {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export default function ProfileInfo({ name, email, avatar }: ProfileInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="text-right">
        <p className="-mb-1">{name}</p>
        {/* <p className="text-xs opacity-40">{email}</p> */}
      </div>
      <Avatar className="w-10" url={avatar || ""} />
    </motion.div>
  );
}
