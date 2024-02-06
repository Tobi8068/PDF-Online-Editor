let comment_control = document.getElementById("comment_control_panel")

let comment_storage = [];
let form_storage = [];
let baseId = 0;

let comment_x = 0, comment_y = 0;

let pdfBytes;

let isAddCommentModeOn = false;

let mouse_x = 0;
let mouse_y = 0;

let current_comment_id = 0;
let current_form_id = 0;

let isDragging = false;
let DrawType = "nothing";
let initialX, initialY;

let isAddFormModeOn = false;
let isEditing = false;
let currentMode = null;
const CHECKBOX = 1, RADIO = 2, TEXTFIELD = 3, COMBOBOX = 4, LIST = 5, BUTTON = 6;
let checkboxCount = 1; radioCount = 1, textfieldCount = 1, comboCount = 1, listCount = 1, buttonCount = 1;
let isCheckbox = false, isRadioButton = false, isTextField = false, isCombo = false, isList = false, isButton = false;

let comboboxOptionCount = 0;
let listboxOptionCount = 0;
let comboboxOptionArray = [];
let listboxOptionArray = [];
//////////
let pos_x_pdf = 0, pos_y_pdf = 0;
let pos_x_page = 0; pos_y_page = 0;

let formWidth = 25;
let formHeight = 25;

const CHECKBOX_OPTION = "checkbox-option";
const RADIO_OPTION = "radio-button-option";
const TEXT_OPTION = "text-field-option";
const COMBO_OPTION = "combo-option";
const LIST_OPTION = "list-option";
const BUTTON_OPTION = "button-field-option";

let isOptionPane = false;
//////////

let current_checkbox_id = 0;
let current_radio_id = 0;
let current_text_id = 0;
let current_combo_id = 0;
let current_list_id = 0;
let current_button_id = 0;


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

// When click "Save" button, save the information of Checkbox element.

const handleCheckbox = function (e) {  
    formWidth = 25;
    formHeight = 25;
    isOptionPane = false;
    document.getElementById("checkbox-option").style.display = 'none';
    const formFieldName = document.getElementById("checkbox-field-input-name").value;
    e.stopPropagation();
    for(let i = 0; i < form_storage.length; i++){
        if(form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            break;
        }
        else if(form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id){
            break;
        }
        else if(form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id){
            form_storage[i].form_field_name = formFieldName;
            break;
        }
    }
    let count = 0;
    for(let j = 0; j < form_storage.length; j++) {
        if(form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    } 
    if( count == form_storage.length || form_storage == null ) {
        form_storage.push({
            id: baseId,
            form_type: CHECKBOX,
            form_field_name: formFieldName,
            page_number: PDFViewerApplication.page,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth,
            height: formHeight,
            xPage: formWidth,
            yPage: formHeight
        });
    }

    document.getElementById("checkbox-save-button").removeEventListener("click", handleCheckbox);
}
// When click "Save" button, save the information of RadioGroup element.

const handleRadio = function (e) {
    formWidth = 25;
    formHeight = 25;
    isOptionPane = false;
    document.getElementById("radio-button-option").style.display = 'none';
    const formFieldName = document.getElementById("radio-field-input-name").value;
    e.stopPropagation();
    form_storage.push({
        id: form_storage.length + 1,
        form_type: RADIO,
        page_number: PDFViewerApplication.page,
        data: {
            option: formFieldName,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth,
            height: formHeight
        }
    });
    document.getElementById("radio-save-button").removeEventListener("click", handleRadio);
}
// When click "Save" button, save the information of TextField element.

const handleText = function (e) {
    formWidth = 100;
    formHeight = 25;
    document.getElementById("text-field-option").style.display = 'none';
    const formFieldName = document.getElementById("text-field-input-name").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: TEXTFIELD,
        form_field_name: formFieldName,
        page_number: PDFViewerApplication.page,
        x: pos_x_pdf,
        y: pos_y_pdf,
        width: formWidth,
        height: formHeight
    });
}
// When click "Save" button, save the information of Combobox element.

