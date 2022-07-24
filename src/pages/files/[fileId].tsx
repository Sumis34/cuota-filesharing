import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { useQuery } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import FileItem from "../../components/FileViewer/FileItem";
import { motion } from "framer-motion";
import Controls from "../../components/FileViewer/Controls";
import downloadZip, { RemoteFiles } from "../../utils/download/downloadZip";
import { useState } from "react";
import DownloadToast from "../../components/DownloadToast";

const fileListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const downloadAll = async (remoteFiles: RemoteFiles | undefined) => {
  if (!remoteFiles) return;
  downloadZip(remoteFiles, (progressEvent) => console.log(progressEvent));
};

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();
  const [open, setOpen] = useState(true);

  const { data, isLoading } = useQuery([
    "files.getAll",
    {
      id: query.fileId as string,
    },
  ]);

  return (
    <>
      <DownloadToast open={open} setOpen={setOpen} progress={45} filesUploaded={12} fileCount={27} />
      <div className="my-32">
        <main className="relative z-10 pt-32">
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <Button onClick={() => downloadAll(data?.files)}>All</Button>
          <Controls />
          {isLoading ? (
            <Ring color="#dddddd" />
          ) : (
            <motion.ul
              variants={fileListVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {data?.files.map(({ key, url, contentLength, contentType }) => (
                <FileItem
                  name={key?.split("/").at(-1) || ""}
                  type={contentType}
                  size={contentLength}
                  url={url}
                />
              ))}
            </motion.ul>
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
    </>
  );
};

Files.getLayout = getDefaultLayout();

export default Files;
