import Header from "@/components/Header";

export default function PDFViewer() {
  
  return (
    <>
      <Header text="PDF Viewer"/>
      <div>
        <iframe src="pdfview/web/viewer.html" style={{width:"100%", height:"99.6vh", border:"none", paddingBottom:"none", margin:"none"}}></iframe>
      </div>
    </>
  )
}
