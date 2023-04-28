import * as Tabs from "@radix-ui/react-tabs";
import { useSession } from "next-auth/react";
import { useState } from "react";

const DEFAULT_TAB = "upload";

export default function Dashboard() {
  const [current, setCurrent] = useState(DEFAULT_TAB);
  const { data: session } = useSession();

  const triggers = [
    { id: "upload", name: "Upload" },
    { id: "my-uploads", name: "My Uploads" },
  ];

  return (
    <div className="mt-52">
      <div className="mb-8">
        <h1>Hello👋, {session?.user?.name}!</h1>
        <p className="mt-2">Welcome to your personal space.</p>
      </div>
      <Tabs.Root
        defaultValue={DEFAULT_TAB}
        onValueChange={(v) => setCurrent(v)}
      >
        <Tabs.List className="flex gap-2">
          {triggers.map(({ id, name }) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className={`rounded-xl bg-neutral-900 px-3 py-2 font-semibold hover:bg-neutral-800 transition-all ${
                current === id && "bg-violet-300 hover:bg-violet-300 text-black"
              }`}
            >
              {name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="upload">
          <div>upload</div>
        </Tabs.Content>
        <Tabs.Content value="my-uploads">
          <div>my uploads</div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
