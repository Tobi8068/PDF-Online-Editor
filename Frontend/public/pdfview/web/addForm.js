let baseId = 0;
let form_storage = [];
let current_form_id = 0;
let currentMode = null;
const CHECKBOX = 1, RADIO = 2, TEXTFIELD = 3, COMBOBOX = 4, LIST = 5, BUTTON = 6, TEXT_CONTENT = 7;
let checkboxCount = 1; radioCount = 1, textfieldCount = 1, comboCount = 1, listCount = 1, buttonCount = 1;
let isCheckbox = false, isRadioButton = false, isTextField = false, isCombo = false, isList = false, isButton = false;

let comboboxOptionCount = 0;
let listboxOptionCount = 0;
let comboboxOptionArray = [];
let listboxOptionArray = [];

let pos_x_pdf = 0, pos_y_pdf = 0;
let pos_x_page = 0; pos_y_page = 0;
let fontStyle = '', fontSize = 0, textColor = '';

const SUBMIT = 1, RESET = 2, NOACTION = 3;

const CHECKBOX_OPTION = "checkbox-option";
const RADIO_OPTION = "radio-button-option";
const TEXT_OPTION = "text-field-option";
const COMBO_OPTION = "combo-option";
const LIST_OPTION = "list-option";
const BUTTON_OPTION = "button-field-option";

const ALIGN_LEFT = 0, ALIGN_RIGHT = 2, ALIGN_CENTER = 1;
let alignValue = 0;

let isOptionPane = false;

let current_checkbox_id = 0;
let current_radio_id = 0;
let current_text_id = 0;
let current_combo_id = 0;
let current_list_id = 0;
let current_button_id = 0;


const fontStyleArr = ['Courier', 'CourierBold', 'CourierBoldOblique', 'CourierOblique', 'Helvetica',
    'HelveticaBold', 'HelveticaBoldOblique', 'HelveticaOblique', 'Symbol', 'TimesRoman',
    'TimesRomanBold', 'TimesRomanBoldItalic', 'TimesRomanItalic', 'ZapfDingbats'];

const fontSizeArr = ['auto', 4, 6, 8, 10, 12, 14, 16, 18, 24, 36, 48, 64, 72, 96, 144, 192];

let formWidth = 25;
let formHeight = 25;

let selectedAlign = '', groupNameAlign = '';

// Check the same form field name and modify field name
const checkFormField = function (id) {
    const formFieldName = document.getElementById(id).value;
    for (let i = 0; i < form_storage.length; i++) {
        if (form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].form_field_name = formFieldName;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    }
    return { count, formFieldName };
}

// Remove the parent event.
const removeParentEvent = function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
        e.stopPropagation();
    })
    interact(`#${id}`).draggable({
        listeners: {
            move(event) {
                event.stopPropagation();
            }
        }
    })
}

function handleRadioSelection(event) {
    const selectedRadioButton = event.target;
    if (selectedRadioButton.checked) {
        selectedAlign = selectedRadioButton.value;
        groupNameAlign = selectedRadioButton.name;
        if (selectedAlign == 'left') {
            alignValue = ALIGN_LEFT;
        } else if (selectedAlign == 'center') {
            alignValue = ALIGN_CENTER;
        } else if (selectedAlign == 'right') {
            alignValue = ALIGN_RIGHT;
        }
    }
}

// When click "Save" button, save the information of Checkbox element.

const handleCheckbox = function (e) {
    formWidth = 25;
    formHeight = 25;
    isOptionPane = false;
    document.getElementById("checkbox-option").style.display = 'none';
    e.stopPropagation();

    const { count, formFieldName } = checkFormField("checkbox-field-input-name");
    const label = document.getElementById("checkbox-label").value;
    const value = document.getElementById("checkbox-value").value;

    if (count == form_storage.length || form_storage == null) {
        form_storage.push({
            id: baseId,
            form_type: CHECKBOX,
            form_field_name: formFieldName,
            page_number: PDFViewerApplication.page,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth * 0.75 * 0.75,
            height: formHeight * 0.75 * 0.75,
            xPage: formWidth,
            yPage: formHeight,
            label: label,
            value: value
        });
    }
    document.getElementById("checkbox-save-button").removeEventListener("click", handleCheckbox);
}
// When click "Save" button, save the information of RadioGroup element.

const handleRadio = function (e) {
    formWidth = 25;
    formHeight = 25;
    isOptionPane = false;
    const label = document.getElementById("radio-label").value;
    const value = document.getElementById("radio-value").value;
    document.getElementById("radio-button-option").style.display = 'none';
    const formFieldName = document.getElementById("radio-field-input-name").value;
    e.stopPropagation();
    let count = 0, isData = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].id != current_form_id) count++;
        if (form_storage[j].hasOwnProperty('data')) isData++;
    }
    if (form_storage.hasOwnProperty('data')) {
        for (let i = 0; i < form_storage.length; i++) {
            if (form_storage[i].data.option == formFieldName && form_storage[i].id == current_form_id) {
                break;
            }
            else if (form_storage[i].data.option != formFieldName && form_storage[i].id == current_form_id) {
                form_storage[i].data.option = formFieldName;
                break;
            }
        }
    }
    else if (!isData || count == form_storage.length) {
        form_storage.push({
            id: baseId,
            form_type: RADIO,
            page_number: PDFViewerApplication.page,
            data: {
                option: formFieldName,
                x: pos_x_pdf,
                y: pos_y_pdf,
                width: formWidth * 0.75 * 0.75,
                height: formHeight * 0.75 * 0.75,
                xPage: formWidth,
                yPage: formHeight,
                label: label,
                value: value
            }
        });
    }
    document.getElementById("radio-save-button").removeEventListener("click", handleRadio);
}
// When click "Save" button, save the information of TextField element.

