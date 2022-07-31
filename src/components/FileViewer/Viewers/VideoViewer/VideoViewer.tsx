import { HiVideoCamera } from "react-icons/hi";

export default function VideoViewer({ path }: { path: string }) {
  return (
    <div className="relative h-full">
      <div className="inset-0 absolute p-5">
        <div
          className="p-2 bg-gray-200/5 ml-auto w-fit rounded-lg"
          title="Video"
        >
          <HiVideoCamera className="fill-gray-200" />
        </div>
      </div>
      <video className="object-cover w-full h-full">
        <source src={path} type={"video/mp4"} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
