import { motion } from "framer-motion";

export default function RadialProgress({
  progress = 0,
  radius,
}: {
  progress: number;
  radius: number;
}) {
  const circumference = Math.PI * 2 * radius;
  const stroke = 5;
  const width = radius * 2 + stroke;
  const height = width;
  const cy = height / 2;
  const cx = width / 2;

  return (
    <div className="h-fit w-fit">
      <motion.svg
        animate={{
          rotate: -90,
          strokeDasharray: circumference,
          strokeLinecap: "round",
          strokeDashoffset: circumference - circumference * (progress / 100),
        }}
        height={height}
        width={width}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#22C55E"
          stroke-width="5"
          fill="transparent"
        />
      </motion.svg>
    </div>
  );
}