const handleText = function (e) {
    formWidth = 300;
    formHeight = 40;
    isOptionPane = false;
    document.getElementById("text-field-option").style.display = 'none';
    e.stopPropagation();
    const formFieldName = document.getElementById("text-field-input-name").value;
    fontStyle = document.getElementById('text-font-style').value;
    fontSize = parseInt(document.getElementById('text-font-size').value);
    textColor = document.getElementById('text-font-color').value;

    for (let i = 0; i < form_storage.length; i++) {
        if (form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].fontStyle = fontStyle;
            form_storage[i].fontSize = fontSize;
            form_storage[i].textColor = textColor;
            form_storage[i].align = alignValue;
            break;
        }
        else if (form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].form_field_name = formFieldName;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    }

    if (count == form_storage.length || form_storage == null) {
        form_storage.push({
            id: baseId,
            form_type: TEXTFIELD,
            form_field_name: formFieldName,
            page_number: PDFViewerApplication.page,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth * 0.75 * 0.75,
            height: formHeight * 0.75 * 0.75,
            fontStyle: fontStyle,
            fontSize: fontSize,
            textColor: textColor,
            align: alignValue,
            xPage: formWidth,
            yPage: formHeight
        });
        fontStyle = '';
        fontSize = 12;
        textColor = '';
        alignValue = 0;
    }
    document.getElementById("text-save-button").removeEventListener("click", handleText);
}
// When click "Save" button, save the information of Combobox element.

const handleCombo = function (e) {
    formWidth = 300;
    formHeight = 40;
    isOptionPane = false;
    document.getElementById("combo-option").style.display = 'none';
    e.stopPropagation();

    const formFieldName = document.getElementById("combo-input-name").value;
    fontStyle = document.getElementById('combo-font-style').value;
    fontSize = parseInt(document.getElementById('combo-font-size').value);
    textColor = document.getElementById('combo-font-color').value;
    for (let i = 0; i < form_storage.length; i++) {
        if (form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].optionArray = comboboxOptionArray;
            form_storage[i].fontStyle = fontStyle;
            form_storage[i].fontSize = fontSize;
            form_storage[i].textColor = textColor;
            comboboxOptionArray = [];
            break;
        }
        else if (form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].form_field_name = formFieldName;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    }
    if (count == form_storage.length || form_storage == null) {
        form_storage.push({
            id: baseId,
            form_type: COMBOBOX,
            form_field_name: formFieldName,
            page_number: PDFViewerApplication.page,
            optionArray: comboboxOptionArray,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth * 0.75 * 0.75,
            height: formHeight * 0.75 * 0.75,
            fontStyle: fontStyle,
            fontSize: fontSize,
            textColor: textColor,
            xPage: formWidth,
            yPage: formHeight
        });
        fontStyle = '';
        fontSize = 12;
        textColor = '';
        comboboxOptionArray = [];
    }
    document.getElementById("combo-save-button").removeEventListener("click", handleCombo);
}
// When click "Save" button, save the information of Listbox element.

const handleList = function (e) {
    formWidth = 300;
    formHeight = 120;
    document.getElementById("list-option").style.display = 'none';
    e.stopPropagation();
    const formFieldName = document.getElementById("list-input-name").value;
    fontStyle = document.getElementById('list-font-style').value;
    fontSize = parseInt(document.getElementById('list-font-size').value);
    textColor = document.getElementById('list-font-color').value;
    for (let i = 0; i < form_storage.length; i++) {
        if (form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].optionArray = listboxOptionArray;
            form_storage[i].fontStyle = fontStyle;
            form_storage[i].fontSize = fontSize;
            form_storage[i].textColor = textColor;
            listboxOptionArray = [];
            break;
        }
        else if (form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].form_field_name = formFieldName;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    }
    if (count == form_storage.length || form_storage == null) {
        form_storage.push({
            id: baseId,
            form_type: LIST,
            form_field_name: formFieldName,
            page_number: PDFViewerApplication.page,
            optionArray: listboxOptionArray,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth * 0.75 * 0.75,
            height: formHeight * 0.75 * 0.75,
            fontStyle: fontStyle,
            fontSize: fontSize,
            textColor: textColor,
            xPage: formWidth,
            yPage: formHeight
        });
        fontStyle = '';
        fontSize = 12;
        textColor = '';
        listboxOptionArray = [];
    }
    document.getElementById("list-save-button").removeEventListener("click", handleCombo);
}

