"use client";
import { useEffect, useRef, useState } from "react";
import ReorderPages from "./ReorderPages";
import ExtractText from "./ExtractText";
import Image2Text from "./Image2Text";
const REORDER_OP = "Reorder or Remove Pages";
const EXTRACT_TEXT_OP = "Extract Text";
const IMAGE2TEXT = "Image to Text";
const ALL_OPERATION_OPTIONS = [REORDER_OP, EXTRACT_TEXT_OP, IMAGE2TEXT] as const;
type OperationMode = (typeof ALL_OPERATION_OPTIONS)[number];

export default function PDFMagic() {
  const [operationMode, setOperationMode] = useState<OperationMode>(REORDER_OP);
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if(selectRef.current){
      setOperationMode(selectRef.current.value as OperationMode);
    }
  },[])
  return (
    <>
      <h1 className="text-3xl mb-1">PDF Tools</h1>
      <h2 className="text-xl leading-tight tracking-tight mb-4">
        Reorder or Process
        PDFs
      </h2>
      <div className="mb-5">
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
      {operationMode === REORDER_OP && <ReorderPages />}
      {operationMode === EXTRACT_TEXT_OP && <ExtractText />}
      {operationMode === IMAGE2TEXT && <Image2Text />}
    </>
  );
}
