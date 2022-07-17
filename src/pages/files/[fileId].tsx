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
      <main className="relative z-10">
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
      </main>
      <img
        src="/assets/images/mesh-gradient.png"
        className="absolute top-[60%] right-[50%] w-full h-full blur-3xl rotate-90 opacity-70"
        alt=""
      />
      <img
        src="/assets/images/mesh-gradient.png"
        className="absolute top-[20%] left-[70%] blur-2xl opacity-70 animate-pulse"
        alt=""
      />
    </div>
  );
};

Files.getLayout = getDefaultLayout();

export default Files;
