import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { data } = trpc.useQuery([
    "files.getAll",
    {
      id: query.fileId as string,
    },
  ]);

  return (
    <div className="mt-32">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data?.files.map((file) => (
        <a href={file.url} key={file.key}>
          {file.key}
        </a>
      ))}
    </div>
  );
};

Files.getLayout = getDefaultLayout();

export default Files;
