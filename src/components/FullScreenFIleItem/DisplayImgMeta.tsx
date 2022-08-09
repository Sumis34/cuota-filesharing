import { format } from "date-fns";
import { HiCamera } from "react-icons/hi";

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
    <div className="flex gap-4 min-h-">
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Camera
        </h3>
        <span className="text-sm ">{camera || "unknown"}</span>
      </div>
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Shutter speed
        </h3>
        <span className="text-sm ">{shutterSpeed || "-"}</span>
      </div>
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Camera
        </h3>
        <span className="text-sm ">{aperture || "-"}f</span>
      </div>
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Focal length
        </h3>
        <span className="text-sm ">{focalLength || "-"}mm</span>
      </div>
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Size
        </h3>
        <span className="text-sm ">
          {width} x {height}
        </span>
      </div>
      <div className="flex gap-1 flex-col">
        <h3 className="text-xs leading-none -mb-1 opacity-50 font-sans font-semibold">
          Capture date
        </h3>
        <span className="text-sm ">
          {time ? format(new Date(time), "dd MMM, yyyy HH:mm") : "-"}
        </span>
      </div>
    </div>
  );
}
