export default function PDFViewer() {
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
            backgroundColor: "#5AB9C1",
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
              src="./pdfview/web/viewer.html"
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






