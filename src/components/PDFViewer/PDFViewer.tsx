import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "../UI/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({ path }: { path: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-10">
      <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <Button onClick={() => setPageNumber(pageNumber + 1)}>+</Button>
      <Button onClick={() => setPageNumber(pageNumber - 1)}>-</Button>
    </div>
  );
}
