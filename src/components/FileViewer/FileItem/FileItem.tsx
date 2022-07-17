interface FileItemProps {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

export default function FileItem({ name, size, type }: FileItemProps) {
  return <div>Files</div>;
}
