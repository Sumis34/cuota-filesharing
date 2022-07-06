import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import mime from "mime-types";
import PDFViewer from "../../components/PDFViewer";

const pdf = mime.contentType("pdf");

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();

  const { data, isLoading } = trpc.useQuery([
    "files.getAll",
    {
      id: query.fileId as string,
    },
  ]);

  return (
    <div className="my-32">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="flex gap-5">
        {data?.files.map((file) => (
          <div key={file.key}>
            <Button href={file.url}>
              {file.key?.split("/")[file.key.split("/").length - 1]}
            </Button>
          </div>
        ))}
      </div>
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
