let comment_control = document.getElementById("comment_control_panel")

let comment_storage = [];
let form_storage = [];

let comment_x = 0, comment_y = 0;

let pdfBytes;

let isAddCommentModeOn = false;

let mouse_x = 0;
let mouse_y = 0;

let current_comment_id = 0;

let isDragging = false;
let initialX, initialY;
let offsetX = 0, offsetY = 0;

let isAddFormModeOn = false;
let isEditing = false;
let currentMode = null;
const CHECKBOX = 0, RADIO = 1, TEXTFIELD = 2;
let checkboxCount = 0; radioCount = 0, textfieldCount = 0, radioOptionCount = 1;
let isCheckbox = false, isRadioButton = false, isTextField = false;


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

const eventHandler = async function (e) {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(PDFViewerApplication.page - 1);
    const { width, height } = page.getSize();
    let ost = computePageOffset();
    let x = e.pageX - ost.left;
    let y = e.pageY - ost.top;

    let formWidth = 25;
    let formHeight = 25;
    let formTextWidth = 100;
    switch (currentMode) {
        case CHECKBOX:
            form_storage.push({
                form_type: CHECKBOX,
                page_number: PDFViewerApplication.page,
                x: (x - formWidth) / 2,
                y: height - (y + formHeight) / 2,
                width: formWidth,
                height: formHeight
            });
            console.log('checkbox added');
            break;
        case RADIO:
            form_storage.push({
                form_type: RADIO,
                page_number: PDFViewerApplication.page,

                data: {
                    option: radioOptionCount + '',
                    x: (x - formWidth) / 2,
                    y: height - (y + formHeight) / 2,
                    width: formWidth,
                    height: formHeight
                }
            });
            form_storage.push({
                form_type: RADIO,
                page_number: PDFViewerApplication.page,
                data: {
                    option: radioOptionCount + '',
                    x: (x - formWidth) / 2,
                    y: height - (y + formHeight + 80) / 2,
                    width: formWidth,
                    height: formHeight
                }
            });
            radioCount++;
            console.log('radiobutton added');
            break;
        case TEXTFIELD:
            form_storage.push({
                form_type: TEXTFIELD,
                page_number: PDFViewerApplication.page,
                x: (x - formTextWidth) / 2,
                y: height - (y + formHeight) / 2,
                width: formTextWidth,
                height: formHeight
            });
            console.log('textfield added');
            break;
        default:
            break;
    }
}
const addEventListener = function () {
    document.getElementById("viewer").addEventListener('click', eventHandler);
    console.log("added");
    isEditing = true;
}
const removeEventListener = function () {
    document.getElementById("viewer").removeEventListener('click', eventHandler);
    console.log("removed");
    isEditing = false;
}
const addForm = function (mode) {
    currentMode = mode;
    switch (mode) {
        case CHECKBOX:
            if (isEditing) {
                removeEventListener();
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
            }
            else {
                addEventListener();
                console.log("checkbox added");
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-solid fa-square-check'></i>";
            }
            if (isCheckbox) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-solid fa-square-check'></i>";
            }
            isCheckbox = !isCheckbox;
            break;
        case RADIO:
            if (isEditing) {
                removeEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
            }
            else {
                addEventListener();
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-solid fa-circle-dot'></i>";
            }
            if (isRadioButton) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-solid fa-circle-dot'></i>";
            }
            isRadioButton = !isRadioButton;
            break;
        case TEXTFIELD:
            if (isEditing) {
                removeEventListener();
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa-solid fa-i'></i>";
            }
            if (isTextField) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa-solid fa-i'></i>";
            }
            isTextField = !isTextField;
            break;
        default:
            break;
    }
}

//////////////
let setDocument = async function () {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfBytes = await pdfDoc.save();
    console.log('set document');
    console.log(form_storage);
    if(form_storage.length != 0) addFormElements().then(() => {
        add_txt_comment();
    });
    else {
        add_txt_comment();
    }
}

document.getElementById("viewer").addEventListener("click", (evt) => {

    mouse_x = evt.x;
    mouse_y = evt.y;

    if (isAddCommentModeOn) {

        let ost = computePageOffset()

        comment_x = evt.pageX - ost.left
        comment_y = evt.pageY - ost.top

        comment_control.style.left = evt.x + "px";
        comment_control.style.top = evt.y + "px";
        comment_control.style.display = "block";

        let x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(comment_x, comment_y)

        comment_x = x_y[0]
        comment_y = x_y[1]

        console.log(comment_x, comment_y)
    }

})

