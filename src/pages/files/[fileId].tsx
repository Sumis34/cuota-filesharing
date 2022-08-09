import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { useQuery } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import { motion } from "framer-motion";
import downloadZip, {
  DownloadProgressEvent,
  RemoteFile,
} from "../../utils/download/downloadZip";
import { useEffect, useState } from "react";
import DownloadToast from "../../components/DownloadToast";
import GridMode from "../../components/FileViewer/DisplayModes/GridMode";
import {
  GalleryMode,
  ListMode,
} from "../../components/FileViewer/DisplayModes";
import PreviewModeButton, {
  PreviewMode,
} from "../../components/PreviewModeButton.tsx/PreviewModeButton";
import { HiDownload, HiQrcode } from "react-icons/hi";
import QRPopover from "../../components/QRPopover";
import IconButton from "../../components/UI/Button/IconButton";
import FullScreenFIleItem from "../../components/FullScreenFIleItem";
import PoolStats from "../../components/PoolStats";

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [progress, setProgress] = useState<DownloadProgressEvent>();

  const { data, isLoading } = useQuery([
    "files.getAll",
    {
      id: query.fileId as string,
    },
  ]);

  const handleDownloadAll = async () => {
    if (!data?.files) return;
    setOpen(true);
    await downloadZip(data?.files, (progressEvent) =>
      setProgress(progressEvent)
    );
    setProgress(undefined);
  };

  const handleItemClick = (remoteFile: RemoteFile) => {
    setSelectedItem(data?.files.indexOf(remoteFile) || 0);
    setFullscreenOpen(true);
  };

  const display:
    | {
        [key: string]: React.ReactNode;
      }
    | undefined = data && {
    grid: <GridMode files={data?.files} onItemClick={handleItemClick} />,
    gallery: <GalleryMode files={data?.files} onItemClick={handleItemClick} />,
    list: <ListMode files={data?.files} onItemClick={handleItemClick} />,
  };

  const progressPercentage = progress
    ? Math.round((progress?.loaded / progress?.total) * 100)
    : 0;

  useEffect(() => {
    setUrl(`${window.location.origin}/files/${query.fileId}`);
  }, [query]);

  return (
    <>
      <DownloadToast
        open={open}
        setOpen={setOpen}
        progress={progressPercentage}
        filesUploaded={progress?.uploadedFiles || 0}
        fileCount={progress?.fileCount || 0}
      />
      <FullScreenFIleItem
        currentId={selectedItem}
        file={data?.files[selectedItem]}
        open={fullscreenOpen}
        setOpen={setFullscreenOpen}
      />
      <div className="my-32 relative">
        <main className="relative z-10 pt-32">
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          {data && (
            <PoolStats
              totalSize={data.totalSize}
              files={data.files}
              message={data.message}
              createdAt={data.poolCreatedAt}
              expiresAt={data.expiresAt}
            />
          )}
          {query.controls !== "false" && (
            <motion.div
              className="flex justify-between mb-3 sticky top-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PreviewModeButton />
              <div className="flex gap-3">
                <QRPopover url={url}>
                  <IconButton
                    as="div"
                    className="h-full aspect-square px-2 group hidden sm:flex items-center justify-center"
                  >
                    <HiQrcode className="text-2xl group-hover:text-indigo-500 transition-all text-indigo-800" />
                  </IconButton>
                </QRPopover>
                <Button
                  title="Download all files as zip"
                  className="flex items-center gap-2 !px-3"
                  onClick={() => handleDownloadAll()}
                >
                  <HiDownload />
                </Button>
              </div>
            </motion.div>
          )}
          {isLoading ? (
            <Ring color="#dddddd" />
          ) : (
            display && display[(query.mode as PreviewMode) || "grid"]
          )}
        </main>
        {/* <img
          src="/assets/images/mesh-gradient.png"
          className="absolute top-[-1900px] md:right-[50%] w-full h-full blur-3xl rotate-90 opacity-70"
          alt=""
        />
        <img
          src="/assets/images/mesh-gradient.png"
          className="absolute top-[20%] md:left-[70%] blur-2xl opacity-70 animate-pulse"
          alt=""
        /> */}
      </div>
    </>
  );
};

Files.getLayout = getDefaultLayout();

export default Files;
