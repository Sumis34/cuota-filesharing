import {
  HiAnnotation,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineExclamationCircle,
  HiX,
} from "react-icons/hi";

interface InfoBoxProps {
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
  children: React.ReactNode;
}

export default function InfoBox({ type, children, onClose }: InfoBoxProps) {
  return (
    <div
      className={`flex gap-2 px-3 py-2 items-center rounded-lg ${
        type === "success"
          ? "bg-green-100"
          : type === "error"
          ? "bg-red-100"
          : type === "warning"
          ? "bg-orange-100"
          : "bg-blue-100"
      }`}
    >
      {type === "success" ? (
        <HiOutlineCheckCircle className="stroke-green-800 text-xl" />
      ) : type === "error" ? (
        <HiOutlineExclamation className="stroke-red-800 text-xl" />
      ) : type === "warning" ? (
        <HiOutlineExclamationCircle className="stroke-orange-800 text-xl" />
      ) : (
        <HiAnnotation className="fill-blue-500 text-xl" />
      )}
      <div
        className={`text-xs ${
          type === "success"
            ? "text-green-800"
            : type === "error"
            ? "text-red-800"
            : type === "warning"
            ? "text-orange-800"
            : "text-blue-800"
        }`}
      >
        {children}
      </div>
      {onClose && (
        <button onClick={onClose} type="button" className="ml-auto">
          <HiX
            className={`${
              type === "success"
                ? "text-green-800"
                : type === "error"
                ? "text-red-800"
                : type === "warning"
                ? "text-orange-800"
                : "text-blue-800"
            }`}
          />
        </button>
      )}
    </div>
  );
}
