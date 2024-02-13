
window.jsPDF = window.jspdf.jsPDF;

function Convert_HTML_To_PDF() {
    var doc = new jsPDF();
	
    // Source HTMLElement or a string containing HTML.
    var elementHTML = document.querySelector("#viewer");

    doc.html(elementHTML, {
        callback: function(doc) {
            // Save the PDF
            doc.save('document-html.pdf');
        },
		margin: [10, 10, 10, 10],
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 612, //target width in the PDF document
        windowWidth: 612 //window width in CSS pixels
    });
}

//Bold, Underline and Italic Button
const boldBtn = document.querySelector('#bold-btn');
const underlineBtn = document.querySelector('#underline-btn');
const italicBtn = document.querySelector('#italic-btn');

//Text Alignment buttons
const leftAlignBtn = document.querySelector('#left-align-btn');
const justifyAlignBtn = document.querySelector('#justify-align-btn');
const centerAlignBtn = document.querySelector('#center-align-btn');
const rightAlignBtn = document.querySelector('#right-align-btn');

//Text Styling buttons
const colorBtn = document.querySelector('#color-btn');
const fontTypeBtn = document.querySelector('#input-font-btn');
const fontSizeBtn = document.querySelector('#font-size-btn');
const hideBtn = document.querySelector('#controller-hide');
const content = document.getElementById(current_text_content_id_copy); 

boldBtn.addEventListener("click",() =>{
	document.execCommand("bold");
})

underlineBtn.addEventListener("click",() =>{
	document.execCommand("underline");
})

italicBtn.addEventListener("click",() =>{
	document.execCommand("italic");
})

leftAlignBtn.addEventListener("click",() =>{
	document.execCommand("justifyLeft");
})

justifyAlignBtn.addEventListener("click",() =>{
	document.execCommand("justifyFull");
})

centerAlignBtn.addEventListener("click",() =>{
	document.execCommand("justifyCenter");
})

rightAlignBtn.addEventListener("click",() =>{
	document.execCommand("justifyRight");
})

colorBtn.addEventListener("input",() =>{
	document.execCommand("forecolor",false,colorBtn.value);
})

fontTypeBtn.addEventListener("input",() =>{
	document.execCommand("fontName",false,fontTypeBtn.value);
})

fontSizeBtn.addEventListener("input",() =>{
	document.execCommand("fontSize",false,fontSizeBtn.value);
})
hideBtn.addEventListener('click', () => {
	// document.getElementById('text-edit-controller').style.display = 'none';
	Convert_HTML_To_PDF();
})
