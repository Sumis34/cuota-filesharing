import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface Tab {
  name: string;
  id: string;
  content: React.ReactNode;
}

export default function TabsView({
  tabs,
  defaultTab,
}: {
  tabs: Tab[];
  defaultTab: string;
}) {
  const [current, setCurrent] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setCurrent(value);
    router.push("#" + value);
  };

  const router = useRouter();

  useEffect(() => {
    const currentTab = router.asPath.split("#").at(-1) || "";
    setCurrent(currentTab !== "/" ? currentTab : defaultTab);
  }, [router]);

  return (
    <Tabs.Root
      defaultValue={current}
      value={current}
      onValueChange={handleTabChange}
    >
      <Tabs.List className="flex gap-2">
        {tabs.map(({ id, name }) => (
          <Tabs.Trigger
            key={id}
            value={id}
            className={`rounded-xl bg-neutral-900 px-3 py-2 font-semibold hover:bg-neutral-800 transition-all ${
              current === id &&
              "bg-violet-300 hover:bg-violet-300 text-black font-bold"
            }`}
          >
            {name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(({ id, content }) => (
        <Tabs.Content value={id} key={id}>
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
