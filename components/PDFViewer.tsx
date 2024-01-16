

export default function PDFViewer() {
  
  return (
    <>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
          <iframe src="/viewer.html" style={{ width: '100%', height:'100%', border: 'none'}}></iframe>
      </div>
    </>
  )
}