// Display 4 points around the canvas to resize the canvas - top, left, right, bottom.
const addResizebar = function (objectId) {
    const topLeft = document.createElement('div');
    topLeft.id = "topLeft";
    topLeft.classList.add('resize-point');
    topLeft.classList.add('top-left');
    topLeft.classList.add('resize-l');
    topLeft.classList.add('resize-t');
    const top = document.createElement('div');
    top.id = "top";
    top.classList.add('resize-point');
    top.classList.add('top-center');
    top.classList.add('resize-t')
    const topRight = document.createElement('div');
    topRight.id = "topRight";
    topRight.classList.add('resize-point');
    topRight.classList.add('top-right');
    topRight.classList.add('resize-r');
    topRight.classList.add('resize-t');
    const left = document.createElement('div');
    left.id = "left";
    left.classList.add('resize-point');
    left.classList.add('middle-left');
    left.classList.add('resize-l');
    const right = document.createElement('div');
    right.id = "right";
    right.classList.add('resize-point');
    right.classList.add('middle-right');
    right.classList.add('resize-r');
    const bottomLeft = document.createElement('div');
    bottomLeft.id = "bottomLeft";
    bottomLeft.classList.add('resize-point');
    bottomLeft.classList.add('bottom-left');
    bottomLeft.classList.add('resize-l');
    bottomLeft.classList.add('resize-b');
    const bottom = document.createElement('div');
    bottom.id = "bottom";
    bottom.classList.add('resize-point');
    bottom.classList.add('bottom-center');
    bottom.classList.add('resize-b');
    const bottomRight = document.createElement('div');
    bottomRight.id = "bottomRight";
    bottomRight.classList.add('resize-point');
    bottomRight.classList.add('bottom-right');
    bottomRight.classList.add('resize-r');
    bottomRight.classList.add('resize-b');
    const container = document.getElementById(objectId);
    container.append(top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight);
}

// Show the OptionPane to edit the properties of elements.

const showOption = function (id, x, y) {
    const fieldOption = document.getElementById(id);

    if (isOptionPane) fieldOption.style.display = "flex";
    else fieldOption.style.display = "none";

    fieldOption.style.top = y + "px";
    fieldOption.style.left = x + "px";

    return fieldOption;
}

// When click "Save" button, save the information of Button element.
const handleButton = function (e) {
    formWidth = 160;
    formHeight = 40;
    isOptionPane = false;
    document.getElementById("button-field-option").style.display = 'none';
    let form_action = 0;
    const selectedValue = document.getElementById("button-field-input-action").value;
    if (selectedValue === 'submit') {
        form_action = SUBMIT;
    } else if (selectedValue === 'reset') {
        form_action = RESET;
    } else if (selectedValue === 'no_action') {
        form_action = NOACTION;
    }
    e.stopPropagation();

    const formFieldName = document.getElementById("button-field-input-name").value;
    let initialValue = document.getElementById("button-text").value;
    fontStyle = document.getElementById('button-font-style').value;
    fontSize = parseInt(document.getElementById('button-font-size').value);
    textColor = document.getElementById('button-font-color').value;
    for (let i = 0; i < form_storage.length; i++) {
        if (form_storage[i].form_field_name == formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].action = form_action;
            form_storage[i].fontStyle = fontStyle;
            form_storage[i].fontSize = fontSize;
            form_storage[i].textColor = textColor;
            form_storage[i].text = initialValue;
            break;
        }
        else if (form_storage[i].form_field_name == formFieldName && form_storage[i].id != current_form_id) {
            break;
        }
        else if (form_storage[i].form_field_name != formFieldName && form_storage[i].id == current_form_id) {
            form_storage[i].form_field_name = formFieldName;
            form_storage[i].action = form_action;
            break;
        }
    }
    let count = 0;
    for (let j = 0; j < form_storage.length; j++) {
        if (form_storage[j].form_field_name != formFieldName && form_storage[j].id != current_form_id) count++;
    }
    if (count == form_storage.length || form_storage == null) {
        form_storage.push({
            id: baseId,
            form_type: BUTTON,
            form_field_name: formFieldName,
            text: initialValue,
            action: form_action,
            page_number: PDFViewerApplication.page,
            x: pos_x_pdf,
            y: pos_y_pdf,
            width: formWidth * 0.75 * 0.75,
            height: formHeight * 0.75 * 0.75,
            fontStyle: fontStyle,
            fontSize: fontSize,
            textColor: textColor,
            xPage: formWidth,
            yPage: formHeight
        });
        fontStyle = '';
        fontSize = 12;
        textColor = '';
        form_action = 0;
    }
    document.getElementById("button-save-button").removeEventListener("click", handleButton);
}