const handleCombo = function (e) {
    formWidth = 80;
    formHeight = 25;
    document.getElementById("combo-option").style.display = 'none';
    const formFieldName = document.getElementById("combo-input-name").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: COMBOBOX,
        form_field_name: formFieldName,
        page_number: PDFViewerApplication.page,
        optionArray: comboboxOptionArray,
        x: pos_x_pdf - 11,
        y: pos_y_pdf - 18,
        width: formWidth,
        height: formHeight
    })
}
// When click "Save" button, save the information of Listbox element.

const handleList = function (e) {
    formWidth = 80;
    formHeight = 100;
    document.getElementById("list-option").style.display = 'none';
    const formFieldName = document.getElementById("list-input-name").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: LIST,
        form_field_name: formFieldName,
        page_number: PDFViewerApplication.page,
        optionArray: listboxOptionArray,
        x: pos_x_pdf - 12,
        y: pos_y_pdf - 93,
        width: formWidth,
        height: formHeight
    })
}
// Remove the parent event.
const removeParentEvent = function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
        e.stopPropagation();
    })
    interact(`#${id}`).draggable({
        listeners : {
            move(event) {
                event.stopPropagation();
            }
        }
    })
}
// When click "Save" button, save the information of Button element.

const handleButton = function (e) {
    formWidth = 80;
    formHeight = 25;
    document.getElementById("button-field-option").style.display = 'none';
    const formFieldName = document.getElementById("button-field-input-name").value;
    const initialValue = document.getElementById("button-text").value;
    form_storage.push({
        id: form_storage.length + 1,
        form_type: BUTTON,
        form_field_name: formFieldName,
        text: initialValue,
        page_number: PDFViewerApplication.page,
        x: pos_x_pdf - 12,
        y: pos_y_pdf - 15,
        width: formWidth,
        height: formHeight
    });
}
// Display 4 points around the canvas to resize the canvas - top, left, right, bottom.

const addResizebar = function (objectId) {
    const top = document.createElement('div');
    top.id = "top";
    top.classList.add('resize-point');
    top.classList.add('top-center');
    const left = document.createElement('div');
    left.id = "left";
    left.classList.add('resize-point');
    left.classList.add('middle-left');
    const right = document.createElement('div');
    right.id = "right";
    right.classList.add('resize-point');
    right.classList.add('middle-right');
    const bottom = document.createElement('div');
    bottom.id = "bottom";
    bottom.classList.add('resize-point');
    bottom.classList.add('bottom-center');
    const container = document.getElementById(objectId);
    container.append(top, left, right, bottom);
}
// Show the OptionPane to edit the properties of elements.

const showOption = function (id, x, y) {
    const fieldOption = document.getElementById(id);
    console.log("fieldOption: ", fieldOption);

    if(isOptionPane) fieldOption.style.display = "flex";
    else fieldOption.style.display = "none";

    fieldOption.style.top = y + "px";
    fieldOption.style.left = x + "px";
    
    return fieldOption;
}
// Resize and move canvas using Interact.js library.

