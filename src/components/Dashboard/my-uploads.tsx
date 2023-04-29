import UploadsList from "../UI/uploads-list";

export default function MyUploads() {
  return <UploadsList fetchPath="pools.getUserPools" />;
}
