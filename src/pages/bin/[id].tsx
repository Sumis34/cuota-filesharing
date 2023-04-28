import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import FileViewer from "../../components/UI/Bins/FileViewer";
import Code from "../../components/UI/code";
import { useQuery } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const Bin: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const id = router.query.id as string;

  const { data } = useQuery(["bin.getBin", { id: id }]);

  return (
    <div className="relative w-full my-52 flex justify-center">
      <div className="max-w-screen-lg w-full">
        {data?.files.map((file) => (
          <FileViewer
            key={file.key}
            name={file.filename || ""}
            url={file.url}
            id={file.key || ""}
          />
        ))}
      </div>
    </div>
  );
};

Bin.getLayout = getDefaultLayout();

export default Bin;
