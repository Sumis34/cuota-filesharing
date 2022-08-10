import { motion } from "framer-motion";

export default function RadialProgress({
  progress = 0,
  radius,
}: {
  progress: number;
  radius: number;
}) {
  const circumference = Math.PI * 2 * radius;

  return (
    <div className="relative">
      <motion.svg
        animate={{
          rotate: -90,
          strokeDasharray: circumference,
          strokeLinecap: "round",
          strokeDashoffset: circumference - circumference * (progress / 100),
        }}
        height="100"
        width="100"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#22C55E"
          stroke-width="5"
          fill="transparent"
        />
      </motion.svg>
    </div>
  );
}
