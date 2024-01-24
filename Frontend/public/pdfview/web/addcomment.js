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
let DrawType = "nothing";
let initialX, initialY;
let offsetX = 0, offsetY = 0;

let isAddFormModeOn = false;
let isEditing = false;
let currentMode = null;
const CHECKBOX = 0, RADIO = 1, TEXTFIELD = 2;
let checkboxCount = 1; radioCount = 1, textfieldCount = 1, radioOptionCount = 1;
let isCheckbox = false, isRadioButton = false, isTextField = false;

//////////
let new_comment_x = 0, new_comment_y = 0;

let formWidth = 25;
let formHeight = 25;
//////////

let current_checkbox_id = 0;
let current_radio_id = 0;
let current_text_id = 0;


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

const handleCheckbox = function (e) {
    document.getElementById("checkbox-option").style.display = 'none';
    const formFieldName = document.getElementById("checkbox-field-input-name").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: CHECKBOX,
        form_field_name: formFieldName,
        page_number: PDFViewerApplication.page,
        x: new_comment_x - 15,
        y: new_comment_y - 30,
        width: formWidth,
        height: formHeight
    });
    document.getElementById("checkbox-save-button").removeEventListener("click", handleCheckbox);
}

const handleRadio = function (e) {
    document.getElementById("radio-button-option").style.display = 'none';
    const formFieldName = document.getElementById("radio-field-input-name").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: RADIO,
        page_number: PDFViewerApplication.page,
        data: {
            option: formFieldName,
            x: new_comment_x - 15,
            y: new_comment_y - 30,
            width: formWidth,
            height: formHeight
        }
    });
    document.getElementById("radio-save-button").removeEventListener("click", handleRadio);
}

const handleText = function (e) {
    document.getElementById("text-field-option").style.display = 'none';
    const formFieldName = document.getElementById("text-field-input-name").value;
    const initialValue = document.getElementById("text-field-value").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: TEXTFIELD,
        form_field_name: formFieldName,
        text: initialValue,
        page_number: PDFViewerApplication.page,
        x: new_comment_x,
        y: new_comment_y,
        width: formWidth,
        height: formHeight
    });
}

