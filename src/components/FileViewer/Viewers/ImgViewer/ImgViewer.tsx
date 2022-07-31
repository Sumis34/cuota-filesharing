export default function ImgViewer({ path }: { path: string }) {
  return <img src={path} className="object-cover w-full h-full" />;
}