const resizeCanvas = function (id, type, currentId, optionId) {
    interact(`#${id}`)
        .resizable({
            // resize from all edges and corners
            edges: { left: '#left', right: '#right', bottom: '#bottom', top: '#top' },

            listeners: {
                move(event) {
                    var target = event.target
                    var x = (parseFloat(target.getAttribute('data-x')) || 0)
                    var y = (parseFloat(target.getAttribute('data-y')) || 0)

                    // update the element's style
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    console.log("offset: ", x, y)
                    DrawType = type;
                    resizeHandler(event.rect.width, event.rect.height, currentId);
                    showOption(optionId, event.rect.width / 2 - 180, event.rect.height + 15)

                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 25, height: 25 }
                })
            ],

            inertia: true
        })
        .draggable({
            listeners: {
                move(event) {
                    var target = event.target
                    // keep the dragged position in the data-x/data-y attributes
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

                    // translate the element
                    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

                    // update the posiion attributes
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    DrawType = type;
                    moveEventHandler(event, currentId);
                    console.log("move: ", x, y, event.rect.width, event.rect.height);
                },
            }
        })
}
// Hande the specified event.
const eventHandler = async function (e) {
    baseId++;

    let ost = computePageOffset();
    let x = e.pageX - ost.left;
    let y = e.pageY - ost.top;

    switch (currentMode) {

        case CHECKBOX:
            removeCheckbox();
            isCheckbox = !isCheckbox;

            let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = new_x_y[0]
            pos_y_pdf = new_x_y[1]

            let checkboxId = baseId;
            current_form_id = checkboxId;

            let pageId = String(PDFViewerApplication.page);
            let pg = document.getElementById(pageId);
            var rect = pg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            const checkboxWidth = 25;
            const checkboxHeight = 25;

            let checkbox = document.createElement("div");
            checkbox.id = "checkbox" + checkboxId;
            checkbox.style.position = "absolute";
            checkbox.style.top = e.pageY - top - 5 + "px";
            checkbox.style.left = e.pageX - left - 21 + "px";
            checkbox.style.width = checkboxWidth + "px";
            checkbox.style.height = checkboxHeight + "px";
            checkbox.style.background = "#3C97FE80";
            checkbox.style.zIndex = 100;
            console.log("checkbbox ID: ", checkbox.id);

            pg.appendChild(checkbox);

            // Show Checkbox OptinePane
            isOptionPane = true;
            let option = showOption(CHECKBOX_OPTION, checkboxWidth / 2 - 180, checkboxHeight + 15);
            removeParentEvent(CHECKBOX_OPTION);
            addResizebar(checkbox.id);
            checkbox.append(option);

            document.getElementById("checkbox-field-input-name").value = `Checkbox Form Field ${checkboxCount++}`

            checkbox.addEventListener("click", () => {

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

                        let tooltipbar = document.createElement("div");
                        current_form_id = checkboxId;
                        console.log(checkboxId)
                        console.log(form_storage)
                        form_storage.map((element) => {
                            if(element.id == checkboxId) {
                                document.getElementById("checkbox-field-input-name").value = element.form_field_name;
                                isOptionPane = true;
                                console.log("element: ", element.width, element.height);
                                console.log("elementPage: ", element.xPage, element.yPage);
                                option = showOption(CHECKBOX_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                console.log(option);
                                console.log(checkboxId)
                                checkbox.append(option);
                            }
                        })
                        
                        document.getElementById("checkbox-save-button").addEventListener("click", handleCheckbox);

                        const left = checkbox.style.width;
                        const top = checkbox.style.height;

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        tooltipbar.id = "checkbox_tooltipbar" + current_checkbox_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = ((parseInt(top) / 2) - 12.5) + 'px';
                        tooltipbar.style.left = parseInt(left) + 10 + 'px';

                        deleteBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            current_checkbox_id = tooltipbar.id.replace("checkbox_tooltipbar", "")
                            console.log(current_checkbox_id);
                            document.getElementById('checkbox' + current_checkbox_id).style.display = "none";
                            form_storage = form_storage.filter(function (checkbox) {
                                return checkbox.id !== parseInt(current_checkbox_id);
                            });
                            console.log(form_storage);
                        })
                        tooltipbar.appendChild(deleteBtn)

                        checkbox.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("checkbox_tooltipbar" + current_checkbox_id).remove();
                    }
                }
            })
            current_comment_id = checkboxId;

            document.getElementById("checkbox-save-button").addEventListener("click", handleCheckbox);
            resizeCanvas(checkbox.id, CHECKBOX, checkboxId, CHECKBOX_OPTION);

            break;
        case RADIO:
            removeRadio();
            isRadioButton = !isRadioButton;

            let radio_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = radio_x_y[0]
            pos_y_pdf = radio_x_y[1]

            let radio_id = form_storage.length + 1;

            let radiopageId = String(PDFViewerApplication.page);
            let radiopg = document.getElementById(radiopageId);
            var rect = radiopg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let radio = document.createElement("div");
            radio.id = "radio" + radio_id;
            radio.style.position = "absolute";
            radio.style.top = e.pageY - top - 5 + "px"
            radio.style.left = e.pageX - left - 21 + "px"
            radio.style.borderRadius = "50%";
            radio.style.width = "25px";
            radio.style.height = "25px";
            radio.style.background = "#3C97FE80";
            radio.style.zIndex = 100;

            radio.addEventListener("click", () => {

                current_radio_id = radio_id;

                let isradiotooltipshow = false;

                if (document.getElementById("radio_tooltipbar" + current_radio_id)) {
                    isradiotooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!isradiotooltipshow) {

                        let tooltipbar = document.createElement("div")

                        const left = radio.style.width;
                        const top = radio.style.height;

                        tooltipbar.id = "radio_tooltipbar" + current_radio_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = top;
                        tooltipbar.style.left = (parseInt(left) - 100) + 'px';
                        tooltipbar.style.minWidth = "100px"

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.style.float = "right";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_radio_id = tooltipbar.id.replace("radio_tooltipbar", "")
                            document.getElementById('radio' + current_radio_id).remove();

                            form_storage = form_storage.filter(function (radio) {
                                return radio.id !== parseInt(current_radio_id);
                            });
                        })

                        tooltipbar.appendChild(deleteBtn)

                        radio.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("radio_tooltipbar" + current_radio_id).remove();
                    }
                }

            })

            showOption(e, "radio-button-option", 40, -180);

            document.getElementById("radio-field-input-name").value = `Radio Group Form Field ${radioCount++}`

            document.getElementById("radio-save-button").addEventListener("click", handleRadio);

            radiopg.appendChild(radio);

            resizeCanvas(radio.id, RADIO, radio_id);

            break;
        case TEXTFIELD:
            removeText();
            isTextField = !isTextField;

            let text_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = text_x_y[0]
            pos_y_pdf = text_x_y[1]

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
            textDiv.style.width = "100px";
            textDiv.style.height = "25px";
            textDiv.style.background = "#3C97FE80";
            textDiv.style.zIndex = 100;

            textDiv.addEventListener("click", () => {

                current_text_id = text_id;

                let istexttooltipshow = false;


                if (document.getElementById("text_tooltipbar" + current_text_id)) {
                    istexttooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!istexttooltipshow) {

                        let tooltipbar = document.createElement("div")

                        const left = textDiv.style.width;
                        const top = textDiv.style.height;

                        tooltipbar.id = "text_tooltipbar" + current_text_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = top;
                        tooltipbar.style.left = (parseInt(left) - 100) + 'px';
                        tooltipbar.style.minWidth = "100px"

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.style.float = "right";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_text_id = tooltipbar.id.replace("text_tooltipbar", "")
                            document.getElementById('text' + current_text_id).remove();
                            form_storage = form_storage.filter(function (item) {
                                return item.id !== parseInt(current_text_id);
                            });
                        })

                        tooltipbar.appendChild(deleteBtn)

                        textDiv.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("text_tooltipbar" + current_text_id).remove();
                    }
                }

            })

            showOption(e, "text-field-option", 40, -50);

            document.getElementById("text-field-input-name").value = `Text Form Field ${textfieldCount++}`

            document.getElementById("text-save-button").addEventListener("click", handleText);

            textpg.appendChild(textDiv);
            resizeCanvas(textDiv.id, TEXTFIELD, text_id);

            break;
        case COMBOBOX:
            removeCombo();
            isCombo = !isCombo;

            let combo_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = combo_x_y[0]
            pos_y_pdf = combo_x_y[1]

            let combo_id = form_storage.length + 1;

            let combopageId = String(PDFViewerApplication.page);
            let combopg = document.getElementById(combopageId);
            var rect = combopg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let comboDiv = document.createElement("div");
            comboDiv.id = "combo" + combo_id;
            comboDiv.style.position = "absolute";
            comboDiv.style.top = e.pageY - top - 20 + "px"
            comboDiv.style.left = e.pageX - left - 23 + "px"
            comboDiv.style.width = "80px";
            comboDiv.style.height = "25px";
            comboDiv.style.background = "#3C97FE80";
            comboDiv.style.zIndex = 100;

            comboDiv.addEventListener("click", (e) => {

                current_combo_id = combo_id;

                let iscombotooltipshow = false;


                if (document.getElementById("combo_tooltipbar" + current_combo_id)) {
                    iscombotooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!iscombotooltipshow) {

                        let tooltipbar = document.createElement("div")

                        const left = comboDiv.style.width;
                        const top = comboDiv.style.height;

                        tooltipbar.id = "combo_tooltipbar" + current_combo_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = top;
                        tooltipbar.style.left = (parseInt(left) - 100) + 'px';
                        tooltipbar.style.minWidth = "100px"

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.style.float = "right";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_combo_id = tooltipbar.id.replace("combo_tooltipbar", "")
                            document.getElementById('combo' + current_combo_id).remove();
                            form_storage = form_storage.filter(function (item) {
                                return item.id !== parseInt(current_combo_id);
                            });
                        })

                        tooltipbar.appendChild(deleteBtn)

                        comboDiv.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("combo_tooltipbar" + current_combo_id).remove();
                    }
                }

            })

            showOption(e, 'combo-option', 40, -50);

            document.getElementById("combo-input-name").value = `Combobox Form Field ${comboCount++}`

            document.getElementById("add-option").addEventListener('click', () => {
                const optionName = document.getElementById("option-description").value;
                const optionContainer = document.getElementById("option-content");
                const optionContent = document.createElement("div");
                const deleteDivId = `delete-span-${comboboxOptionCount}`;

                optionContent.id = `comboOption${deleteDivId}`;
                optionContent.className = 'combobox-options-content';
                const contentSpan = document.createElement('span');
                contentSpan.textContent = optionName;

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'option-delete';
                deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

                if (optionName != '') comboboxOptionArray.push(optionName);

                deleteSpan.addEventListener('click', function () {
                    // Remove the corresponding div when the delete span is clicked
                    comboboxOptionArray = comboboxOptionArray.filter(function (item) {
                        return item !== optionName;
                    })
                    optionContent.remove();
                });
                optionContent.appendChild(contentSpan);
                optionContent.appendChild(deleteSpan);

                if (optionName != '') {
                    optionContainer.appendChild(optionContent);
                    comboboxOptionCount++;
                }

                document.getElementById("option-description").value = '';
            });

            document.getElementById("combo-save-button").addEventListener("click", handleCombo);

            combopg.appendChild(comboDiv);
            resizeCanvas(comboDiv.id, COMBOBOX, combo_id);
            break;
        case LIST:
            removeList();
            isList = !isList;

            let list_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = list_x_y[0]
            pos_y_pdf = list_x_y[1]

            let list_id = form_storage.length + 1;

            let listpageId = String(PDFViewerApplication.page);
            let listpg = document.getElementById(listpageId);
            var rect = listpg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let listDiv = document.createElement("div");
            listDiv.id = "list" + list_id;
            listDiv.style.position = "absolute";
            listDiv.style.top = e.pageY - top - 20 + "px"
            listDiv.style.left = e.pageX - left - 23 + "px"
            listDiv.style.width = "80px";
            listDiv.style.height = "100px";
            listDiv.style.background = "#3C97FE80";
            listDiv.style.zIndex = 100;

            listDiv.addEventListener("click", (e) => {

                current_list_id = list_id;

                const left = listDiv.style.width;
                const top = listDiv.style.height;

                let islisttooltipshow = false;


                if (document.getElementById("list_tooltipbar" + current_list_id)) {
                    islisttooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!islisttooltipshow) {

                        let tooltipbar = document.createElement("div")

                        tooltipbar.id = "list_tooltipbar" + current_list_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = top;
                        tooltipbar.style.left = (parseInt(left) - 100) + 'px';
                        tooltipbar.style.minWidth = "100px"

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.style.float = "right";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_list_id = tooltipbar.id.replace("list_tooltipbar", "")
                            document.getElementById('list' + current_list_id).remove();
                            form_storage = form_storage.filter(function (item) {
                                return item.id !== parseInt(current_list_id);
                            });
                        })

                        tooltipbar.appendChild(deleteBtn)

                        listDiv.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("list_tooltipbar" + current_list_id).remove();
                    }
                }

            })

            showOption(e, "list-option", 40, -50);

            document.getElementById("list-input-name").value = `List Form Field ${listCount++}`

            document.getElementById("add-option-list").addEventListener('click', () => {
                const optionName = document.getElementById("option-description-list").value;
                const optionContainer = document.getElementById("option-content-list");
                const optionContent = document.createElement("div");
                const deleteDivId = `delete-span-${listboxOptionCount}`;

                optionContent.id = `listOption${deleteDivId}`;
                optionContent.className = 'combobox-options-content';
                const contentSpan = document.createElement('span');
                contentSpan.textContent = optionName;

                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'option-delete';
                deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

                if (optionName != '') listboxOptionArray.push(optionName);

                deleteSpan.addEventListener('click', function () {
                    // Remove the corresponding div when the delete span is clicked
                    listboxOptionArray = listboxOptionArray.filter(function (item) {
                        return item !== optionName;
                    })
                    optionContent.remove();
                });
                optionContent.appendChild(contentSpan);
                optionContent.appendChild(deleteSpan);

                if (optionName != '') {
                    optionContainer.appendChild(optionContent);
                    listboxOptionCount++;
                }

                document.getElementById("option-description-list").value = '';
            });

            document.getElementById("list-save-button").addEventListener("click", handleList);

            listpg.appendChild(listDiv);
            resizeCanvas(listDiv.id, LIST, list_id);
            break;
        case BUTTON:
            removeButton();
            isButton = !isButton;

            let button_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = button_x_y[0]
            pos_y_pdf = button_x_y[1]

            let button_id = form_storage.length + 1;

            let buttonpageId = String(PDFViewerApplication.page);
            let buttonpg = document.getElementById(buttonpageId);
            var rect = buttonpg.getBoundingClientRect(), bodyElt = document.body;
            var top = rect.top;
            var left = rect.left;

            let buttonDiv = document.createElement("div");
            buttonDiv.id = "button" + button_id;
            buttonDiv.style.position = "absolute";
            buttonDiv.style.top = e.pageY - top - 20 + "px"
            buttonDiv.style.left = e.pageX - left - 23 + "px"
            buttonDiv.style.width = "80px";
            buttonDiv.style.height = "25px";
            buttonDiv.style.background = "#3C97FE80";
            buttonDiv.style.color = "white";
            buttonDiv.style.display = "flex";
            buttonDiv.style.alignItems = "center"
            buttonDiv.style.justifyContent = "center";
            buttonDiv.style.zIndex = 100;

            buttonDiv.addEventListener("click", () => {

                current_button_id = button_id;

                let isbuttontooltipshow = false;


                if (document.getElementById("button_tooltipbar" + current_button_id)) {
                    isbuttontooltipshow = true;
                }

                if (isDragging) {
                    isDragging = false;
                }
                else {
                    if (!isbuttontooltipshow) {

                        let tooltipbar = document.createElement("div")

                        const left = buttonDiv.style.width;
                        const top = buttonDiv.style.height;

                        tooltipbar.id = "button_tooltipbar" + current_button_id;
                        tooltipbar.style.position = "absolute";
                        tooltipbar.style.zIndex = 100;
                        tooltipbar.style.top = top;
                        tooltipbar.style.left = (parseInt(left) - 100) + 'px';
                        tooltipbar.style.minWidth = "100px"

                        let deleteBtn = moveBtn = document.createElement("button");
                        deleteBtn.style.padding = "5px";
                        deleteBtn.style.float = "right";
                        deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

                        deleteBtn.addEventListener("click", () => {
                            current_button_id = tooltipbar.id.replace("button_tooltipbar", "")
                            document.getElementById('button' + current_button_id).remove();
                            form_storage = form_storage.filter(function (item) {
                                return item.id !== parseInt(current_button_id);
                            });
                        })

                        tooltipbar.appendChild(deleteBtn)

                        buttonDiv.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("button_tooltipbar" + current_button_id).remove();
                    }
                }

            })

            showOption(e, "button-field-option", 40, -50);
            const buttonValue = document.getElementById("button-text");
            buttonValue.addEventListener('change', () => {
                document.getElementById(buttonDiv.id).textContent = buttonValue.value;
            })

            document.getElementById("button-field-input-name").value = `Button Form Field ${buttonCount++}`;

            document.getElementById("button-save-button").addEventListener("click", handleButton);

            buttonpg.appendChild(buttonDiv);
            resizeCanvas(buttonDiv.id, BUTTON, button_id);
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
const removeCombo = function () {
    removeEventListener();
    document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
}
const removeList = function () {
    removeEventListener();
    document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
}
const removeButton = function () {
    removeEventListener();
    document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
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
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            if (isCheckbox) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-solid fa-square-check'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
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
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            if (isRadioButton) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-solid fa-circle-dot'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
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
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            if (isTextField) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa-solid fa-i'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            isTextField = !isTextField;
            break;
        case COMBOBOX:
            if (isEditing) {
                removeCombo();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='far fa-caret-square-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            if (isCombo) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='far fa-caret-square-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            isCombo = !isCombo;
            break;
        case LIST:
            if (isEditing) {
                removeList();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list-check' aria-hidden='true'></i>";
            }
            if (isList) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-off'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list-check' aria-hidden='true'></i>";
            }
            isList = !isList;
            break;
        case BUTTON:
            if (isEditing) {
                removeButton();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-on'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            if (isButton) {
                removeEventListener();
            }
            else {
                addEventListener();
                document.getElementById("add_form_radio").innerHTML = "<i class='fa-regular fa-circle-dot'></i>";
                document.getElementById("add_form_check").innerHTML = "<i class='fa-sharp fa-regular fa-square-check'></i>";
                document.getElementById("add_form_text").innerHTML = "<i class='fa fa-font'></i>";
                document.getElementById("add_form_combo").innerHTML = "<i class='fa fa-caret-down'></i>";
                document.getElementById("add_form_button").innerHTML = "<i class='fa fa-toggle-on'></i>";
                document.getElementById("add_form_list").innerHTML = "<i class='fa fa-list' aria-hidden='true'></i>"
            }
            isButton = !isButton;
            break;
        default:
            break;
    }
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

