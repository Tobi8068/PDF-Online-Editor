let comment_control = document.getElementById("comment_control_panel")

let comment_storage = [];
let text_storage = [];
let font_storage = [];

let comment_x = 0, comment_y = 0;

let pdfBytes;

let isAddCommentModeOn = false;
let isTextModeOn = false;

let mouse_x = 0;
let mouse_y = 0;

let current_comment_id = 0;
let current_text_content_id = '';
let current_text_num_id = 0;

let isDragging = false;
let DrawType = "nothing";
let initialX, initialY;

let isEditing = false;

let isBold = false;
let isItalic = false;
//////////

const loadFontFiles = function () {
    console.log('first', fontLists);
    fontLists.forEach(item => {
        console.log(`Font Name: ${item.fontName}, Font URL: ${item.fontURL}`);
        fetch(`./fonts/${item.fontURL}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                font_storage.push({
                    fontName: item.fontName,
                    fontArrayBuffer: arrayBuffer
                })
                console.log('TTF file content:', arrayBuffer);
            })
            .catch(error => {
                console.error('Error fetching TTF file:', error);
            });
    })
}

const generateFontName = function (id) {
    let fontName = document.getElementById(id).value;
    const fontStyles = {
        'Bold': 'Bold',
        'Oblique': 'Oblique',
        'Italic': 'Italic',
        'BoldOblique': 'BoldOblique',
        'BoldItalic': 'BoldItalic'
    };

    let selectedStyle = '';
    if (isBold && isItalic) {
        selectedStyle = (fontName === fontStyleArr[2]) ? 'BoldItalic' : 'BoldOblique';
    } else if (isBold) {
        selectedStyle = 'Bold';
    } else if (isItalic) {
        selectedStyle = (fontName === fontStyleArr[2]) ? 'Italic' : 'Oblique';
    }

    if (isBold || isItalic) {
        fontName += fontStyles[selectedStyle];
    }
    return fontName;
}

const handleBold = function () {
    const boldBtn = document.getElementById('text-bold');
    if (isBold) {
        boldBtn.classList.remove('text-weight-button-focused');
        document.getElementById(current_text_content_id).classList.remove('bold-text');
        isBold = false;
    } else {
        boldBtn.classList.add('text-weight-button-focused');
        document.getElementById(current_text_content_id).classList.add('bold-text');
        isBold = true;
    }
}
const handleItalic = function () {
    const italicBtn = document.getElementById('text-italic');
    if (isItalic) {
        italicBtn.classList.remove('text-weight-button-focused');
        document.getElementById(current_text_content_id).classList.remove('italic-text');
        isItalic = false;
    } else {
        italicBtn.classList.add('text-weight-button-focused');
        document.getElementById(current_text_content_id).classList.add('italic-text');
        isItalic = true;
    }
}

const addBoldItalicEvent = function () {
    const boldBtn = document.getElementById('text-bold');
    const italicBtn = document.getElementById('text-italic');
    boldBtn.addEventListener('click', handleBold);
    italicBtn.addEventListener('click', handleItalic);
}
const removeBoldItalicEvent = function () {
    const boldBtn = document.getElementById('text-bold');
    const italicBtn = document.getElementById('text-italic');
    boldBtn.removeEventListener('click', handleBold);
    italicBtn.removeEventListener('click', handleItalic);
    if (isBold) {
        boldBtn.classList.remove('text-weight-button-focused');
    }
    if (isItalic) {
        italicBtn.classList.remove('text-weight-button-focused');
    }
    isBold = false, isItalic = false;
}

const handleTextContent = (e) => {
    isOptionPane = false;
    document.getElementById(TEXT_CONTENT_OPTION).style.display = 'none';
    e.stopPropagation();
    fontStyle = generateFontName('text-content-font-style');
    fontSize = parseInt(document.getElementById('text-content-font-size').value);
    textColor = document.getElementById('text-content-color').value;
    const regularFont = document.getElementById('text-content-font-style').value;
    const text = document.getElementById(current_text_content_id).innerText;
    const lines = text.split('\n').map(line => line.trim().replace(/\n/g, ''));
    const resultArray = [];
    let prevElement = null;

    for (const element of lines) {
        if (element !== "" || prevElement !== "") {
            resultArray.push(element);
        }
        prevElement = element;
    }

    for (let i = 0; i < text_storage.length; i++) {
        if (text_storage[i].id == current_text_num_id) {
            text_storage[i].fontStyle = fontStyle;
            text_storage[i].fontSize = fontSize * 0.75 * 0.8;
            text_storage[i].textColor = textColor;
            text_storage[i].text = resultArray;
            text_storage[i].isBold = isBold;
            text_storage[i].isItalic = isItalic;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < text_storage.length; j++) {
        if (text_storage[j].id != current_text_num_id) count++;
    }
    if (count == text_storage.length || text_storage == null) {
        text_storage.push({
            id: baseId,
            page_number: PDFViewerApplication.page,
            text: resultArray,
            x: pos_x_pdf,
            y: pos_y_pdf,
            baseX: pos_x_pdf,
            baseY: pos_y_pdf,
            fontStyle: fontStyle,
            regularFontStyle: regularFont,
            isBold: isBold,
            isItalic: isItalic,
            fontSize: fontSize * 0.75 * 0.8 ,
            baseFontSize: fontSize,
            textColor: textColor,
            width: 150 * 0.75 * 0.75,
            height: 20 * 0.75 * 0.75,
            xPage: 150,
            yPage: 20,
        });
        fontStyle = '';
        fontSize = 12;
        textColor = '';
    }
    console.log(text_storage, isBold, isItalic);
    document.getElementById("text-content-save-button").removeEventListener("click", handleTextContent);
    removeBoldItalicEvent();
}

document.getElementById("outerContainer").appendChild(comment_control)

let computePageOffset = function () {
    let pageId = "page" + String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);
    var rect = pg.getBoundingClientRect(), bodyElt = document.body;
    return {
        top: rect.top + bodyElt.scrollTop,
        left: rect.left + bodyElt.scrollLeft
    }
}

document.getElementById("add_comment").addEventListener("click", (e) => {

    let comment_title = document.getElementById("comment_title").value
    let comment_text = document.getElementById("comment_text").value

    let commentId = comment_storage.length + 1;

    comment_storage.push({
        id: commentId,
        x: comment_x,
        y: comment_y,
        title: comment_title,
        text: comment_text
    })

    let pageId = String(PDFViewerApplication.page)
    let pg = document.getElementById(pageId)
    var rect = pg.getBoundingClientRect(), bodyElt = document.body;
    var top = rect.top;
    var left = rect.left;

    let comment_div = document.createElement("div");
    comment_div.id = "comment" + commentId
    comment_div.style.position = "absolute";
    comment_div.style.zIndex = 100;
    comment_div.style.top = (mouse_y - top) + "px";
    comment_div.style.left = (mouse_x - left) + "px";


    let comment_icon = document.createElement("div");
    comment_icon.style.minHeight = "40px"
    comment_icon.style.minWidth = "40px"
    comment_icon.style.backgroundImage = "url('./images/comment-svgrepo-com.svg')";
    comment_div.appendChild(comment_icon);

    comment_icon.addEventListener("click", (e) => {

        current_comment_id = commentId;
        let istooltipshow = false;
        if (document.getElementById("tooltipbar" + current_comment_id)) {
            istooltipshow = true;
        }

        if (isDragging) {
            isDragging = false;
        }

        else {

            if (!istooltipshow) {

                let tooltipbar = document.createElement("div")
                tooltipbar.id = "tooltipbar" + current_comment_id;
                tooltipbar.style.position = "absolute";
                tooltipbar.style.zIndex = 100;
                tooltipbar.style.top = "40px"
                tooltipbar.style.minWidth = "100px"
                let moveBtn = document.createElement("button");
                moveBtn.style.padding = "5px";
                moveBtn.innerHTML = `<i class="fas fa-arrows-up-down-left-right"></i>`
                moveBtn.addEventListener("click", (e) => {
                    isDragging = true;
                    DrawType = 'comment';
                    current_comment_id = tooltipbar.id.replace("tooltipbar", "")
                    document.getElementById("tooltipbar" + current_comment_id).remove();
                });
                tooltipbar.appendChild(moveBtn);
                let deleteBtn = moveBtn = document.createElement("button");
                deleteBtn.style.padding = "5px";
                deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`
                deleteBtn.addEventListener("click", () => {
                    current_comment_id = tooltipbar.id.replace("tooltipbar", "")
                    document.getElementById('comment' + current_comment_id).remove();
                    comment_storage = comment_storage.filter(function (comment) {
                        return comment.id !== parseInt(current_comment_id);
                    });
                })
                tooltipbar.appendChild(deleteBtn)
                comment_div.appendChild(tooltipbar)
            }
            else {
                document.getElementById("tooltipbar" + current_comment_id).remove();
            }
        }
    })

    pg.appendChild(comment_div);

    pg.addEventListener("mousemove", moveEventHandler);

    document.getElementById("comment_title").value = ""
    document.getElementById("comment_text").value = ""
    document.getElementById("comment_control_panel").style.display = "none"
    document.getElementById("add_comment_mode").innerHTML = '<i class="far fa-comment"></i>'
    isAddCommentModeOn = false;

})