const eventHandler = async function (e) {

    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();

    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(PDFViewerApplication.page - 1);
    const { width, height } = page.getSize();

    let ost = computePageOffset();
    let x = e.pageX - ost.left;
    let y = e.pageY - ost.top;

    switch (currentMode) {

        case CHECKBOX:
            formWidth = 25;
            removeCheckbox();
            isCheckbox = !isCheckbox;

            let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            new_comment_x = new_x_y[0]
            new_comment_y = new_x_y[1]

            let checkboxId = form_storage.length + 1;

            let pageId = String(PDFViewerApplication.page);
            let pg = document.getElementById(pageId);
            var rect = pg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let checkbox = document.createElement("div");
            checkbox.id = "checkbox" + checkboxId;
            checkbox.style.position = "absolute";
            checkbox.style.top = e.pageY - top + "px"
            checkbox.style.left = e.pageX - left - 23 + "px"
            checkbox.style.zIndex = 100;

            const checkboxOption = document.getElementById("checkbox-option");

            checkboxOption.style.display = "flex";

            checkboxOption.style.top = e.pageY + 40 + "px";
            checkboxOption.style.left = e.pageX - 180 + "px";

            document.getElementById("checkbox-field-input-name").value = `Checkbox Form Field ${checkboxCount++}`

            let checkbox_icon = document.createElement("div");
            checkbox_icon.style.minHeight = "23px";
            checkbox_icon.style.minWidth = "23px";
            checkbox_icon.style.backgroundColor = "white";
            checkbox_icon.style.border = "1px solid black";
            checkbox_icon.style.display = "flex";
            checkbox_icon.style.justifyContent = "center";
            checkbox_icon.style.alignItems = "center";
            checkbox_icon.innerHTML = `<i class="fas fa-check fa-sm"></i>`

            checkbox_icon.addEventListener("click", () => {

                current_checkbox_id = checkboxId;

                let istooltipshow = false;

                if (document.getElementById("checkbox_tooltipbar" + current_checkbox_id)) {
                    istooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!istooltipshow) {

                        let tooltipbar = document.createElement("div")

                        tooltipbar.id = "checkbox_tooltipbar" + current_checkbox_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = "27px"
                        tooltipbar.style.minWidth = "100px"

                        let moveBtn = document.createElement("button");
                        moveBtn.style.padding = "5px";
                        moveBtn.innerHTML = `<i class="fas fa-arrows-up-down-left-right"></i>`

                        moveBtn.addEventListener("click", (e) => {
                            isDragging = true;
                            DrawType = 'checkbox';
                            current_checkbox_id = tooltipbar.id.replace("checkbox_tooltipbar", "")
                            let mpageId = String(PDFViewerApplication.page)
                            let mpg = document.getElementById(mpageId)
                            mpg.addEventListener('mousemove', moveEventHandler);
                            console.log(current_checkbox_id)
                            document.getElementById("checkbox_tooltipbar" + current_checkbox_id).remove();
                        });

                        tooltipbar.appendChild(moveBtn);
                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_checkbox_id = tooltipbar.id.replace("checkbox_tooltipbar", "")
                            console.log("test_checkbox_id", current_checkbox_id)
                            document.getElementById('checkbox' + current_checkbox_id).remove();

                            console.log("id:", current_checkbox_id)

                            form_storage = form_storage.filter(function (checkbox) {
                                return checkbox.id !== parseInt(current_checkbox_id);
                            });

                            console.log(form_storage)
                        })

                        tooltipbar.appendChild(deleteBtn)

                        checkbox.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("checkbox_tooltipbar" + current_checkbox_id).remove();
                    }
                }

            })

            checkbox.appendChild(checkbox_icon);

            pg.appendChild(checkbox);

            document.getElementById("checkbox-save-button").addEventListener("click", handleCheckbox);
            break;
        case RADIO:
            formWidth = 25;
            removeRadio();
            isRadioButton = !isRadioButton;

            let radio_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            new_comment_x = radio_x_y[0]
            new_comment_y = radio_x_y[1]

            let radio_id = form_storage.length + 1;

            let radiopageId = String(PDFViewerApplication.page);
            let radiopg = document.getElementById(radiopageId);
            var rect = radiopg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let radio = document.createElement("div");
            radio.id = "radio" + radio_id;
            radio.style.position = "absolute";
            radio.style.top = e.pageY - top + "px"
            radio.style.left = e.pageX - left - 23 + "px"
            radio.style.zIndex = 100;

            let radio_icon = document.createElement("div");
            radio_icon.style.minHeight = "23px";
            radio_icon.style.minWidth = "23px";
            radio_icon.style.backgroundColor = "white";
            radio_icon.style.border = "1px solid black";
            radio_icon.style.display = "flex";
            radio_icon.style.justifyContent = "center";
            radio_icon.style.alignItems = "center";
            radio_icon.innerHTML = `<i class="far fa-circle-dot"></i>`

            radio_icon.addEventListener("click", () => {

                console.log("apl")

                current_radio_id = radio_id;

                let isradiotooltipshow = false;


                if (document.getElementById("radio_tooltipbar" + current_radio_id)) {
                    isradiotooltipshow = true;
                }

                console.log(isradiotooltipshow)

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!isradiotooltipshow) {

                        let tooltipbar = document.createElement("div")

                        tooltipbar.id = "radio_tooltipbar" + current_radio_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = "27px"
                        tooltipbar.style.minWidth = "100px"

                        let moveBtn = document.createElement("button");
                        moveBtn.style.padding = "5px";
                        moveBtn.innerHTML = `<i class="fas fa-arrows-up-down-left-right"></i>`

                        moveBtn.addEventListener("click", (e) => {
                            isDragging = true;
                            DrawType = 'radio';
                            current_radio_id = tooltipbar.id.replace("radio_tooltipbar", "")
                            let mpageId = String(PDFViewerApplication.page)
                            let mpg = document.getElementById(mpageId)
                            mpg.addEventListener('mousemove', moveEventHandler);
                            document.getElementById("radio_tooltipbar" + current_radio_id).remove();
                        });

                        tooltipbar.appendChild(moveBtn);
                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_radio_id = tooltipbar.id.replace("radio_tooltipbar", "")
                            document.getElementById('radio' + current_radio_id).remove();

                            form_storage = form_storage.filter(function (radio) {
                                return radio.id !== parseInt(current_radio_id);
                            });

                            console.log(form_storage)
                        })

                        tooltipbar.appendChild(deleteBtn)

                        radio.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("radio_tooltipbar" + current_radio_id).remove();
                    }
                }

            })

            const radioButtonOption = document.getElementById("radio-button-option");

            radioButtonOption.style.display = "flex";

            radioButtonOption.style.top = e.pageY + 40 + "px";
            radioButtonOption.style.left = e.pageX - 180 + "px";

            document.getElementById("radio-field-input-name").value = `Radio Group Form Field ${radioCount++}`


            radio.appendChild(radio_icon);

            document.getElementById("radio-save-button").addEventListener("click", handleRadio);

            radiopg.appendChild(radio);
            break;
        case TEXTFIELD:
            formWidth = 100;
            removeText();
            isTextField = !isTextField;

            let text_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            new_comment_x = text_x_y[0]
            new_comment_y = text_x_y[1]

            let text_id = form_storage.length + 1;

            let textpageId = String(PDFViewerApplication.page);
            let textpg = document.getElementById(textpageId);
            var rect = textpg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let textDiv = document.createElement("div");
            textDiv.id = "text" + text_id;
            textDiv.style.position = "absolute";
            textDiv.style.top = e.pageY - top - 20 + "px"
            textDiv.style.left = e.pageX - left - 23 + "px"
            textDiv.style.zIndex = 100;

            let text_icon = document.createElement("div");
            text_icon.style.minHeight = "25px";
            text_icon.style.minWidth = "100px";
            text_icon.style.backgroundColor = "white";
            text_icon.style.border = "1px solid black";
            text_icon.style.display = "flex";
            text_icon.style.justifyContent = "center";
            text_icon.style.alignItems = "center";
            text_icon.innerHTML = `<input id="text-field-value" type="text" style="min-width: 100px; min-height: 25px; font-size: 24px"></input>`

            text_icon.addEventListener("click", () => {

                
                current_text_id = text_id;
                console.log("text_id: ", current_text_id);
                
                let istexttooltipshow = false;


                if (document.getElementById("text_tooltipbar" + current_text_id)) {
                    istexttooltipshow = true;
                }

                console.log(istexttooltipshow)

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!istexttooltipshow) {

                        let tooltipbar = document.createElement("div")

                        tooltipbar.id = "text_tooltipbar" + current_text_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = "27px"
                        tooltipbar.style.minWidth = "100px"

                        let moveBtn = document.createElement("button");
                        moveBtn.style.padding = "5px";
                        moveBtn.innerHTML = `<i class="fas fa-arrows-up-down-left-right"></i>`

                        moveBtn.addEventListener("click", (e) => {
                            isDragging = true;
                            DrawType = 'text';
                            current_text_id = tooltipbar.id.replace("text_tooltipbar", "")
                            let mpageId = String(PDFViewerApplication.page)
                            let mpg = document.getElementById(mpageId)
                            mpg.addEventListener('mousemove', moveEventHandler);
                            document.getElementById("text_tooltipbar" + current_text_id).remove();
                        });

                        tooltipbar.appendChild(moveBtn);
                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_text_id = tooltipbar.id.replace("text_tooltipbar", "")
                            document.getElementById('text' + current_text_id).remove();

                            console.log("id:", current_text_id)

                            form_storage = form_storage.filter(function (item) {
                                return item.id !== parseInt(current_text_id);
                            });

                            console.log(form_storage)
                        })

                        tooltipbar.appendChild(deleteBtn)

                        textDiv.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("text_tooltipbar" + current_text_id).remove();
                    }
                }

            })

            const textFieldOption = document.getElementById("text-field-option");

            textFieldOption.style.display = "flex";

            textFieldOption.style.top = e.pageY + 40 + "px";
            textFieldOption.style.left = e.pageX - 50 + "px";

            document.getElementById("text-field-input-name").value = `Text Form Field ${textfieldCount++}`

            textDiv.appendChild(text_icon);

            document.getElementById("text-save-button").addEventListener("click", handleText);

            textpg.appendChild(textDiv);
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

