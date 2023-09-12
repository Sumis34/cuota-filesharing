import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { useQuery } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import { AnimatePresence, motion } from "framer-motion";
import downloadZip, {
  DownloadProgressEvent,
  RemoteFile,
  RemoteFiles,
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
import { HiArrowLeft, HiDownload, HiQrcode } from "react-icons/hi";
import QRPopover from "../../components/QRPopover";
import IconButton from "../../components/UI/Button/IconButton";
import FullScreenFIleItem from "../../components/FullScreenFIleItem";
import PoolStats from "../../components/PoolStats";
import Link from "next/link";
import { KEY_PREFIX } from "../../utils/constants";
import decryptFile from "../../utils/crypto/decryptFile";
import { NoKeyAlert } from "../../components/NoKeyAlert/NoKeyAlert";
import getFingerprint from "../../utils/pools/generateFingerprint";
import AvatarList from "../../components/UI/Avatar/AvatarList";
import { useSession } from "next-auth/react";
import PoolAnalytics from "../../components/PoolAnalytics/PoolAnalytics";

const Files: NextPageWithLayout = () => {
  const { query } = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [progress, setProgress] = useState<DownloadProgressEvent>();
  const [files, setFiles] = useState<RemoteFile[]>([]);
  const [fp, setFp] = useState<string>("");
  const router = useRouter();
  const { data: session } = useSession();

  const { data, isLoading } = useQuery(
    [
      "files.getAll",
      {
        id: query.fileId as string,
        fp: String(fp),
      },
    ],
    {
      enabled: !!query.fileId && !!fp,
    }
  );

  const handleDownloadAll = async () => {
    if (!files) return;
    setOpen(true);
    await downloadZip(files, (progressEvent) => setProgress(progressEvent));
    setProgress(undefined);
  };

  const handleItemClick = (remoteFile: RemoteFile) => {
    setSelectedItem(files.indexOf(remoteFile) || 0);
    setFullscreenOpen(true);
  };

  const display:
    | {
        [key: string]: React.ReactNode;
      }
    | undefined = data && {
    grid: <GridMode files={files} onItemClick={handleItemClick} />,
    gallery: <GalleryMode files={files} onItemClick={handleItemClick} />,
    list: <ListMode files={files} onItemClick={handleItemClick} />,
  };

  const progressPercentage = progress
    ? Math.round((progress?.loaded / progress?.total) * 100)
    : 0;

  useEffect(() => {
    setUrl(`${window.location.origin}/files/${query.fileId}`);
  }, [query]);

  const processFiles = async () => {
    if (!data?.files) return [];
    if (!window.location.hash.slice(KEY_PREFIX.length)) return data?.files;

    const processedFiles = await Promise.all(
      data.files.map(async (f) => {
        if (f.metadata?.["encrypted"] != "true") return f;

        const response = await fetch(f.url);

        if (!response.body) return;

        const contentDisposition = response.headers.get("Content-Disposition");
        const matches = /filename="(.+)"/.exec(contentDisposition || "");
        const fileName = matches?.[1] ? matches[1] : "cuota-file";
        const fileType = response.headers.get("Content-Type") || "";

        const file = await decryptFile(
          {
            name: fileName,
            type: fileType,
            content: response.body,
          },
          window.location.hash.slice(KEY_PREFIX.length)
        );

        return {
          ...f,
          url: URL.createObjectURL(file),
        };
      })
    );

    return processedFiles.filter((f) => f !== undefined) as RemoteFiles;
  };

  useEffect(() => {
    const process = async () => {
      const files = await processFiles();
      setFiles(files);
    };
    process().catch((e) => console.log(e));
  }, [data]);

  useEffect(() => {
    const updateFp = async () => {
      setFp(await getFingerprint());
    };
    updateFp();
  });

  //TODO: Add skeleton loading animation
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
        file={files[selectedItem]}
        open={fullscreenOpen}
        setOpen={setFullscreenOpen}
      />
      {/* <NoKeyAlert
        open={
          !!data?.encrypted &&
          (!window.location.hash.slice(KEY_PREFIX.length) || false)
        }
        onAction={(k) => {
          router.push({ hash: k });
        }}
      /> */}
      <div className="my-32 relative">
        <main className="relative z-10 pt-32">
          <AnimatePresence exitBeforeEnter>
            {query.from && (
              <Link href={query.from.toString() || "#"} legacyBehavior>
                <a className="flex gap-3 items-center rounded-lg px-2 py-1 group hover:bg-gray-100 dark:hover:bg-neutral-900 w-fit font-sans transition-all mb-2 cursor-pointer">
                  <HiArrowLeft className="group-hover:translate-x-0 translate-x-1 transition-all" />{" "}
                  <span>Back</span>
                </a>
              </Link>
            )}
            {isLoading ? (
              <motion.div
                key={"loading"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex justify-center items-center py-48"
              >
                <Ring color="#dddddd" />
              </motion.div>
            ) : (
              <motion.div
                key={"content"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {session?.user && session.user.id === data?.owner && (
                  <PoolAnalytics id={query.fileId as string} />
                )}
                {data && (
                  <PoolStats
                    totalSize={data.totalSize}
                    files={files}
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
                      <IconButton
                        className="flex items-center gap-2 !px-3"
                        onClick={() => handleDownloadAll()}
                      >
                        <HiDownload />
                      </IconButton>
                    </div>
                  </motion.div>
                )}
                {display && display[(query.mode as PreviewMode) || "grid"]}
              </motion.div>
            )}
          </AnimatePresence>
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
