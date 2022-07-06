import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "files.getAll",
    {
      id: query.fileId as string,
    },
  ]);

  return (
    <div className="mt-32">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data?.files.map((file) => (
        <Button href={file.url} key={file.key}>
          {file.key?.split("/")[file.key.split("/").length - 1]}
        </Button>
      ))}
      {isLoading && (
        <div>
          <Ring color="#dddddd" />
        </div>
      )}
    </div>
  );
};

Files.getLayout = getDefaultLayout();

export default Files;
