import withAuth from '@/components/withAuth';
import { useState, useEffect } from 'react';
const PDFViewer = () => {

  const [id, setId] = useState<string>(''); // Provide a default value of type string

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialId = urlParams.get('id');
    if (initialId) {
      setId(initialId); // Update the state only if initialId is not null
    }
  }, []);

  useEffect(() => {
    if (id) {
      const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `./pdfview/web/viewer.html?id=${id}`;
      }
    }
  }, [id]);

  return (
    <>
      <div style={{ width: "100%", maxHeight: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              paddingLeft: "10px",
              paddingTop: "4px",
            }}
          >
          </div>
        </div>
        <div
          style={{
            overflow: "hidden",
            backgroundColor: "#3C97FE",
            borderRadius: "10px",
            margin: "5px",
          }}
        >
          <div
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "40px",
              marginBottom: "5px",
            }}
          >
            <iframe
              id="pdfIframe"
              src={`./pdfview/web/viewer.html?id=${id}`}
              style={{
                width: "100%",
                height: "calc(99vh - 45px)",
                border: "none",
                paddingBottom: "none",
                margin: "none",
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(PDFViewer);