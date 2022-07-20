import { useRef, useState } from "react";
import { Document, LoadingProcessData, Page, pdfjs } from "react-pdf";
import Button from "../UI/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({ path }: { path: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(0);

  const parent = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handelProgress = (data: LoadingProcessData) => {
    setLoading(Math.round(data.loaded * 100) / data.total);
  };

  return (
    <div className="px-10 py-5 h-full" ref={parent}>
      <Document
        file={path}
        loading={
          <div className="w-full flex items-center justify-center">
            <span>{loading}</span>
          </div>
        }
        onLoadProgress={handelProgress}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          width={(parent.current?.offsetWidth || 200) - 40}
          pageNumber={pageNumber}
        />
      </Document>

      {/* <Button onClick={() => setPageNumber(pageNumber + 1)}>+</Button>
      <Button onClick={() => setPageNumber(pageNumber - 1)}>-</Button> */}
    </div>
  );
}
