import { motion } from "framer-motion";

export default function RadialProgress({ progress }: { progress: number }) {
  return (
    <div className="relative">
      <motion.div
        animate={{
          background: `conic-gradient(
            rgb(3, 133, 255) 80%,
            rgb(242, 242, 242) 80%
          );`,
        }}
        className="w-12 aspect-square rounded-full"
      ></motion.div>
      <motion.div className="w-12 aspect-square absolute bg-gray-100 rounded-full"></motion.div>
    </div>
  );
}