// Resize and move canvas using Interact.js library.
const resizeCanvas = function (id, type, currentId, optionId) {
    const interactInstance = interact(`#${id}`)
        .resizable({
            // resize from all edges and corners
            edges: { left: '.resize-l', right: '.resize-r', bottom: '.resize-b', top: '.resize-t' },

            listeners: {
                move(event) {
                    var target = event.target
                    let x = (parseFloat(target.getAttribute('data-x')) || 0)
                    let y = (parseFloat(target.getAttribute('data-y')) || 0)

                    // update the element's style
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    DrawType = type;
                    if (DrawType != TEXT_CONTENT) {
                        resizeHandler(event.rect.width, event.rect.height, currentId);
                        showOption(optionId, event.rect.width / 2 - 180, event.rect.height + 15)
                    }
                },
                end(event) {
                    let target = event.target
                    let x = (parseFloat(target.getAttribute('data-x')) || 0)
                    let y = (parseFloat(target.getAttribute('data-y')) || 0)
                    // update the element's style
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    if (DrawType != TEXT_CONTENT) {
                        moveEventHandler(event, x, y, currentId);
                    }
                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 15, height: 15 }
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

                    // update the position attributes
                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    DrawType = type;
                    if (DrawType == TEXT_CONTENT) {
                        const currentText = document.getElementById(current_text_content_id);
                        currentText.addEventListener('focus', function () {
                            interactInstance.draggable(false);
                            current_text_content_id = current_text_content_id_copy;
                            console.log('focus');
                        })
                        currentText.addEventListener('blur', function () {
                            interactInstance.draggable(true);
                            current_text_content_id = '';
                            console.log('blur');
                        })
                    }
                },
                end(event) {
                    const target = event.target;
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                    if (DrawType != TEXT_CONTENT) {
                        moveEventHandler(event, x, y, currentId);
                    }
                }
            }
        })
}



const resizeHandler = function (width, height, currentId) {
    if (DrawType == RADIO) {
        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                item.data.width = width * 0.75 * 0.75;
                item.data.height = height * 0.75 * 0.75;
                item.data.xPage = width;
                item.data.yPage = height;
            }
        });
    }
    else {
        form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
                item.width = width * 0.75 * 0.75;
                item.height = height * 0.75 * 0.75;
                item.xPage = width;
                item.yPage = height;
            }
        });
    }
}

const hexToRgb = function (hex) {
    // Remove the '#' at the beginning if present
    hex = hex.replace('#', '');

    // Parse the hexadecimal color components
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return { r, g, b };
}