const flatten = async function () {
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    form.flatten();
    pdfBytes = await pdfDoc.save();
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
    }

})

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

const moveEventHandler = (event, currentId) => {

    let pageId = String(PDFViewerApplication.page)
    let pg = document.getElementById(pageId)

    let srect = pg.getBoundingClientRect(), bodyElt = document.body;

    let stop = srect.top;
    let sleft = srect.left;

    let new_ost = computePageOffset();

    let new_x = event.pageX - new_ost.left
    let new_y = event.pageY - new_ost.top

    let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(new_x, new_y)

    new_x = new_x_y[0]
    new_y = new_x_y[1]

    if (isDragging & DrawType === "comment") {

        document.getElementById("comment" + current_comment_id).style.left = (event.x - sleft - 30) + "px";
        document.getElementById("comment" + current_comment_id).style.top = (event.y - stop - 30) + "px";

        comment_storage.map(function (comment) {

            if (comment.id === parseInt(current_comment_id)) {
                comment.x = new_x;
                comment.y = new_y;
            }
        });

    }
    if (DrawType === CHECKBOX) {

        form_storage.map(function (item) {

            if (item.id === parseInt(currentId)) {
                item.x = new_x - item.width * 12.5 / 25;
                item.y = new_y + item.height * 12.5 / 25;
            }
        });

    }
    if (DrawType === RADIO) {

        form_storage.map(function (item) {

            if (item.id === parseInt(currentId)) {
                item.data.x = new_x - item.data.width * 12.5 / 25;
                item.data.y = new_y + item.data.height * 12.5 / 25;
            }
        });

    }
    if (DrawType === TEXTFIELD) {

        form_storage.map(function (item) {

            if (item.id === parseInt(currentId)) {
                item.x = new_x - item.width * 12.5 / 25;
                item.y = new_y + item.height * 12.5 / 25;
            }
        });

    }
    if (DrawType === COMBOBOX) {

        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                item.x = new_x - item.width * 12.5 / 25;
                item.y = new_y + item.height * 12.5 / 25;
            }
        });
    }
    if (DrawType === LIST) {

        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) { //14, 85
                item.x = new_x - item.width * 12.5 / 25;
                item.y = new_y + item.height * 12.5 / 25;
            }
        });
    }
    if (DrawType === BUTTON) {

        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                item.x = new_x - item.width * 12.5 / 25;
                item.y = new_y + item.height * 12.5 / 25;
            }
        });
    }

}

