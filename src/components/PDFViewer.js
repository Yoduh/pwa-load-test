import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({pdf}) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setPageNumber(1);
        setNumPages(numPages);
    }

    return (
        pdf !== null ?
        <div>
        <Document
            file={pdf}
            options={{ workerSrc: "/pdf.worker.js" }}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        </div>
        :
        null
    );
}
export default PDFViewer;