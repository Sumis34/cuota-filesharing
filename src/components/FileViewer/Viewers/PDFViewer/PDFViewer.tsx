import { useRef, useState } from "react";
import { Document, LoadingProcessData, Page, pdfjs } from "react-pdf";
import Button from "../../../UI/Button";
import { motion } from "framer-motion";
import { ViewMode } from "../../Previewer/Previewer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({
  path,
  mode,
}: {
  path: string;
  mode: ViewMode;
}) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(0);

  const parent = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handelProgress = (data: LoadingProcessData) => {
    setLoading(Math.round((data.loaded * 100) / data.total));
  };

  const previewWidth = (parent.current?.offsetWidth || 200) - 40;
  const fullscreenHeight = (parent.current?.offsetHeight || 200) - 40;

  return (
    <div className="px-10 py-5 h-full" ref={parent}>
      <Document
        file={path}
        loading={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="block w-full  rounded-md overflow-hidden"
          >
            <motion.div
              style={{ width: `${loading}%` }}
              className="bg-gradient-to-r from-gray-200 to-gray-100 h-2"
            />
          </motion.div>
        }
        onLoadProgress={handelProgress}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          width={mode === "preview" ? previewWidth : undefined}
          height={mode === "fullscreen" ? fullscreenHeight : undefined}
          pageNumber={pageNumber}
        />
      </Document>
      {mode === "fullscreen" && (
        <>
          <Button onClick={() => setPageNumber(pageNumber + 1)}>+</Button>
          <Button onClick={() => setPageNumber(pageNumber - 1)}>-</Button>
        </>
      )}
    </div>
  );
}