const resizeHandler = function (width, height, currentId) {
    console.log("resize handler")
    if (DrawType == RADIO) {
        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                // item.data.x = 
                item.data.width = width * 0.74;
                item.data.height = height * 0.74;
                item.data.xPage = width;
                item.data.yPage = height;
            }
        });
    }
    else {
        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                item.width = width * 0.74;
                item.height = height * 0.74;
                item.xPage = width;
                item.yPage = height;
                console.log("resizeHandler", item.width, item.height);
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
    let checkboxForm, radioForm, textfieldForm, comboboxForm;
    let radioOption;
    if (form_storage.length != 0) {
        form_storage.forEach((form_item) => {
            page = pdfDoc.getPage(form_item.page_number - 1);
            const {width, height} = page.getSize();
            if (form_item.form_type == RADIO) {
                if (radioOption != form_item.data.option) {
                    radioOption = form_item.data.option;
                    radioForm = form.createRadioGroup(radioOption);
                }
            }
            switch (form_item.form_type) {
                case CHECKBOX:
                    checkboxForm = form.createCheckBox(form_item.form_field_name);
                    checkboxForm.addToPage(page, {
                        x: form_item.x - form_item.width / 25,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                case RADIO:
                    radioForm.addOptionToPage(radioCount + '', page, {
                        x: form_item.data.x - form_item.data.width / 25,
                        y: form_item.data.y - form_item.data.height,
                        width: form_item.data.width,
                        height: form_item.data.height
                    });
                    radioCount++;
                    break;
                case TEXTFIELD:
                    textfieldForm = form.createTextField(form_item.form_field_name);
                    textfieldForm.addToPage(page, {
                        x: form_item.x - form_item.width / 25,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                case COMBOBOX:
                    comboboxForm = form.createDropdown(form_item.form_field_name);
                    comboboxForm.addOptions(form_item.optionArray);
                    comboboxForm.addToPage(page, {
                        x: form_item.x - form_item.width / 25,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                case LIST:
                    listboxForm = form.createOptionList(form_item.form_field_name);
                    listboxForm.addOptions(form_item.optionArray);
                    listboxForm.addToPage(page, {
                        x: form_item.x - form_item.width / 25,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                case BUTTON:
                    buttonfieldForm = form.createButton(form_item.form_field_name);
                    buttonfieldForm.addToPage(form_item.text, page, {
                        x: form_item.x - form_item.width / 25,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height
                    });
                    break;
                default:
                    break;
            }
        })
    }
    pdfBytes = await pdfDoc.save();
}