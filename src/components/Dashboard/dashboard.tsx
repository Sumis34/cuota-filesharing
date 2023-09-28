import { useSession } from "next-auth/react";
import TabsView, { Tab } from "./tabs";
import Upload from "./upload";
import UploadsList from "../UI/uploads-list";
import MyUploads from "./my-uploads";
import SharedWithMe from "./shared-with-me";

const DEFAULT_TAB = "upload";

export default function Dashboard() {
  const { data: session } = useSession();

  const triggers: Tab[] = [
    { id: "upload", name: "Upload", content: <Upload /> },
    { id: "my-uploads", name: "My Uploads", content: <MyUploads /> },
    // { id: "my-bins", name: "My Bins", content: <>My Bins</> },
    { id: "shared-with-me", name: "Shared With Me", content: <SharedWithMe /> },
  ];

  return (
    <div className="sm:pt-32 pt-28 pb-5 h-full">
      <div className="mb-8">
        <h1>Hello👋, {session?.user?.name}!</h1>
        <p className="mt-2">Welcome to your personal space.</p>
      </div>
      <TabsView tabs={triggers} defaultTab={DEFAULT_TAB} />
    </div>
  );
}
