import React from "react";
import PDFReader from './components/PDFReader';
import { FilePondComponent } from "./components/filepond";
import { Route, Routes } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  ChakraProvider
} from "@chakra-ui/react";

const UploadComponent = () =>(
  <ChakraProvider>
    <Container>
      <Heading>Upload PDF File</Heading>
      <Box>
        <FilePondComponent />
      </Box>
    </Container>
  </ChakraProvider>
)

function App() {
  const [value, setValue] = React.useState("react-filepond");
  return (
    <Routes>
      <Route path="/" element={<UploadComponent />} />
      <Route path="/editor" element={<PDFReader />} />
    </Routes>
  );
}

export default App;