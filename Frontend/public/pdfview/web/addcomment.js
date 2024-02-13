let comment_control = document.getElementById("comment_control_panel")

let comment_storage = [];

let comment_x = 0, comment_y = 0;

let pdfBytes;

let isAddCommentModeOn = false;
let isTextModeOn = false;

let mouse_x = 0;
let mouse_y = 0;

let current_comment_id = 0;
let current_text_content_id = 0;
let current_text_content_id_copy = 0;
let count_text = 0;

let isDragging = false;
let DrawType = "nothing";
let initialX, initialY;

let isEditing = false;

//////////

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
                    item.data.x = item.data.x + offsetX * 0.75 * 0.75;
                    item.data.y = item.data.y - offsetY * 0.75 * 0.75;
                }

            });

        } else {
            form_storage.map(function (item) {
                if (item.id === parseInt(currentId)) {
                    item.x = item.x + offsetX * 0.75 * 0.75;
                    item.y = item.y - offsetY * 0.75 * 0.75;
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
        let pageId = String(PDFViewerApplication.page)
        let pg = document.getElementById(pageId)
        var rect = pg.getBoundingClientRect(), bodyElt = document.body;
        var top = rect.top;
        var left = rect.left;

        const newText = document.createElement('div');
        newText.id = "textfield" + count_text++;
        newText.contentEditable = "true";
        newText.spellcheck = "false";
        newText.textContent = "Your text is here.";
        newText.style.position = "absolute";
        newText.style.zIndex = 101;
        newText.style.top = (mouse_y - top) + "px";
        newText.style.left = (mouse_x - left) + "px";
        newText.classList.add('textfield-content');
        pg.append(newText);
        addResizebar(newText.id);
        resizeCanvas(newText.id, TEXT_CONTENT);
        current_text_content_id = newText.id;
        current_text_content_id_copy = newText.id;
        console.log(current_text_content_id);
        isTextModeOn = false;
        document.getElementById("add_text").innerHTML = '<i class="far fa-i"></i>';
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
        document.getElementById('text-edit-controller').style.display = "none";
        isTextModeOn = false;
    } else {
        document.getElementById("add_text").innerHTML = '<i class="fa fa-i"></i>';
        document.getElementById('text-edit-controller').style.display = "flex";
        document.getElementById('text-edit-controller').style.top = "37px";
        document.getElementById('text-edit-controller').style.right = "0px";
        document.getElementById('text-edit-controller').style.zIndex = 150;
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

const setDocument = async function () {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfBytes = await pdfDoc.save();
    if (form_storage.length != 0) addFormElements()
        .then(() => {
            add_txt_comment();
        });
    else {
        add_txt_comment();
    }
}