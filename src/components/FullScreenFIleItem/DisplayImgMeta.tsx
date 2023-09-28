import { format } from "date-fns";
import { HiCamera } from "react-icons/hi";
import { motion } from "framer-motion";
interface DisplayImgMetaProps {
  camera?: string;
  time?: Date;
  iso?: number;
  aperture?: number;
  shutter?: number;
  focalLength?: number;
  height?: number;
  width?: number;
  latitude?: number;
  longitude?: number;
}

const calcShutterSpeed = (shutter: number) => {
  if (shutter >= 1) {
    return Math.round(shutter * 10) / 10 + "s";
  }
  return "1/" + Math.round(1 / shutter) + "s";
};

export default function DisplayImgMeta({
  camera,
  shutter,
  aperture,
  focalLength,
  height,
  width,
  time,
  latitude,
  longitude,
}: DisplayImgMetaProps) {
  const shutterSpeed = calcShutterSpeed(shutter || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-4"
    >
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Camera
        </h3>
        <span className="text-sm whitespace-nowrap">{camera || "unknown"}</span>
      </div>
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Shutter speed
        </h3>
        <span className="text-sm whitespace-nowrap">{shutterSpeed || "-"}</span>
      </div>
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Camera
        </h3>
        <span className="text-sm whitespace-nowrap">{aperture || "-"}f</span>
      </div>
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Focal length
        </h3>
        <span className="text-sm whitespace-nowrap">{focalLength || "-"}mm</span>
      </div>
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Size
        </h3>
        <span className="text-sm ">
          {width} x {height}
        </span>
      </div>
      <div className="flex gap-1 flex-col justify-between">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold whitespace-nowrap">
          Capture date
        </h3>
        <span className="text-sm whitespace-nowrap">
          {time ? format(new Date(time), "dd MMM, yyyy HH:mm") : "-"}
        </span>
      </div>
    </motion.div>
  );
}