const moveEventHandler = (event, offsetX, offsetY, currentId) => {

    let pageId = String(PDFViewerApplication.page)
    let pg = document.getElementById(pageId)

    let srect = pg.getBoundingClientRect(), bodyElt = document.body;

    let stop = srect.top;
    let sleft = srect.left;

    let new_ost = computePageOffset();

    let new_x = event.pageX - new_ost.left
    let new_y = event.pageY - new_ost.top

    let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_x, new_y)

    if (isDragging & DrawType === "comment") {

        document.getElementById("comment" + current_comment_id).style.left = (event.x - sleft - 30) + "px";
        document.getElementById("comment" + current_comment_id).style.top = (event.y - stop - 30) + "px";

        comment_storage.map(function (comment) {

            if (comment.id === parseInt(current_comment_id)) {
                comment.x = new_x_y[0];
                comment.y = new_x_y[1];
            }
        });

    }
    if (offsetX != 0 || offsetY != 0) {
        if (DrawType === RADIO) {

            form_storage.map(function (item) {
                if (item.id === parseInt(currentId)) {
                    item.data.x = item.data.baseX + offsetX * 0.75 * 0.8;
                    item.data.y = item.data.baseY - offsetY * 0.75 * 0.8;
                }
            });

        }
        else if (DrawType === TEXT_CONTENT) {
            text_storage.map(function (item) {
                // console.log("moveEvent", item.id, currentId, "offset", offsetX, offsetY);
                if (item.id === parseInt(currentId)) {
                    item.x = item.baseX + offsetX * 0.75 * 0.8;
                    item.y = item.baseY - offsetY * 0.75 * 0.8;
                }
            });
            // console.log("moveEvent", text_storage);
        }
        else {
            form_storage.map(function (item) {
                // console.log("moveEvent", item.id, currentId, "offset", offsetX, offsetY);
                if (item.id === parseInt(currentId)) {
                    item.x = item.baseX + offsetX * 0.75 * 0.8;
                    item.y = item.baseY - offsetY * 0.75 * 0.8;
                }
            });
        }
    }
}