document.getElementById("add_comment").addEventListener("click", (e) => {

    let comment_title = document.getElementById("comment_title").value
    let comment_text = document.getElementById("comment_text").value

    comment_storage.push({
        x: comment_x,
        y: comment_y,
        title: comment_title,
        text: comment_text
    })

    let commentId = comment_storage.length;
    console.log("first", commentId)

    let pageId = String(PDFViewerApplication.page)
    let pg = document.getElementById(pageId)
    var rect = pg.getBoundingClientRect(), bodyElt = document.body;
    var top = rect.top;
    var left = rect.left;
    console.log("mouse_XY", mouse_x, mouse_y)
    console.log("page_XY", "top", top, "left", left)

    let comment_div = document.createElement("div");
    comment_div.id = "comment" + commentId
    comment_div.style.position = "absolute";
    comment_div.style.zIndex = 100;
    comment_div.style.top = (mouse_y - top) + "px";
    comment_div.style.left = (mouse_x - left) + "px";


    let comment_icon = document.createElement("div");
    comment_icon.style.minHeight = "40px"
    comment_icon.style.minWidth = "40px"
    comment_icon.style.backgroundImage = "url('./images/annotation-note.svg')";
    comment_div.appendChild(comment_icon);

    comment_icon.addEventListener("click", (e) => {
        console.log(comment_title, commentId)
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

                tooltipbar.innerHTML =
                    `
                        <div id="tooltipbar" class="tooltipbar">
                            <button style="padding:5px;" onclick="isDragging = true; document.getElementById('tooltipbar'+current_comment_id).remove();"><i class="fas fa-arrows-up-down-left-right"></i></button>
                            <button style="padding:5px;" onclick ="document.getElementById('comment'+${current_comment_id}).remove(); comment_storage.splice(${current_comment_id - 1}, 1);"><i class="fas fa-trash-can"></i></button>
                        </div>
                        `
                tooltipbar.id = "tooltipbar" + current_comment_id;
                tooltipbar.style.position = "absolute";
                tooltipbar.style.zIndex = 100;
                tooltipbar.style.top = "40px"
                tooltipbar.style.minWidth = "100px"

                comment_div.appendChild(tooltipbar)
            }
            else {
                document.getElementById("tooltipbar" + current_comment_id).remove();
            }
        }
    })

    pg.appendChild(comment_div);

    pg.addEventListener("mousemove", function (event) {

        if (isDragging) {
            offsetX = event.clientX - initialX;
            offsetY = event.clientY - initialY;
            console.log(current_comment_id)
            let srect = pg.getBoundingClientRect(), bodyElt = document.body;
            let stop = srect.top;
            let sleft = srect.left;
            document.getElementById("comment" + current_comment_id).style.left = (event.x - sleft - 30) + "px";
            document.getElementById("comment" + current_comment_id).style.top = (event.y - stop - 30) + "px";
            let new_ost = computePageOffset();
            let new_comment_x = event.pageX - new_ost.left
            let new_comment_y = event.pageY - new_ost.top

            let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_comment_x, new_comment_y)
            new_comment_x = new_x_y[0]
            new_comment_y = new_x_y[1]

            comment_storage[current_comment_id - 1].x = new_comment_x;
            comment_storage[current_comment_id - 1].y = new_comment_y;
        }

    });


    document.getElementById("comment_title").value = ""
    document.getElementById("comment_text").value = ""
    document.getElementById("comment_control_panel").style.display = "none"
    document.getElementById("add_comment_mode").innerHTML = '<i class="far fa-comment"></i>'
    isAddCommentModeOn = false;

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

// document.getElementById("add_form_mode").addEventListener("click", (e) => {
//     console.log("clicked")
//     const form_container = document.getElementById("form_container");
//     if (isAddFormModeOn) {
//         document.getElementById("add_form_mode").innerHTML = '<i class="far fa-circle-check"></i>'
//         isAddFormModeOn = false;
//     }
//     else {
//         document.getElementById("add_form_mode").innerHTML = '<i class="fas fa-circle-check"></i>'
//         isAddFormModeOn = true;
//     }
//     if (isAddFormModeOn) {
//         form_container.style.visibility = "visible";
//     } else {
//         form_container.style.visibility = "hidden";
//         removeEventListener();
//     }
// })

function add_txt_comment() {
    pdfFactory = new pdfAnnotate.AnnotationFactory(pdfBytes);
    console.log(pdfFactory)
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
    console.log('add comments');
    pdfFactory.download();
}

async function addFormElements() {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    let page;
    let checkboxForm, radioForm, textfieldForm;
    let selectedRadio = null;
    let radioOption;
    console.log(form_storage);
    if (form_storage.length != 0) {
        form_storage.forEach((form_item) => {
            page = pdfDoc.getPage(form_item.page_number - 1);
            if(form_item.form_type == RADIO){
                if(radioOption != form_item.data.option){
                    radioOption = form_item.data.option;
                    radioForm = form.createRadioGroup(radioOption);
                }
            }
            switch (form_item.form_type) {
                case CHECKBOX:
                    checkboxForm = form.createCheckBox(`checkbox${checkboxCount}`);
                    checkboxForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y,
                        width: form_item.width,
                        height: form_item.height
                    });
                    checkboxCount++;
                    break;
                case RADIO:
                    radioForm.addOptionToPage(form_item.data.option, page, {
                        x: form_item.data.x,
                        y: form_item.data.y,
                        width: form_item.data.width,
                        height: form_item.data.height
                    });
                    console.log("switch:",form_item.data.option, ":", typeof(form_item.data.option));
                    selectedRadio = form_item.data.option;
                    break;
                case TEXTFIELD:
                    textfieldForm = form.createTextField(`textfield${textfieldCount}`);
                    textfieldForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y,
                        width: form_item.width,
                        height: form_item.height
                    });
                    textfieldCount++;
                    break;
                default:
                    break;
            }
        })
    }
    if(selectedRadio != undefined) radioForm.select(selectedRadio);
    pdfBytes = await pdfDoc.save();
    console.log('add form elements');
}