// Show the specified OptionPane and add resizebar.
const showOptionAndResizebar = function (optionId, object, objectWidth, objectHeight, id) {
    isOptionPane = true;
    let option = showOption(optionId, objectWidth / 2 - 180, objectHeight + 15);
    removeParentEvent(optionId);
    addResizebar(object.id);
    object.append(option);
    if (optionId != CHECKBOX_OPTION && optionId != RADIO_OPTION) {
        let selectStyleContent = '';
        let selectSizeContent = '';
        fontStyleArr.map((item) => {
            selectStyleContent += `<option value=${item}>${item}</option>`;
        })
        fontSizeArr.map((item) => {
            if (item == 'auto') selectSizeContent += `<option value='12'}>Default</option>`;
            else selectSizeContent += `<option value=${item}>${item}</option>`;
        })
        document.getElementById(`${id}-font-style`).innerHTML = selectStyleContent;
        document.getElementById(`${id}-font-size`).innerHTML = selectSizeContent;
    }
}
// Add Delete button and define action.
const addDeleteButton = function (currentId, container, object, type) {
    const left = object.style.width;
    const top = object.style.height;

    container.id = `${type}_tooltipbar` + currentId;
    container.style.position = "absolute";
    container.style.zIndex = 100;
    container.style.top = ((parseInt(top) / 2) - 12.5) + 'px';
    container.style.left = parseInt(left) + 10 + 'px';
    let deleteBtn = document.createElement("button");
    deleteBtn.style.padding = "5px";
    deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentId = container.id.replace(`${type}_tooltipbar`, "")
        document.getElementById(`${type}` + currentId).style.display = "none";
        form_storage = form_storage.filter(function (item) {
            return item.id !== parseInt(currentId);
        });
    })
    container.appendChild(deleteBtn);
    object.appendChild(container)
}
// Handle the specified event.
const eventHandler = async function (e) {
    baseId++;

    let ost = computePageOffset();
    let x = e.pageX - ost.left;
    let y = e.pageY - ost.top;

    let pageId = String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);
    var rect = pg.getBoundingClientRect(), bodyElt = document.body;
    var top = rect.top;
    var left = rect.left;

    switch (currentMode) {

        case CHECKBOX:
            removeCheckbox();
            isCheckbox = !isCheckbox;

            let new_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = new_x_y[0]
            pos_y_pdf = new_x_y[1]

            let checkboxId = baseId;
            current_form_id = checkboxId;

            const checkboxWidth = 25;
            const checkboxHeight = 25;

            let checkbox = document.createElement("div");
            checkbox.id = "checkbox" + checkboxId;
            checkbox.style.position = "absolute";
            checkbox.style.top = e.pageY - top + "px";
            checkbox.style.left = e.pageX - left + "px";
            checkbox.style.width = checkboxWidth + "px";
            checkbox.style.height = checkboxHeight + "px";
            checkbox.style.background = "#3C97FE80";
            checkbox.style.zIndex = 100;

            pg.appendChild(checkbox);

            // Show Checkbox OptionPane
            showOptionAndResizebar(CHECKBOX_OPTION, checkbox, checkboxWidth, checkboxHeight);

            document.getElementById("checkbox-field-input-name").value = `Checkbox Form Field ${checkboxCount++}`
            document.getElementById("checkbox-label").value = `Label ${checkboxCount}`;
            document.getElementById("checkbox-value").value = `Value ${checkboxCount}`;

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
                        form_storage.map((element) => {
                            if (element.id == checkboxId) {
                                document.getElementById("checkbox-field-input-name").value = element.form_field_name;
                                document.getElementById("checkbox-label").value = element.label;
                                document.getElementById("checkbox-value").value = element.value;
                                isOptionPane = true;
                                option = showOption(CHECKBOX_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                checkbox.append(option);
                            }
                        })

                        document.getElementById("checkbox-save-button").addEventListener("click", handleCheckbox);

                        addDeleteButton(current_checkbox_id, tooltipbar, checkbox, "checkbox")
                    }
                    else {
                        document.getElementById("checkbox_tooltipbar" + current_checkbox_id).remove();
                    }
                }
            })

            document.getElementById("checkbox-save-button").addEventListener("click", handleCheckbox);
            resizeCanvas(checkbox.id, CHECKBOX, checkboxId, CHECKBOX_OPTION);

            break;
        case RADIO:
            removeRadio();
            isRadioButton = !isRadioButton;

            let radio_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = radio_x_y[0];
            pos_y_pdf = radio_x_y[1];

            let radioId = baseId;
            current_form_id = radioId;

            const radioWidth = 25;
            const radioHeight = 25;

            let radio = document.createElement("div");
            radio.id = "radio" + radioId;
            radio.style.position = "absolute";
            radio.style.top = e.pageY - top + "px"
            radio.style.left = e.pageX - left + "px"
            radio.style.borderRadius = "50%";
            radio.style.width = "25px";
            radio.style.height = "25px";
            radio.style.background = "#3C97FE80";
            radio.style.zIndex = 100;

            pg.appendChild(radio);

            // Show RadioGroup OptinePane
            showOptionAndResizebar(RADIO_OPTION, radio, radioWidth, radioHeight);

            document.getElementById("radio-field-input-name").value = `Radio Group Form Field ${radioCount++}`
            document.getElementById("radio-label").value = `Label ${radioCount}`;
            document.getElementById("radio-value").value = `Value ${radioCount}`;

            radio.addEventListener("click", () => {

                current_radio_id = radioId;

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

                        current_form_id = radioId;
                        form_storage.map((element) => {
                            if (element.id == radioId) {
                                document.getElementById("radio-field-input-name").value = element.data.option;
                                document.getElementById("radio-label").value = element.data.label;
                                document.getElementById("radio-value").value = element.data.value;
                                isOptionPane = true;
                                option = showOption(RADIO_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                radio.append(option);
                            }
                        })

                        document.getElementById("radio-save-button").addEventListener("click", handleRadio);

                        addDeleteButton(current_radio_id, tooltipbar, radio, "radio");

                        radio.appendChild(tooltipbar)
                    }
                    else {
                        document.getElementById("radio_tooltipbar" + current_radio_id).remove();
                    }
                }

            })

            document.getElementById("radio-save-button").addEventListener("click", handleRadio);
            resizeCanvas(radio.id, RADIO, radioId, RADIO_OPTION);

            break;
        case TEXTFIELD:
            removeText();
            isTextField = !isTextField;

            let text_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = text_x_y[0]
            pos_y_pdf = text_x_y[1]

            let textId = baseId;
            current_form_id = textId;

            const textWidth = 300;
            const textHeight = 40;

            let textDiv = document.createElement("div");
            textDiv.id = "text" + textId;
            textDiv.style.position = "absolute";
            textDiv.style.top = e.pageY - top + "px"
            textDiv.style.left = e.pageX - left + "px"
            textDiv.style.width = textWidth + "px";
            textDiv.style.height = textHeight + "px";
            textDiv.style.background = "#3C97FE80";
            textDiv.style.zIndex = 100;
            pg.appendChild(textDiv);

            // Show TextField OptionPane
            showOptionAndResizebar(TEXT_OPTION, textDiv, textWidth, textHeight, "text");
            const textfieldAlign = document.querySelectorAll('input[type=radio][name="text-field"]');
            textfieldAlign.forEach(function (radio) {
                radio.addEventListener('change', handleRadioSelection);
            });
            document.getElementById("text-field-input-name").value = `Text Form Field ${textfieldCount++}`

            textDiv.addEventListener("click", () => {

                current_text_id = textId;

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
                        current_form_id = textId;

                        form_storage.map((element) => {
                            if (element.id == textId) {
                                document.getElementById("text-field-input-name").value = element.form_field_name;
                                isOptionPane = true;
                                option = showOption(TEXT_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                document.getElementById("text-font-style").value = element.fontStyle;
                                document.getElementById("text-font-size").value = element.fontSize;
                                document.getElementById("text-font-color").value = element.textColor;
                                let selected = element.align;
                                if(selected == ALIGN_LEFT) document.getElementById('text-left').checked = true;
                                if(selected == ALIGN_CENTER) document.getElementById('text-center').checked = true;
                                if(selected == ALIGN_RIGHT) document.getElementById('text-right').checked = true;
                                textDiv.append(option);
                            }
                        })

                        document.getElementById("text-save-button").addEventListener("click", handleText);

                        addDeleteButton(current_text_id, tooltipbar, textDiv, "text");
                    }
                    else {
                        document.getElementById("text_tooltipbar" + current_text_id).remove();
                    }
                }
            })

            document.getElementById("text-save-button").addEventListener("click", handleText);
            resizeCanvas(textDiv.id, TEXTFIELD, textId, TEXT_OPTION);

            break;
        case COMBOBOX:
            document.getElementById("option-content").innerHTML = '';
            removeCombo();
            isCombo = !isCombo;

            let combo_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = combo_x_y[0]
            pos_y_pdf = combo_x_y[1]

            let comboId = baseId;
            current_form_id = comboId;

            const comboWidth = 300;
            const comboHeight = 40;

            let comboDiv = document.createElement("div");
            comboDiv.id = "combo" + comboId;
            comboDiv.style.position = "absolute";
            comboDiv.style.top = e.pageY - top + "px"
            comboDiv.style.left = e.pageX - left + "px"
            comboDiv.style.width = comboWidth + "px";
            comboDiv.style.height = comboHeight + "px";
            comboDiv.style.background = "#3C97FE80";
            comboDiv.style.zIndex = 100;

            pg.appendChild(comboDiv);

            // Show Combobox OptionPane
            showOptionAndResizebar(COMBO_OPTION, comboDiv, comboWidth, comboHeight, "combo");
            document.getElementById("combo-input-name").value = `Combobox Form Field ${comboCount++}`

            comboDiv.addEventListener("click", (e) => {

                current_combo_id = comboId;

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
                        current_form_id = comboId;
                        document.getElementById("option-content").innerHTML = '';
                        form_storage.map((element) => {
                            if (element.id == comboId) {
                                document.getElementById("combo-input-name").value = element.form_field_name;
                                isOptionPane = true;
                                option = showOption(COMBO_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                document.getElementById("combo-font-style").value = element.fontStyle;
                                document.getElementById("combo-font-size").value = element.fontSize;
                                document.getElementById("combo-font-color").value = element.textColor;
                                element.optionArray.map((elementItem) => {
                                    const optionContent = document.createElement("div");
                                    const deleteDivId = `delete-span-${comboboxOptionCount}`;
                                    optionContent.id = `comboOption${deleteDivId}`;
                                    optionContent.className = 'combobox-options-content';
                                    const contentSpan = document.createElement('span');
                                    contentSpan.textContent = elementItem;
                                    const deleteSpan = document.createElement('span');
                                    deleteSpan.className = 'option-delete';
                                    deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                                    deleteSpan.addEventListener('click', function () {
                                        // Remove the corresponding div when the delete span is clicked
                                        element = element.filter(function (item) {
                                            return item !== elementItem;
                                        })
                                        optionContent.remove();
                                    });
                                    optionContent.append(contentSpan, deleteSpan);
                                    document.getElementById("option-content").append(optionContent);
                                })
                                comboDiv.append(option);
                            }
                        })

                        document.getElementById("combo-save-button").addEventListener("click", handleCombo);

                        addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo")
                    }
                    else {
                        document.getElementById("combo_tooltipbar" + current_combo_id).remove();
                    }
                }
            })

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

            resizeCanvas(comboDiv.id, COMBOBOX, comboId, COMBO_OPTION);
            break;
        case LIST:
            document.getElementById("option-content-list").innerHTML = '';
            removeList();
            isList = !isList;

            let list_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = list_x_y[0]
            pos_y_pdf = list_x_y[1]

            let listId = baseId;
            current_form_id = listId;

            const listWidth = 300;
            const listHeight = 120;

            let listDiv = document.createElement("div");
            listDiv.id = "list" + listId;
            listDiv.style.position = "absolute";
            listDiv.style.top = e.pageY - top + "px"
            listDiv.style.left = e.pageX - left + "px"
            listDiv.style.width = listWidth + "px";
            listDiv.style.height = listHeight + "px";
            listDiv.style.background = "#3C97FE80";
            listDiv.style.zIndex = 100;

            pg.appendChild(listDiv);

            showOptionAndResizebar(LIST_OPTION, listDiv, listWidth, listHeight, "list");
            document.getElementById("list-input-name").value = `Listbox Form Field ${listCount++}`

            listDiv.addEventListener("click", (e) => {

                current_list_id = listId;

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
                        current_form_id = listId;
                        document.getElementById("option-content-list").innerHTML = '';
                        form_storage.map((element) => {
                            if (element.id == listId) {
                                document.getElementById("list-input-name").value = element.form_field_name;
                                isOptionPane = true;
                                option = showOption(LIST_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                document.getElementById("list-font-style").value = element.fontStyle;
                                document.getElementById("list-font-size").value = element.fontSize;
                                document.getElementById("list-font-color").value = element.textColor;
                                element.optionArray.map((elementItem) => {
                                    const optionContent = document.createElement("div");
                                    const deleteDivId = `delete-span-${listboxOptionCount}`;
                                    optionContent.id = `listOption${deleteDivId}`;
                                    optionContent.className = 'combobox-options-content';
                                    const contentSpan = document.createElement('span');
                                    contentSpan.textContent = elementItem;
                                    const deleteSpan = document.createElement('span');
                                    deleteSpan.className = 'option-delete';
                                    deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                                    deleteSpan.addEventListener('click', function () {
                                        // Remove the corresponding div when the delete span is clicked
                                        element = element.filter(function (item) {
                                            return item !== elementItem;
                                        })
                                        optionContent.remove();
                                    });
                                    optionContent.append(contentSpan, deleteSpan);
                                    document.getElementById("option-content-list").append(optionContent);
                                })
                                listDiv.append(option);
                            }
                        })
                        document.getElementById("list-save-button").addEventListener("click", handleList);

                        addDeleteButton(current_list_id, tooltipbar, listDiv, "list")
                    }
                    else {
                        document.getElementById("list_tooltipbar" + current_list_id).remove();
                    }
                }

            })

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

            resizeCanvas(listDiv.id, LIST, listId, LIST_OPTION);
            break;
        case BUTTON:
            removeButton();
            isButton = !isButton;
            document.getElementById("button-field-input-action").value = "submit";

            let button_x_y = PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1].viewport.convertToPdfPoint(x, y)

            pos_x_pdf = button_x_y[0]
            pos_y_pdf = button_x_y[1]

            let buttonId = baseId;
            current_form_id = buttonId;

            const buttonWidth = 160;
            const buttonHeight = 40;

            let buttonDiv = document.createElement("div");
            buttonDiv.style.position = "absolute";
            buttonDiv.style.top = e.pageY - top + "px"
            buttonDiv.style.left = e.pageX - left + "px"
            buttonDiv.id = "button" + buttonId;
            buttonDiv.style.width = buttonWidth + "px";
            buttonDiv.style.height = buttonHeight + "px";
            buttonDiv.style.background = "#3C97FE80";
            buttonDiv.style.color = "white";
            buttonDiv.style.zIndex = 100;

            pg.appendChild(buttonDiv);

            showOptionAndResizebar(BUTTON_OPTION, buttonDiv, buttonWidth, buttonHeight, "button");
            document.getElementById("button-field-input-name").value = `Button Form Field ${buttonCount++}`;
            document.getElementById("button-text").value = "Button";
            buttonDiv.addEventListener("click", () => {

                current_button_id = buttonId;

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
                        current_form_id = buttonId;
                        form_storage.map((element) => {
                            if (element.id == buttonId) {
                                document.getElementById("button-field-input-name").value = element.form_field_name;
                                isOptionPane = true;
                                option = showOption(BUTTON_OPTION, element.xPage / 2 - 180, element.yPage + 15);
                                document.getElementById("button-font-style").value = element.fontStyle;
                                document.getElementById("button-font-size").value = element.fontSize;
                                document.getElementById("button-font-color").value = element.textColor;
                                const selectedValue = document.getElementById("button-field-input-action");
                                if (element.action == SUBMIT) {
                                    selectedValue.value = "submit";
                                } else if (element.action == RESET) {
                                    selectedValue.value = "reset";
                                }
                                buttonDiv.append(option);
                            }
                        })
                        document.getElementById("button-save-button").addEventListener("click", handleButton);
                        addDeleteButton(current_button_id, tooltipbar, buttonDiv, "button")
                    }
                    else {
                        document.getElementById("button_tooltipbar" + current_button_id).remove();
                    }
                }

            })

            // const buttonValue = document.getElementById("button-text");
            // buttonValue.addEventListener('change', () => {
            //     document.getElementById(buttonDiv.id).textContent = buttonValue.value;
            // })

            document.getElementById("button-save-button").addEventListener("click", handleButton);
            resizeCanvas(buttonDiv.id, BUTTON, buttonId, BUTTON_OPTION);
            break;
        default:
            break;
    }
}
const addEventListener = function () {
    document.getElementById("viewer").addEventListener('click', eventHandler);
    isEditing = true;
}