document.getElementById("viewer").addEventListener("click", (evt) => {

    mouse_x = evt.x;
    mouse_y = evt.y;

    let ost = computePageOffset();

    comment_x = evt.pageX - ost.left
    comment_y = evt.pageY - ost.top
    let x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(comment_x, comment_y)
    comment_x = x_y[0]
    comment_y = x_y[1]

    if (isAddCommentModeOn) {
        comment_control.style.left = evt.x + "px";
        comment_control.style.top = evt.y + "px";
        comment_control.style.display = "block";
    }
    if (isTextModeOn) {
        isTextModeOn = !isTextModeOn;
        let pageId = String(PDFViewerApplication.page)
        let pg = document.getElementById(pageId)
        var rect = pg.getBoundingClientRect(), bodyElt = document.body;
        var top = rect.top;
        var left = rect.left;

        pos_x_pdf = x_y[0]
        pos_y_pdf = x_y[1]

        const textcontentWidth = 150;
        const textcontentHeight = 20;
        baseId++;
        let textContentId = baseId;

        const newText = document.createElement('div');
        newText.id = "textcontent" + textContentId;
        newText.contentEditable = "true";
        newText.spellcheck = "false";
        newText.textContent = "Your text is here.";
        newText.style.position = "relative";
        newText.classList.add('textcontent');

        const container = document.createElement('div');
        container.id = "text-content" + textContentId;
        container.style.position = "absolute";
        container.style.top = (mouse_y - top) - 21 + "px";
        container.style.left = (mouse_x - left) - absoluteOffset.x + "px";
        container.style.width = textcontentWidth + "px";
        container.style.height = textcontentHeight + "px";
        container.style.zIndex = 101;
        container.tabIndex = 0;
        container.classList.add('textfield-content');
        container.append(newText);

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                container.style.width = width + "px";
                container.style.height = height + "px";
            }
        });

        observer.observe(newText);

        pg.append(container);

        showOptionAndResizebar(TEXT_CONTENT_OPTION, container, textcontentWidth, textcontentHeight, "text-content");

        addBoldItalicEvent();

        newText.style.fontFamily = document.getElementById('text-content-font-style').value;
        newText.style.fontSize = document.getElementById('text-content-font-size').value + "px";
        newText.style.color = document.getElementById('text-content-color').value;

        document.getElementById('text-content-font-style').addEventListener('change', () => {
            document.getElementById(current_text_content_id).style.fontFamily = document.getElementById('text-content-font-style').value;
        })
        document.getElementById('text-content-font-size').addEventListener('change', () => {
            document.getElementById(current_text_content_id).style.fontSize = document.getElementById('text-content-font-size').value + 'px';
        })
        document.getElementById('text-content-color').addEventListener('change', () => {
            document.getElementById(current_text_content_id).style.color = document.getElementById('text-content-color').value;
        })

        // addResizebar(container.id);
        current_text_content_id = newText.id;

        current_text_num_id = textContentId;
        container.addEventListener("click", () => {

            current_text_content_id = newText.id;
            current_text_num_id = textContentId;
            console.log(current_text_num_id);

            let istooltipshow = false;
            // console.log("textContentID", textContentId);
            if (document.getElementById("text-content_tooltipbar" + current_text_num_id)) {
                istooltipshow = true;
            }
            if (isDragging) {
                isDragging = false;
            }
            else {
                if (!istooltipshow) {

                    let tooltipbar = document.createElement("div");
                    addDeleteButton(current_text_num_id, tooltipbar, container, "text-content")
                    text_storage.map((element) => {
                        if (element.id == textContentId) {
                            isOptionPane = true;
                            option = showOption(TEXT_CONTENT_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                            isBold = element.isBold, isItalic = element.isItalic;
                            addBoldItalicEvent();
                            if (isBold) document.getElementById('text-bold').classList.add('text-weight-button-focused');
                            if (isItalic) document.getElementById('text-italic').classList.add('text-weight-button-focused');
                            document.getElementById("text-content-font-style").value = element.regularFontStyle;
                            document.getElementById("text-content-font-size").value = element.baseFontSize;
                            document.getElementById("text-content-color").value = element.textColor;
                            container.append(option);
                        }
                    })
                    document.getElementById("text-content-save-button").addEventListener("click", handleTextContent);
                }
                else {
                    document.getElementById("text-content_tooltipbar" + current_text_num_id).remove();
                }
            }
        })
        // console.log("current_num_id", current_text_num_id);
        resizeCanvas(container.id, TEXT_CONTENT, current_text_num_id, TEXT_CONTENT_OPTION);

        document.getElementById("add_text").innerHTML = '<i class="far fa-i"></i>';
        document.getElementById("text-content-save-button").addEventListener("click", handleTextContent);
    }
})

