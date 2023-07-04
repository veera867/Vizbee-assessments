// import React, { useEffect, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { css } from '@emotion/react';

// const PdfToImage = ({ pdfData }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [blobUrl, setBlobUrl] = useState('');

//   useEffect(() => {
//     pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//     const byteCharacters = atob(pdfData);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);

//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type: 'application/pdf' });
//     const blobUrl = URL.createObjectURL(blob);
//     setBlobUrl(blobUrl);

//     return () => {
//       URL.revokeObjectURL(blobUrl);
//     };
//   }, [pdfData]);

//   const handleDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const handlePageChange = (newPageNumber) => {
//     setPageNumber(newPageNumber);
//   };

//   const customStyles = css`
//   .react-pdf__Page__canvas {
//     border: 1px solid red;
//     margin: 70px -330px
//   }
// `;



//   return (
//     <div>
//       {blobUrl && (
//         <div  style={{margin: "10px -353px"}}>
//           <Document 
//           file={blobUrl} 
//           onLoadSuccess={handleDocumentLoadSuccess}
//           >
//              <Page pageNumber={pageNumber} />
//           </Document>          
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfToImage;
