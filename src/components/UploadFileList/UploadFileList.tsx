import UploadFileItem from "./UploadFileItem";

export default function UploadFileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (i: number) => void;
}) {
  return (
    <div className="relative max-h-44 overflow-y-auto divide-y-2 scrollbar-thumb-gray-200 scrollbar-thin scrollbar-thumb-rounded-md pr-4 mb-2">
      {files.map(({ name, type, size }, i) => (
        <UploadFileItem
          key={name}
          name={name}
          type={type}
          size={size}
          remove={() => onRemove(i)}
        />
      ))}
    </div>
  );
}
