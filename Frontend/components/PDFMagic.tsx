"use client";
import { useEffect, useRef, useState } from "react";
import ReorderPages from "./ReorderPages";
import ExtractText from "./ExtractText";
import Image2Text from "./Image2Text";
import PDFViewer from "./PDFViewer";
import Word2PDF from "./Word2PDF";
import Excel2PDF from "./Excel2PDF";
import Image2PDF from "./Image2PDF";
const PDF_VIEWER = "PDF Viewer";
const REORDER_OP = "Reorder or Remove Pages";
const EXTRACT_TEXT_OP = "Extract Text";
const IMAGE2TEXT = "Image to Text";
const FORM_HANDLING = "Form Handling";
const WORD2PDF = "Convert word to pdf";
const EXCEL2PDF = "Convert excel to pdf";
const IMAGE2PDF = "Convert image to pdf";
const ALL_OPERATION_OPTIONS = [PDF_VIEWER, REORDER_OP, EXTRACT_TEXT_OP, IMAGE2TEXT, WORD2PDF, EXCEL2PDF, IMAGE2PDF] as const;
type OperationMode = (typeof ALL_OPERATION_OPTIONS)[number];

export default function PDFMagic() {
  const [operationMode, setOperationMode] = useState<OperationMode>(PDF_VIEWER);
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if(selectRef.current){
      setOperationMode(selectRef.current.value as OperationMode);
    }
  },[])
  return (
    <>
      <div className="p-1">
        <span className="text-xl">Mode: </span>
        <select ref={selectRef}
          className=" dark:bg-slate-800 p-1 rounded-md text-xl border-2 border-blue-400 bg-blue-50 dark:border-blue-800"
          onChange={(e) => setOperationMode(e.currentTarget.value as OperationMode)}
          value={operationMode}
        >
          {ALL_OPERATION_OPTIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      {operationMode === PDF_VIEWER && <PDFViewer />}
      {operationMode === REORDER_OP && <ReorderPages />}
      {operationMode === EXTRACT_TEXT_OP && <ExtractText />}
      {operationMode === IMAGE2TEXT && <Image2Text />}
      {operationMode === WORD2PDF && <Word2PDF />}
      {operationMode === EXCEL2PDF && <Excel2PDF />}
      {operationMode === IMAGE2PDF && <Image2PDF />}
    </>
  );
}
