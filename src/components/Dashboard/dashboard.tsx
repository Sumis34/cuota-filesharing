import { useSession } from "next-auth/react";
import TabsView, { Tab } from "./tabs";
import Upload from "./upload";
import UploadsList from "../UI/uploads-list";
import MyUploads from "./my-uploads";

const DEFAULT_TAB = "upload";

export default function Dashboard() {
  const { data: session } = useSession();

  const triggers: Tab[] = [
    { id: "upload", name: "Upload", content: <Upload /> },
    { id: "my-uploads", name: "My Uploads", content: <MyUploads /> },
    { id: "shared-with-me", name: "Shared With Me", content: <>for me</> },
  ];

  return (
    <div className="sm:mt-52 mt-28">
      <div className="mb-8">
        <h1>Hello👋, {session?.user?.name}!</h1>
        <p className="mt-2">Welcome to your personal space.</p>
      </div>
      <TabsView tabs={triggers} defaultTab={DEFAULT_TAB} />
    </div>
  );
}