document.getElementById("add_comment_mode").addEventListener("click", (e) => {

    if (isAddCommentModeOn) {
        document.getElementById("add_comment_mode").innerHTML = '<i class="far fa-comment"></i>';
        comment_control.style.display = "none";
        isAddCommentModeOn = false;
    }
    else {
        document.getElementById("add_comment_mode").innerHTML = '<i class="fas fa-comment"></i>'
        isAddCommentModeOn = true;
    }

})
document.getElementById("add_text").addEventListener("click", (e) => {
    if (isTextModeOn) {
        document.getElementById("add_text").innerHTML = '<i class="far fa-i"></i>';
        isTextModeOn = false;
    } else {
        document.getElementById("add_text").innerHTML = '<i class="fa fa-i"></i>';
        isTextModeOn = true;
    }
})

function add_txt_comment() {
    pdfFactory = new pdfAnnotate.AnnotationFactory(pdfBytes);
    if (comment_storage.length != 0) {
        comment_storage.forEach((comment_item) => {
            pdfFactory.createTextAnnotation(
                PDFViewerApplication.page - 1,
                [comment_item.x,
                comment_item.y,
                comment_item.x + 22,
                comment_item.y + 22],
                comment_item.title,
                comment_item.text)
        });
    }
    pdfFactory.download();
}

// Function to split the text into lines based on the maximum width
function splitTextIntoLines(text, maxWidth, font, fontSize) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        const width = font.widthOfTextAtSize(word, fontSize);
        if (font.widthOfTextAtSize(currentLine + ' ' + word, fontSize) < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine.trim());
            currentLine = word;
        }
    });

    lines.push(currentLine.trim());

    return lines;
}

const setDocument = async function () {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfBytes = await pdfDoc.save();
    if (form_storage.length != 0 || text_storage.length != 0) addFormElements()
        .then(() => {
            add_txt_comment();
        });
    else {
        add_txt_comment();
    }
}