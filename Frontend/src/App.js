import React from "react";
import PDFReader from './components/PDFReader';
import { FilePondComponent } from "./components/Filepond";
import { Route, Routes } from 'react-router-dom';




function App() {
  return (
    <Routes>
      <Route path="/" element={<PDFReader />} />
    </Routes>
  );
}

export default App;