const wrapper = document.getElementById("signature-pad");
const clearButton = wrapper.querySelector("[data-action=clear]");
const changeColorButton = wrapper.querySelector("[data-action=change-color]");
const changeWidthButton = wrapper.querySelector("[data-action=change-width]");
const undoButton = wrapper.querySelector("[data-action=undo]");
const savePNGButton = wrapper.querySelector("[data-action=save-png]");
const saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
const saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
const saveSVGWithBackgroundButton = wrapper.querySelector(
  "[data-action=save-svg-with-background]"
);
const canvas = wrapper.querySelector("canvas");
const DRAW = "signature-draw",
  TYPE = "signature-type",
  UPLOAD = "signature-upload";
const signatureFonts = ["MrDafoe", "SCRIPTIN", "DrSugiyama"];
const signatureTypeFont = document.getElementById("signature-type-font");
const signatureTypeText = document.getElementById("signature-type-text");
const signatureTypeColor = document.getElementById("signature-type-color");
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("signature-image-input");
const imagePreview = document.getElementById("image-preview");
const signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: "rgb(255, 255, 255, 0)",
});

let currentSignType = DRAW;

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvasSign() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  const ratio = Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  //signaturePad.clear();

  // If you want to keep the drawing on resize instead of clearing it you can reset the data.
  signaturePad.fromData(signaturePad.toData());
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvasSign;
resizeCanvasSign();

function downloadSign(dataURL, filename) {
  const blob = dataURLToBlob(dataURL);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
function switchSignMethod(event, method) {
  currentSignType = method;
  let i, tabcontents, tablinks;
  tabcontents = document.getElementsByClassName("signature-tab-content");
  for (i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(
      " tablink-active",
      ""
    );
  }
  document.getElementById(`${method}-body`).style.display = "flex";
  document.getElementById(`${method}-footer`).style.display = "flex";
  event.currentTarget.className += " tablink-active";
}

function handleSignatureType() {
  let canvas, ctx;
  canvas = document.getElementById("signature-type-canvas");
  ctx = canvas.getContext("2d");
  function drawTextOnCanvas(text, fontFamily, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fontSize = 40;
    const maxWidth = canvas.width * 0.9;

    do {
      ctx.font = fontSize + "px " + fontFamily;
      var textWidth = ctx.measureText(text).width;
      fontSize -= 1;
    } while (textWidth > maxWidth && fontSize > 10);

    // Set font styles
    ctx.font = "bold " + fontSize + "px " + fontFamily;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let x = canvas.width / 2;
    let y = canvas.height / 2;

    ctx.fillText(text, x, y);
  }

  if (signatureTypeFont) {
    let selectTypeFont = "";
    signatureTypeFont.addEventListener("change", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
    signatureFonts.map((item) => {
      selectTypeFont += `<option value='${item}' style="height: 50px;font-family: ${item}">${item}</option>`;
    });
    signatureTypeFont.innerHTML = selectTypeFont;
  }

  if (signatureTypeText) {
    signatureTypeText.addEventListener("input", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
  }

  if (signatureTypeColor) {
    signatureTypeColor.addEventListener("change", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
  }
}

handleSignatureType();

function handleSignatureImageInput() {
  // Prevent default behaviors
  if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
  
    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });
  
    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
  
    dropArea.addEventListener("drop", handleDrop, false);
  }
  if (fileInput) {
    fileInput.addEventListener("change", handleFileUpload, false);
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dropArea.classList.add("highlight");
  }

  function unhighlight() {
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files[0]);
  }
  function handleFileUpload() {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      handleFiles(selectedFile);
    }
  }

  function handleFiles(file) {
    previewImage(file);
  }

  function previewImage(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      imagePreview.innerHTML = "";
      image.style.width = '100%';
      image.style.height = '100%';
      imagePreview.appendChild(image);
    };

    reader.readAsDataURL(file);
  }
}

handleSignatureImageInput();

clearButton.addEventListener("click", () => {
  signaturePad.clear();
});

undoButton.addEventListener("click", () => {
  const data = signaturePad.toData();

  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});

changeColorButton.addEventListener("change", () => {
  signaturePad.penColor = document.getElementById("signature-draw-color").value;
});

changeWidthButton.addEventListener("click", () => {
  const min = Math.round(Math.random() * 100) / 10;
  const max = Math.round(Math.random() * 100) / 10;

  signaturePad.minWidth = Math.min(min, max);
  signaturePad.maxWidth = Math.max(min, max);
});

savePNGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL();
    downloadSign(dataURL, "signature.png");
  }
});

saveJPGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/jpeg");
    downloadSign(dataURL, "signature.jpg");
  }
});

saveSVGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/svg+xml");
    downloadSign(dataURL, "signature.svg");
  }
});

saveSVGWithBackgroundButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/svg+xml", {
      includeBackgroundColor: true,
    });
    downloadSign(dataURL, "signature.svg");
  }
});