const removeCheckbox = function () {
    removeEventListener();
    document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
}
const removeRadio = function () {
    removeEventListener();
    document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
}
const removeText = function () {
    removeEventListener();
    document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
}

const addForm = function (mode) {
    currentMode = mode;
    switch (mode) {
        case CHECKBOX:
            if (isEditing) {
                removeCheckbox();
            }
            else {
                addEventListener();
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
                removeRadio();
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
                removeText();
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

let setDocument = async function () {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfBytes = await pdfDoc.save();
    console.log('set document');
    if (form_storage.length != 0) addFormElements()
        .then(() => {
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

    let commentId = comment_storage.length + 1;
    console.log("first", commentId)

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
    comment_icon.style.backgroundImage = "url('./images/comment-svgrepo-com.svg')";
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

                    console.log("id:", current_comment_id)

                    comment_storage = comment_storage.filter(function (comment) {
                        return comment.id !== parseInt(current_comment_id);
                    });

                    console.log(comment_storage)
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

const moveEventHandler = (event) => {

    let pageId = String(PDFViewerApplication.page)
    let pg = document.getElementById(pageId)
    if (isDragging & DrawType === "comment") {

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

        comment_storage.map(function (comment) {

            if (comment.id === parseInt(current_comment_id)) {
                comment.x = new_comment_x;
                comment.y = new_comment_y;
            }
        });

    }

    if (isDragging & DrawType === "checkbox") {

        offsetX = event.clientX - initialX;
        offsetY = event.clientY - initialY;
        console.log(current_checkbox_id)
        let srect = pg.getBoundingClientRect(), bodyElt = document.body;
        let stop = srect.top;
        let sleft = srect.left;
        document.getElementById("checkbox" + current_checkbox_id).style.left = (event.x - sleft - 30) + "px";
        document.getElementById("checkbox" + current_checkbox_id).style.top = (event.y - stop - 30) + "px";

        let new_ost = computePageOffset();

        let new_check_x = event.pageX - new_ost.left
        let new_check_y = event.pageY - new_ost.top

        let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_check_x, new_check_y)

        new_check_x = new_x_y[0]
        new_check_y = new_x_y[1]

        form_storage.map(function (item) {

            if (item.id === parseInt(current_checkbox_id)) {
                item.x = new_check_x - 15;
                item.y = new_check_y - 8;
            }
        });

    }

    if (isDragging & DrawType === "radio") {

        offsetX = event.clientX - initialX;
        offsetY = event.clientY - initialY;
        console.log(current_radio_id)
        let srect = pg.getBoundingClientRect(), bodyElt = document.body;
        let stop = srect.top;
        let sleft = srect.left;
        document.getElementById("radio" + current_radio_id).style.left = (event.x - sleft - 30) + "px";
        document.getElementById("radio" + current_radio_id).style.top = (event.y - stop - 30) + "px";

        let new_ost = computePageOffset();

        let new_radio_x = event.pageX - new_ost.left
        let new_radio_y = event.pageY - new_ost.top

        let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_radio_x, new_radio_y)

        new_radio_x = new_x_y[0]
        new_radio_y = new_x_y[1]

        form_storage.map(function (item) {

            if (item.id === parseInt(current_radio_id)) {
                console.log(item.data.x)
                item.data.x = new_radio_x - 15;
                item.data.y = new_radio_y - 8;
            }
        });

    }

    if (isDragging & DrawType === "text") {

        offsetX = event.clientX - initialX;
        offsetY = event.clientY - initialY;
        console.log(current_text_id)
        let srect = pg.getBoundingClientRect(), bodyElt = document.body;
        let stop = srect.top;
        let sleft = srect.left;
        document.getElementById("text" + current_text_id).style.left = (event.x - sleft - 30) + "px";
        document.getElementById("text" + current_text_id).style.top = (event.y - stop - 30) + "px";

        let new_ost = computePageOffset();

        let new_text_x = event.pageX - new_ost.left
        let new_text_y = event.pageY - new_ost.top

        let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_text_x, new_text_y)

        new_text_x = new_x_y[0]
        new_text_y = new_x_y[1]

        form_storage.map(function (item) {
            if (item.id === parseInt(current_text_id)) {
                item.x = new_text_x - 15;
                item.y = new_text_y - 10;
            }
        });

    }

}

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
    pdfFactory.download();
}

async function addFormElements() {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    let page;
    let checkboxForm, radioForm, textfieldForm;
    let radioOption;
    if (form_storage.length != 0) {
        form_storage.forEach((form_item) => {
            page = pdfDoc.getPage(form_item.page_number - 1);
            if (form_item.form_type == RADIO) {
                if (radioOption != form_item.data.option) {
                    radioOption = form_item.data.option;
                    radioForm = form.createRadioGroup(radioOption);
                }
            }
            switch (form_item.form_type) {
                case CHECKBOX:
                    console.log("fieldName: ", form_item.form_field_name);
                    checkboxForm = form.createCheckBox(form_item.form_field_name);
                    checkboxForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                case RADIO:
                    radioForm.addOptionToPage(radioCount + '', page, {
                        x: form_item.data.x,
                        y: form_item.data.y,
                        width: form_item.data.width,
                        height: form_item.data.height
                    });
                    radioCount++;
                    break;
                case TEXTFIELD:
                    textfieldForm = form.createTextField(form_item.form_field_name);
                    textfieldForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y,
                        width: form_item.width,
                        height: form_item.height
                    });
                    textfieldForm.setText(form_item.text);
                    break;
                default:
                    break;
            }
        })
    }
    pdfBytes = await pdfDoc.save();
    console.log('add form elements');
}