const removeEventListener = function () {
    document.getElementById("viewer").removeEventListener('click', eventHandler);
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

textfieldAlign.forEach(function (radio) {
    radio.addEventListener('change', handleRadioSelection);
});


async function addFormElements() {
    const fontStyles = {
        'Courier': PDFLib.StandardFonts.Courier,
        'CourierBold': PDFLib.StandardFonts.CourierBold,
        'CourierBoldOblique': PDFLib.StandardFonts.CourierBoldOblique,
        'CourierOblique': PDFLib.StandardFonts.CourierOblique,
        'Helvetica': PDFLib.StandardFonts.Helvetica,
        'HelveticaBold': PDFLib.StandardFonts.HelveticaBold,
        'HelveticaBoldOblique': PDFLib.StandardFonts.HelveticaBoldOblique,
        'HelveticaOblique': PDFLib.StandardFonts.HelveticaOblique,
        'Symbol': PDFLib.StandardFonts.Symbol,
        'TimesRoman': PDFLib.StandardFonts.TimesRoman,
        'TimesRomanBold': PDFLib.StandardFonts.TimesRomanBold,
        'TimesRomanBoldItalic': PDFLib.StandardFonts.TimesRomanBoldItalic,
        'TimesRomanItalic': PDFLib.StandardFonts.TimesRomanItalic,
        'ZapfDingbats': PDFLib.StandardFonts.ZapfDingbats,
    };
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const form = pdfDoc.getForm();
    let page;
    let checkboxForm, radioForm, textfieldForm, comboboxForm;
    let radioOption;
    let customFont = '', selectedFont = '';
    if (form_storage.length != 0) {
        form_storage.forEach(async (form_item) => {
            page = pdfDoc.getPage(form_item.page_number - 1);
            if (form_item.form_type == RADIO) {
                if (radioOption != form_item.data.option) {
                    radioOption = form_item.data.option;
                    radioForm = form.createRadioGroup(radioOption);
                }
            }
            if (form_item.form_type != CHECKBOX && form_item.form_type != RADIO) {
                selectedFont = fontStyles[form_item.fontStyle] || PDFLib.StandardFonts.Helvetica;
                customFont = await pdfDoc.embedFont(selectedFont);
                var { r, g, b } = hexToRgb(form_item.textColor);
            }
            switch (form_item.form_type) {
                case CHECKBOX:
                    checkboxForm = form.createCheckBox(form_item.form_field_name);
                    checkboxForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height,
                        backgroundColor: PDFLib.rgb(1, 1, 1),
                        borderColor: PDFLib.rgb(1, 1, 1)
                    });
                    break;
                case RADIO:
                    radioForm.addOptionToPage(radioCount + '', page, {
                        x: form_item.data.x,
                        y: form_item.data.y - form_item.data.height,
                        width: form_item.data.width,
                        height: form_item.data.height,
                        backgroundColor: PDFLib.rgb(1, 1, 1)
                    });
                    radioCount++;
                    break;
                case TEXTFIELD:
                    textfieldForm = form.createTextField(form_item.form_field_name);
                    textfieldForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height,
                        textColor: PDFLib.rgb(r, g, b),
                        backgroundColor: PDFLib.rgb(1, 1, 1),
                        borderColor: PDFLib.rgb(1, 1, 1)
                    });
                    textfieldForm.updateAppearances(customFont);
                    textfieldForm.defaultUpdateAppearances(customFont);
                    textfieldForm.setFontSize(form_item.fontSize);
                    textfieldForm.setAlignment(form_item.align);
                    break;
                case COMBOBOX:
                    comboboxForm = form.createDropdown(form_item.form_field_name);
                    comboboxForm.addOptions(form_item.optionArray);
                    comboboxForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height,
                        textColor: PDFLib.rgb(r, g, b),
                        backgroundColor: PDFLib.rgb(1, 1, 1),
                        borderSize: 1,
                        borderColor: PDFLib.rgb(0.23, 0.23, 0.23)
                    });
                    comboboxForm.updateAppearances(customFont);
                    comboboxForm.defaultUpdateAppearances(customFont);
                    comboboxForm.setFontSize(form_item.fontSize);
                    break;
                case LIST:
                    listboxForm = form.createOptionList(form_item.form_field_name);
                    listboxForm.addOptions(form_item.optionArray);
                    listboxForm.addToPage(page, {
                        x: form_item.x,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height,
                        textColor: PDFLib.rgb(r, g, b),
                        backgroundColor: PDFLib.rgb(1, 1, 1),
                        borderColor: PDFLib.rgb(1, 1, 1)
                    });
                    listboxForm.updateAppearances(customFont);
                    listboxForm.defaultUpdateAppearances(customFont);
                    listboxForm.setFontSize(form_item.fontSize);
                    break;
                case BUTTON:
                    buttonfieldForm = form.createButton(form_item.form_field_name);
                    buttonfieldForm.addToPage(form_item.text, page, {
                        x: form_item.x,
                        y: form_item.y - form_item.height,
                        width: form_item.width,
                        height: form_item.height,
                        textColor: PDFLib.rgb(r, g, b),
                        backgroundColor: PDFLib.rgb(0.24, 0.59, 0.99)
                    });
                    buttonfieldForm.updateAppearances(customFont);
                    buttonfieldForm.defaultUpdateAppearances(customFont);
                    buttonfieldForm.setFontSize(form_item.fontSize);
                    let formScript = ''
                    if (form_item.action == SUBMIT) {
                        formScript = `
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var field = this.getField(fieldName);
                                field.readonly = true;
                            }
                            this.saveAs("flattened.pdf");
                        `;
                    } else if (form_item.action == RESET) {
                        formScript = `
                            console.show();
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var fieldType = this.getField(fieldName).type;
                        
                                // Check if the field is not a button
                                if (fieldType !== "button") {
                                    // Reset the value of the field
                                    this.getField(fieldName).value = "";
                                }
                            }
                        `;
                        // formScript = 'console.show(); console.println("Hello World!");';
                    } else if (form_item.action == NOACTION) {
                        formScript = `
                           console.show(); 
                        `
                        // console.show();
                        // myFunc = function(doc) {
                        //     app.beginPriv();
                        //     doc.getField("Signature").signatureSign({bUI:true});
                        //     app.endPriv();
                        //    }
                        // app.trustedFunction(myFunc);
                        // myFunc(this);
                        // var sign = this.getField("Signature");
                        // var run = app.trustedFunction(function() {
                        //     app.beginPriv();
                        //     sign.signatureSign({bUI:true});
                        //     app.endPriv();
                        // });
                        // run();
                    }

                    buttonfieldForm.acroField.getWidgets().forEach((widget) => {
                        widget.dict.set(
                            PDFLib.PDFName.of('AA'),
                            pdfDoc.context.obj({
                                U: {
                                    Type: 'Action',
                                    S: 'JavaScript',
                                    JS: PDFLib.PDFHexString.fromText(formScript),
                                },
                            }),
                        );
                    });
                    break;
                default:
                    break;
            }
        })
    }
    pdfBytes = await pdfDoc.save();
}