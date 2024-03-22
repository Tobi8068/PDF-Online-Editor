let baseId = 0;
let form_storage = [];
let current_form_id = 0;
let currentMode = null;
const CHECKBOX = 1,
  RADIO = 2,
  TEXTFIELD = 3,
  COMBOBOX = 4,
  LIST = 5,
  BUTTON = 6,
  TEXT_CONTENT = 7,
  DATE = 8,
  COMMENT = 9,
  SIGNATURE = 10,
  SHAPE = 11;
let checkboxCount = 1,
  radioCount = 1,
  textfieldCount = 1,
  comboCount = 1,
  listCount = 1,
  buttonCount = 1,
  datefieldCount = 1;
let isCheckbox = false,
  isRadioButton = false,
  isTextField = false,
  isCombo = false,
  isList = false,
  isButton = false,
  isDate = false,
  isSignature = false;

let comboboxOptionCount = 0;
let listboxOptionCount = 0;
let comboboxOptionArray = ["Option 1"];
let listboxOptionArray = ["List 1"];

let pos_x_pdf = 0,
  pos_y_pdf = 0;
let pos_x_page = 0,
  pos_y_page = 0;
let fontStyle = "",
  fontSize = 0,
  textColor = "";

const SUBMIT = 1,
  RESET = 2,
  NOACTION = 3;

const CHECKBOX_OPTION = "checkbox-option";
const RADIO_OPTION = "radio-button-option";
const TEXTFIELD_OPTION = "text-field-option";
const COMBOBOX_OPTION = "combo-option";
const LIST_OPTION = "list-option";
const BUTTON_OPTION = "button-field-option";
const TEXT_CONTENT_OPTION = "text-content-option";
const DATE_OPTION = "date-option";
const SIGNATURE_OPTION = "signature-creator";

const ALIGN_LEFT = 0,
  ALIGN_RIGHT = 2,
  ALIGN_CENTER = 1;
let alignValue = 0;

const absoluteOffset = { x: 10, y: 10 };

let pageWidth = 0,
  pageHeight = 0;

let isOptionPane = false;

let current_checkbox_id = 0;
let current_radio_id = 0;
let current_text_id = 0;
let current_combo_id = 0;
let current_list_id = 0;
let current_button_id = 0;
let current_date_id = 0;
let current_date_content_id = 0;
let current_signature_id = 0;
let current_shape_id = 0;

let signatureImgData, shapeImgData;

let boundingBox;

const fontStyleArr = [
  "Courier",
  "Helvetica",
  "TimesRoman",
  "Arial",
  "Calibri",
  "Consolas",
  "Georgia",
  "Tahoma",
  "Verdana",
];

const fontSizeArr = [
  "auto",
  4,
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  24,
  36,
  48,
  64,
  72,
  96,
  144,
  192,
];

let formWidth = 25;
let formHeight = 25;

let selectedAlign = "",
  groupNameAlign = "";

document.addEventListener("DOMContentLoaded", function () {
  console.log("load");
  loadFontFiles();
});

// Check the same form field name and modify field name
const checkFormField = function (id) {
  const formFieldName = document.getElementById(id).value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }
  return { count, formFieldName };
};

// Remove the parent event.
const removeParentEvent = function (id) {
  document.getElementById(id).addEventListener("click", function (e) {
    e.stopPropagation();
  });
  interact(`#${id}`).draggable({
    listeners: {
      move(event) {
        event.stopPropagation();
      },
    },
  });
};

function handleRadioSelection(event) {
  const selectedRadioButton = event.target;
  if (selectedRadioButton.checked) {
    selectedAlign = selectedRadioButton.value;
    groupNameAlign = selectedRadioButton.name;
    if (selectedAlign == "left") {
      alignValue = ALIGN_LEFT;
    } else if (selectedAlign == "center") {
      alignValue = ALIGN_CENTER;
    } else if (selectedAlign == "right") {
      alignValue = ALIGN_RIGHT;
    }
  }
}

// When click "Save" button, save the information of Checkbox element.

const handleCheckbox = function (e) {
  formWidth = 25;
  formHeight = 25;
  isOptionPane = false;
  document.getElementById(CHECKBOX_OPTION).style.display = "none";
  if (e) e.stopPropagation();

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
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.75,
      height: formHeight * 0.75 * 0.75,
      xPage: formWidth,
      yPage: formHeight,
      label: label,
      value: value,
    });
  }
  document
    .getElementById("checkbox-save-button")
    .removeEventListener("click", handleCheckbox);
};
// When click "Save" button, save the information of RadioGroup element.

const handleRadio = function (e) {
  formWidth = 25;
  formHeight = 25;
  isOptionPane = false;
  const label = document.getElementById("radio-label").value;
  const value = document.getElementById("radio-value").value;
  document.getElementById(RADIO_OPTION).style.display = "none";
  const formFieldName = document.getElementById("radio-field-input-name").value;
  if (e) e.stopPropagation();
  let count = 0,
    isData = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (form_storage[j].id != current_form_id) count++;
    if (form_storage[j].hasOwnProperty("data")) isData++;
  }
  if (form_storage.hasOwnProperty("data")) {
    for (let i = 0; i < form_storage.length; i++) {
      if (
        form_storage[i].data.option == formFieldName &&
        form_storage[i].id == current_form_id
      ) {
        break;
      } else if (
        form_storage[i].data.option != formFieldName &&
        form_storage[i].id == current_form_id
      ) {
        form_storage[i].data.option = formFieldName;
        break;
      }
    }
  } else if (!isData || count == form_storage.length) {
    form_storage.push({
      id: baseId,
      form_type: RADIO,
      page_number: PDFViewerApplication.page,
      data: {
        option: formFieldName,
        x: pos_x_pdf,
        y: pos_y_pdf,
        baseX: pos_x_pdf,
        baseY: pos_y_pdf,
        width: formWidth * 0.75 * 0.75,
        height: formHeight * 0.75 * 0.75,
        xPage: formWidth,
        yPage: formHeight,
        label: label,
        value: value,
      },
    });
  }
  document
    .getElementById("radio-save-button")
    .removeEventListener("click", handleRadio);
};
// When click "Save" button, save the information of TextField element.

const handleText = function (e) {
  formWidth = 300;
  formHeight = 40;
  isOptionPane = false;
  document.getElementById(TEXTFIELD_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("text-field-input-name").value;
  fontStyle = generateFontName("text-font-style");
  fontSize = parseInt(document.getElementById("text-font-size").value);
  const regularFont = document.getElementById("text-font-style").value;
  textColor = document.getElementById("text-font-color").value;

  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].fontStyle = fontStyle;
      form_storage[i].fontSize = fontSize;
      form_storage[i].textColor = textColor;
      form_storage[i].align = alignValue;
      form_storage[i].isBold = isBold;
      form_storage[i].isItalic = isItalic;
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  if (count == form_storage.length || form_storage == null) {
    form_storage.push({
      id: baseId,
      form_type: TEXTFIELD,
      form_field_name: formFieldName,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      regularFontStyle: regularFont,
      isBold: isBold,
      isItalic: isItalic,
      fontSize: fontSize,
      textColor: textColor,
      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    alignValue = 0;
  }
  document
    .getElementById("text-save-button")
    .removeEventListener("click", handleText);
  removeBoldItalicEvent();
};
// When click "Save" button, save the information of Combobox element.

const handleCombo = function (e) {
  formWidth = 300;
  formHeight = 40;
  isOptionPane = false;
  document.getElementById(COMBOBOX_OPTION).style.display = "none";
  if (e) e.stopPropagation();

  const formFieldName = document.getElementById("combo-input-name").value;
  fontStyle = generateFontName("combo-font-style");
  fontSize = parseInt(document.getElementById("combo-font-size").value);
  textColor = document.getElementById("combo-font-color").value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].optionArray =
        form_storage[i].optionArray.concat(comboboxOptionArray);
      form_storage[i].fontStyle = fontStyle;
      form_storage[i].fontSize = fontSize;
      form_storage[i].textColor = textColor;
      // form_storage[i].align = alignValue;
      comboboxOptionArray = [];
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
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
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    alignValue = 0;
    comboboxOptionArray = [];
  }
  document
    .getElementById("combo-save-button")
    .removeEventListener("click", handleCombo);
};
// When click "Save" button, save the information of Listbox element.

const handleList = function (e) {
  formWidth = 300;
  formHeight = 120;
  document.getElementById(LIST_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("list-input-name").value;
  fontStyle = document.getElementById("list-font-style").value;
  fontSize = parseInt(document.getElementById("list-font-size").value);
  textColor = document.getElementById("list-font-color").value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].optionArray =
        form_storage[i].optionArray.concat(listboxOptionArray);
      form_storage[i].fontStyle = fontStyle;
      form_storage[i].fontSize = fontSize;
      form_storage[i].textColor = textColor;
      // form_storage[i].align = alignValue;
      listboxOptionArray = [];
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
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
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    alignValue = 0;
    listboxOptionArray = [];
  }
  document
    .getElementById("list-save-button")
    .removeEventListener("click", handleCombo);
};

// Display 4 points around the canvas to resize the canvas - top, left, right, bottom.
const addResizebar = function (objectId) {
  const topLeft = document.createElement("div");
  topLeft.id = "topLeft";
  topLeft.classList.add("resize-point");
  topLeft.classList.add("top-left");
  topLeft.classList.add("resize-l");
  topLeft.classList.add("resize-t");
  const top = document.createElement("div");
  top.id = "top";
  top.classList.add("resize-point");
  top.classList.add("top-center");
  top.classList.add("resize-t");
  const topRight = document.createElement("div");
  topRight.id = "topRight";
  topRight.classList.add("resize-point");
  topRight.classList.add("top-right");
  topRight.classList.add("resize-r");
  topRight.classList.add("resize-t");
  const left = document.createElement("div");
  left.id = "left";
  left.classList.add("resize-point");
  left.classList.add("middle-left");
  left.classList.add("resize-l");
  const right = document.createElement("div");
  right.id = "right";
  right.classList.add("resize-point");
  right.classList.add("middle-right");
  right.classList.add("resize-r");
  const bottomLeft = document.createElement("div");
  bottomLeft.id = "bottomLeft";
  bottomLeft.classList.add("resize-point");
  bottomLeft.classList.add("bottom-left");
  bottomLeft.classList.add("resize-l");
  bottomLeft.classList.add("resize-b");
  const bottom = document.createElement("div");
  bottom.id = "bottom";
  bottom.classList.add("resize-point");
  bottom.classList.add("bottom-center");
  bottom.classList.add("resize-b");
  const bottomRight = document.createElement("div");
  bottomRight.id = "bottomRight";
  bottomRight.classList.add("resize-point");
  bottomRight.classList.add("bottom-right");
  bottomRight.classList.add("resize-r");
  bottomRight.classList.add("resize-b");
  const container = document.getElementById(objectId);
  container.append(
    top,
    left,
    right,
    bottom,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  );
};

const removeResizebar = function (objectId) {
  const container = document.getElementById(objectId);
  const resizePoints = [
    "topLeft",
    "top",
    "topRight",
    "left",
    "right",
    "bottomLeft",
    "bottom",
    "bottomRight",
  ];
  if (container) {
    resizePoints.forEach((item) => {
      let childElement = document.getElementById(item);
      if (container && childElement) {
        container.removeChild(childElement);
      } else {
        console.log("Child element with id " + item + "not found");
      }
    });
  } else {
    console.log("Parent element not found");
  }
};

// Show the OptionPane to edit the properties of elements.

const showOption = function (id, x, y) {
  const fieldOption = document.getElementById(id);

  if (fieldOption) {
    if (isOptionPane) fieldOption.style.display = "flex";
    else fieldOption.style.display = "none";

    fieldOption.style.top = y + "px";
    fieldOption.style.left = x + "px";

    return fieldOption;
  } else return null;
};

// When click "Save" button, save the information of Button element.
const handleButton = function (e) {
  formWidth = 160;
  formHeight = 40;
  isOptionPane = false;
  document.getElementById(BUTTON_OPTION).style.display = "none";
  let form_action = 0;
  const selectedValue = document.getElementById(
    "button-field-input-action"
  ).value;
  if (selectedValue === "submit") {
    form_action = SUBMIT;
  } else if (selectedValue === "reset") {
    form_action = RESET;
  } else if (selectedValue === "no_action") {
    form_action = NOACTION;
  }
  if (e) e.stopPropagation();

  const formFieldName = document.getElementById(
    "button-field-input-name"
  ).value;
  let initialValue = document.getElementById("button-text").value;
  fontStyle = document.getElementById("button-font-style").value;
  fontSize = parseInt(document.getElementById("button-font-size").value);
  textColor = document.getElementById("button-font-color").value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].action = form_action;
      form_storage[i].fontStyle = fontStyle;
      form_storage[i].fontSize = fontSize;
      form_storage[i].textColor = textColor;
      form_storage[i].text = initialValue;
      form_storage[i].align = alignValue;
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      form_storage[i].action = form_action;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
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
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    alignValue = 0;
    form_action = 0;
  }
  document
    .getElementById("button-save-button")
    .removeEventListener("click", handleButton);
};

const handleDate = function (e) {
  formWidth = 160;
  formHeight = 40;
  isOptionPane = false;
  document.getElementById(DATE_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("date-input-name").value;
  fontStyle = generateFontName("date-font-style");
  fontSize = parseInt(document.getElementById("date-font-size").value);
  textColor = document.getElementById("date-font-color").value;
  const regularFont = document.getElementById("date-font-style").value;
  const text = document.getElementById(current_date_content_id).value;

  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].fontStyle = fontStyle;
      form_storage[i].fontSize = fontSize * 0.75 * 0.8;
      form_storage[i].textColor = textColor;
      form_storage[i].text = text;
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (form_storage[j].id != current_form_id) count++;
  }
  if (count == form_storage.length || form_storage == null) {
    form_storage.push({
      id: baseId,
      form_type: DATE,
      form_field_name: formFieldName,
      page_number: PDFViewerApplication.page,
      text: text,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      fontStyle: fontStyle,
      regularFontStyle: regularFont,
      fontSize: fontSize * 0.75 * 0.8,
      baseFontSize: fontSize,
      textColor: textColor,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
  }
  document
    .getElementById("date-save-button")
    .removeEventListener("click", handleDate);
};

const handleSignature = function () {
  formWidth = 160;
  formHeight = 80;
  form_storage.push({
    id: baseId,
    form_type: SIGNATURE,
    page_number: PDFViewerApplication.page,
    x: pos_x_pdf,
    y: pos_y_pdf,
    baseX: pos_x_pdf,
    baseY: pos_y_pdf,
    width: formWidth * 0.75 * 0.8,
    height: formHeight * 0.75 * 0.8,
    xPage: formWidth,
    yPage: formHeight,
    imgData: signatureImgData,
  });
  console.log(form_storage)
};

// Resize and move canvas using Interact.js library.
const resizeCanvas = function (id, type, currentId, optionId) {
  let newX = 0,
    newY = 0;

  DrawType = type;
  const interactInstance = interact(`#${id}`)
    .resizable({
      // resize from all edges and corners
      edges: {
        left: ".resize-l",
        right: ".resize-r",
        bottom: ".resize-b",
        top: ".resize-t",
      },

      listeners: {
        move(event) {
          var target = event.target;
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;

          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.transform = "translate(" + x + "px," + y + "px)";

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);

          resizeHandler(event.rect.width, event.rect.height, currentId);
          showOption(
            optionId,
            event.rect.width / 2 - 180,
            event.rect.height + 15
          );
        },
        end(event) {
          let target = event.target;
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;
          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          moveEventHandler(event, x, y, currentId);
        },
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 15, height: 15 },
        }),
      ],

      inertia: true,
    })
    .draggable({
      listeners: {
        move(event) {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          if (DrawType === RADIO) {
            form_storage.map(function (item) {
              if (item.id === parseInt(currentId)) {
                let posXpdf = item.data.baseX + x * 0.75 * 0.8;
                let posYpdf =
                  item.data.baseY - y * 0.75 * 0.8 - item.data.height;
                if (posXpdf < 0) {
                  newX = 0 - item.data.baseX / 0.75 / 0.8;
                } else if (posXpdf + item.data.width >= pageWidth) {
                  newX =
                    (pageWidth - item.data.width - item.data.baseX) /
                    0.75 /
                    0.8;
                } else newX = x;
                if (posYpdf < 0) {
                  newY = (item.data.baseY - item.data.height) / 0.75 / 0.8;
                } else if (posYpdf + item.data.height >= pageHeight) {
                  newY = (item.data.baseY - pageHeight) / 0.75 / 0.8;
                } else newY = y;
              }
            });
          } else if (DrawType === TEXT_CONTENT) {
            text_storage.map(function (item) {
              if (item.id === parseInt(currentId)) {
                let posXpdf = item.baseX + x * 0.75 * 0.8;
                let posYpdf = item.baseY - y * 0.75 * 0.8 - item.height;
                if (posXpdf < 0) {
                  newX = 0 - item.baseX / 0.75 / 0.8;
                } else if (posXpdf + item.width >= pageWidth) {
                  newX = (pageWidth - item.width - item.baseX) / 0.75 / 0.8;
                } else newX = x;
                if (posYpdf < 0) {
                  newY = (item.baseY - item.height) / 0.75 / 0.8;
                } else if (posYpdf + item.height >= pageHeight) {
                  newY = (item.baseY - pageHeight) / 0.75 / 0.8;
                } else newY = y;
              }
            });
          } else if (DrawType === COMMENT) {
            comment_storage.map(function (item) {
              if (item.id === parseInt(currentId)) {
                let posXpdf = item.baseX + x * 0.75 * 0.8;
                let posYpdf = item.baseY - y * 0.75 * 0.8 - item.height;
                if (posXpdf < 0) {
                  newX = 0 - item.baseX / 0.75 / 0.8;
                } else if (posXpdf + item.width >= pageWidth) {
                  newX = (pageWidth - item.width - item.baseX) / 0.75 / 0.8;
                } else newX = x;
                if (posYpdf < 0) {
                  newY = (item.baseY - item.height) / 0.75 / 0.8;
                } else if (posYpdf + item.height >= pageHeight) {
                  newY = (item.baseY - pageHeight) / 0.75 / 0.8;
                } else newY = y;
              }
            });
          } else {
            form_storage.map(function (item) {
              if (item.id === parseInt(currentId)) {
                let posXpdf = item.baseX + x * 0.75 * 0.8;
                let posYpdf = item.baseY - y * 0.75 * 0.8 - item.height;
                if (posXpdf < 0) {
                  newX = 0 - item.baseX / 0.75 / 0.8;
                } else if (posXpdf + item.width >= pageWidth) {
                  newX = (pageWidth - item.width - item.baseX) / 0.75 / 0.8;
                } else newX = x;
                if (posYpdf < 0) {
                  newY = (item.baseY - item.height) / 0.75 / 0.8;
                } else if (posYpdf + item.height >= pageHeight) {
                  newY = (item.baseY - pageHeight) / 0.75 / 0.8;
                } else newY = y;
              }
            });
          }
          // translate the element
          target.style.transform = "translate(" + newX + "px, " + newY + "px)";

          // update the position attributes
          target.setAttribute("data-x", newX);
          target.setAttribute("data-y", newY);
        },
        end(event) {
          const target = event.target;
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          moveEventHandler(event, newX, newY, currentId);
        },
      },
    });
  if (DrawType == TEXT_CONTENT) {
    let containerId = `text-content${current_text_num_id}`;
    let container = document.getElementById(containerId);
    let currentText = document.getElementById(current_text_content_id);
    currentText.addEventListener("focus", function () {
      if (!container.classList.contains("textfield-content"))
        container.classList.add("textfield-content");
      if (!document.getElementById("topLeft")) addResizebar(containerId);
    });
    container.addEventListener("dblclick", function (event) {
      event.stopPropagation();
      if (!container.classList.contains("textfield-content"))
        container.classList.add("textfield-content");
      interactInstance.draggable(false);
    });

    container.addEventListener("focus", function () {
      interactInstance.draggable(false);
      if (!container.classList.contains("textfield-content"))
        container.classList.add("textfield-content");
      if (!document.getElementById("topLeft")) addResizebar(containerId);
    });
    container.addEventListener("blur", function (event) {
      interactInstance.draggable(true);
      if (document.getElementById("topLeft")) removeResizebar(containerId);
      if (container.classList.contains("textfield-content"))
        container.classList.remove("textfield-content");
      const deleteButton = document.getElementById(
        "text-content_tooltipbar" + current_text_num_id
      );
      if (deleteButton) deleteButton.remove();
      const inputElements = container.querySelectorAll("input");
      const selectElements = container.querySelectorAll("select");
      const buttonElements = container.querySelectorAll("button");

      if (
        !event.relatedTarget ||
        ![...inputElements, ...selectElements, ...buttonElements].includes(
          event.relatedTarget
        )
      ) {
        document.getElementById(TEXT_CONTENT_OPTION).style.display = "none";
      }
    });
  } else if (DrawType == SIGNATURE) {
    let currentSignId = `signature${currentId}`;
    let signatureImg = document.getElementById(`signatureImg${currentId}`);
    document.addEventListener("click", function (event) {
      if (event.target === signatureImg) {
        if (!document.getElementById("topLeft")) {
          document
            .getElementById(currentSignId)
            .classList.add("border-resizebar");
          addResizebar(currentSignId);
        }
      } else {
        if (document.getElementById("topLeft")) {
          document
            .getElementById(currentSignId)
            .classList.remove("border-resizebar");
          removeResizebar(currentSignId);
        }
      }
    });
  } else if (DrawType === SHAPE) {
    let currentShapeId = `shape${currentId}`;
    let shapeImg = document.getElementById(`shapeImg${currentId}`);
    document.addEventListener("click", function (event) {
      if (event.target === shapeImg) {
        if (!document.getElementById("topLeft")) {
          document
            .getElementById(currentShapeId)
            .classList.add("border-resizebar");
          addResizebar(currentShapeId);
        }
      } else {
        if (document.getElementById("topLeft")) {
          document
            .getElementById(currentShapeId)
            .classList.remove("border-resizebar");
          removeResizebar(currentShapeId);
        }
      }
    });
  } else {
    let object = document.getElementById(id);
    object.addEventListener("focus", function () {
      addResizebar(id);
    });

    object.addEventListener("blur", function (event) {
      removeResizebar(id);
      const inputElements = object.querySelectorAll("input");
      const selectElements = object.querySelectorAll("select");
      const buttonElements = object.querySelectorAll("button");
      const divElements = object.querySelectorAll("div");

      if (
        !event.relatedTarget ||
        ![
          ...inputElements,
          ...selectElements,
          ...buttonElements,
          ...divElements,
        ].includes(event.relatedTarget)
      ) {
        document.getElementById(optionId).style.display = "none";
        switch (DrawType) {
          case CHECKBOX:
            const deleteCheck = document.getElementById(
              `checkbox_tooltipbar${current_checkbox_id}`
            );
            if (deleteCheck) deleteCheck.remove();
            break;
          case RADIO:
            const deleteRadio = document.getElementById(
              `radio_tooltipbar${current_radio_id}`
            );
            if (deleteRadio) deleteRadio.remove();
            break;
          case TEXTFIELD:
            const deleteText = document.getElementById(
              `text_tooltipbar${current_text_id}`
            );
            if (deleteText) deleteText.remove();
            break;
          case COMBOBOX:
            const deleteCombo = document.getElementById(
              `combo_tooltipbar${current_combo_id}`
            );
            if (deleteCombo) deleteCombo.remove();
            break;
          case LIST:
            const deleteList = document.getElementById(
              `list_tooltipbar${current_list_id}`
            );
            if (deleteList) deleteList.remove();
            break;
          case BUTTON:
            const deleteButton = document.getElementById(
              `button_tooltipbar${current_button_id}`
            );
            if (deleteButton) deleteButton.remove();
            break;
          case DATE:
            const deleteDate = document.getElementById(
              `date_tooltipbar${current_date_id}`
            );
            if (deleteDate) deleteDate.remove();
            break;
          default:
            break;
        }
      }
    });

    document.addEventListener("click", function (event) {
      if (event.target === object) {
        object.focus();
      }
    });
  }
};

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
  } else if (DrawType == TEXT_CONTENT) {
    text_storage.map(function (item) {
      if (item.id === currentId) {
        item.width = width * 0.75 * 0.75;
        item.height = height * 0.75 * 0.75;
        item.xPage = width;
        item.yPage = height;
      }
    });
  } else {
    form_storage.map(function (item) {
      if (item.id === parseInt(currentId)) {
        item.width = width * 0.75 * 0.8;
        item.height = height * 0.75 * 0.8;
        item.xPage = width;
        item.yPage = height;
      }
    });
  }
};

const hexToRgb = function (hex) {
  // Remove the '#' at the beginning if present
  hex = hex.replace("#", "");

  // Parse the hexadecimal color components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return { r, g, b };
};

// Show the specified OptionPane and add resizebar.
const showOptionAndResizebar = function (
  optionId,
  object,
  objectWidth,
  objectHeight,
  id
) {
  isOptionPane = true;
  let option = showOption(optionId, objectWidth / 2 - 180, objectHeight + 15);
  removeParentEvent(optionId);
  // addResizebar(object.id);
  object.append(option);
  if (optionId != CHECKBOX_OPTION && optionId != RADIO_OPTION) {
    let selectStyleContent = "";
    let selectSizeContent = "";
    fontStyleArr.map((item) => {
      selectStyleContent += `<option value=${item} style="font-family: ${item}">${item}</option>`;
    });
    fontSizeArr.map((item) => {
      if (item == "auto")
        selectSizeContent += `<option value='16'}>Default</option>`;
      else selectSizeContent += `<option value=${item}>${item}</option>`;
    });
    document.getElementById(`${id}-font-style`).innerHTML = selectStyleContent;
    document.getElementById(`${id}-font-size`).innerHTML = selectSizeContent;
  }
};
// Add Delete button and define action.
const addDeleteButton = function (currentId, container, object, type) {
  const left = object.style.width;
  const top = object.style.height;

  container.id = `${type}_tooltipbar` + currentId;
  container.style.position = "absolute";
  container.style.zIndex = 100;
  container.style.top = "0px";
  container.style.left = parseInt(left) + 10 + "px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.gap = "5px";
  container.style.height = parseInt(top) + "px";
  let deleteBtn = document.createElement("button");
  deleteBtn.style.padding = "5px";
  deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`;

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentId = container.id.replace(`${type}_tooltipbar`, "");
    document.getElementById(`${type}` + currentId).style.display = "none";
    if (type == "text-content") {
      text_storage = text_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
    } else if (type == "comment") {
      comment_storage = comment_storage.filter(function (comment) {
        return comment.id !== parseInt(currentId);
      });
    } else {
      form_storage = form_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
    }
  });
  document.addEventListener("keydown", (e) => {
    if (type != "text-content" && e.key === "Delete") {
      currentId = container.id.replace(`${type}_tooltipbar`, "");
      document.getElementById(`${type}` + currentId).style.display = "none";
      form_storage = form_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
    }
  });
  container.appendChild(deleteBtn);
  object.appendChild(container);
};

const resetCanvas = function () {
  const canvas = document
    .getElementById("signature-draw-body")
    .querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Handle the specified event.
const eventHandler = async function (e) {
  baseId++;
  let ost = computePageOffset();
  let x = e.pageX - ost.left;
  let y = e.pageY - ost.top;

  let pageId = String(PDFViewerApplication.page);
  let pg = document.getElementById(pageId);
  let rect = pg.getBoundingClientRect();
  let top = rect.top;
  let left = rect.left;

  switch (currentMode) {
    case CHECKBOX:
      removeCheckbox();

      let new_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = new_x_y[0];
      pos_y_pdf = new_x_y[1];

      let checkboxId = baseId;
      current_form_id = checkboxId;

      const checkboxWidth = 25;
      const checkboxHeight = 25;

      let checkbox = document.createElement("div");
      checkbox.id = "checkbox" + checkboxId;
      checkbox.style.position = "absolute";
      checkbox.style.top = e.pageY - top - absoluteOffset.y + "px";
      checkbox.style.left = e.pageX - left - absoluteOffset.x + "px";
      checkbox.style.width = checkboxWidth + "px";
      checkbox.style.height = checkboxHeight + "px";
      checkbox.style.background = "#3C97FE80";
      checkbox.style.zIndex = 100;
      checkbox.tabIndex = 0;

      pg.appendChild(checkbox);

      // Show Checkbox OptionPane
      showOptionAndResizebar(
        CHECKBOX_OPTION,
        checkbox,
        checkboxWidth,
        checkboxHeight
      );

      document.getElementById(
        "checkbox-field-input-name"
      ).value = `Checkbox Form Field ${checkboxCount++}`;
      document.getElementById(
        "checkbox-label"
      ).value = `Label ${checkboxCount}`;
      document.getElementById(
        "checkbox-value"
      ).value = `Value ${checkboxCount}`;

      checkbox.addEventListener("dblclick", () => {
        current_checkbox_id = checkboxId;

        let istooltipshow = false;

        if (
          document.getElementById("checkbox_tooltipbar" + current_checkbox_id)
        ) {
          istooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!istooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = checkboxId;
            form_storage.map((element) => {
              if (element.id == checkboxId) {
                document.getElementById("checkbox-field-input-name").value =
                  element.form_field_name;
                document.getElementById("checkbox-label").value = element.label;
                document.getElementById("checkbox-value").value = element.value;
                isOptionPane = true;
                option = showOption(
                  CHECKBOX_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                checkbox.append(option);
              }
            });

            document
              .getElementById("checkbox-save-button")
              .addEventListener("click", handleCheckbox);

            addDeleteButton(
              current_checkbox_id,
              tooltipbar,
              checkbox,
              "checkbox"
            );
          } else {
            document
              .getElementById("checkbox_tooltipbar" + current_checkbox_id)
              .remove();
          }
        }
      });

      handleCheckbox();

      document
        .getElementById("checkbox-save-button")
        .addEventListener("click", handleCheckbox);
      resizeCanvas(checkbox.id, CHECKBOX, checkboxId, CHECKBOX_OPTION);

      break;
    case RADIO:
      removeRadio();

      let radio_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = radio_x_y[0];
      pos_y_pdf = radio_x_y[1];

      let radioId = baseId;
      current_form_id = radioId;

      const radioWidth = 25;
      const radioHeight = 25;

      let radio = document.createElement("div");
      radio.id = "radio" + radioId;
      radio.style.position = "absolute";
      radio.style.top = e.pageY - top - absoluteOffset.y + "px";
      radio.style.left = e.pageX - left - absoluteOffset.x + "px";
      radio.style.borderRadius = "50%";
      radio.style.width = "25px";
      radio.style.height = "25px";
      radio.style.background = "#3C97FE80";
      radio.style.zIndex = 100;
      radio.tabIndex = 0;

      pg.appendChild(radio);

      // Show RadioGroup OptinePane
      showOptionAndResizebar(RADIO_OPTION, radio, radioWidth, radioHeight);

      document.getElementById(
        "radio-field-input-name"
      ).value = `Radio Group Form Field ${radioCount++}`;
      document.getElementById("radio-label").value = `Label ${radioCount}`;
      document.getElementById("radio-value").value = `Value ${radioCount}`;

      radio.addEventListener("dblclick", () => {
        current_radio_id = radioId;

        let isradiotooltipshow = false;

        if (document.getElementById("radio_tooltipbar" + current_radio_id)) {
          isradiotooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!isradiotooltipshow) {
            let tooltipbar = document.createElement("div");

            current_form_id = radioId;
            form_storage.map((element) => {
              if (element.id == radioId) {
                document.getElementById("radio-field-input-name").value =
                  element.data.option;
                document.getElementById("radio-label").value =
                  element.data.label;
                document.getElementById("radio-value").value =
                  element.data.value;
                isOptionPane = true;
                option = showOption(
                  RADIO_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                radio.append(option);
              }
            });

            document
              .getElementById("radio-save-button")
              .addEventListener("click", handleRadio);

            addDeleteButton(current_radio_id, tooltipbar, radio, "radio");

            radio.appendChild(tooltipbar);
          } else {
            document
              .getElementById("radio_tooltipbar" + current_radio_id)
              .remove();
          }
        }
      });

      handleRadio();

      document
        .getElementById("radio-save-button")
        .addEventListener("click", handleRadio);
      resizeCanvas(radio.id, RADIO, radioId, RADIO_OPTION);

      break;
    case TEXTFIELD:
      removeText();

      let text_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = text_x_y[0];
      pos_y_pdf = text_x_y[1];

      let textId = baseId;
      current_form_id = textId;

      const textWidth = 300;
      const textHeight = 40;

      let textDiv = document.createElement("div");
      textDiv.id = "text" + textId;
      textDiv.style.position = "absolute";
      textDiv.style.top = e.pageY - top - absoluteOffset.y + "px";
      textDiv.style.left = e.pageX - left - absoluteOffset.x + "px";
      textDiv.style.width = textWidth + "px";
      textDiv.style.height = textHeight + "px";
      textDiv.style.background = "#3C97FE80";
      textDiv.style.zIndex = 100;
      textDiv.tabIndex = 0;

      pg.appendChild(textDiv);

      // Show TextField OptionPane
      showOptionAndResizebar(
        TEXTFIELD_OPTION,
        textDiv,
        textWidth,
        textHeight,
        "text"
      );
      const textfieldAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      textfieldAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "text-field-input-name"
      ).value = `Text Form Field ${textfieldCount++}`;
      textDiv.addEventListener("dblclick", () => {
        current_text_id = textId;

        let istexttooltipshow = false;

        if (document.getElementById("text_tooltipbar" + current_text_id)) {
          istexttooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!istexttooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = textId;

            form_storage.map((element) => {
              if (element.id == textId) {
                document.getElementById("text-field-input-name").value =
                  element.form_field_name;
                isOptionPane = true;
                option = showOption(
                  TEXTFIELD_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                document.getElementById("text-font-style").value =
                  element.fontStyle;
                document.getElementById("text-font-size").value =
                  element.fontSize;
                document.getElementById("text-font-color").value =
                  element.textColor;
                let selected = element.align;
                if (selected == ALIGN_LEFT)
                  document.getElementById("text-left").checked = true;
                if (selected == ALIGN_CENTER)
                  document.getElementById("text-center").checked = true;
                if (selected == ALIGN_RIGHT)
                  document.getElementById("text-right").checked = true;
                textDiv.append(option);
              }
            });

            document
              .getElementById("text-save-button")
              .addEventListener("click", handleText);

            addDeleteButton(current_text_id, tooltipbar, textDiv, "text");
          } else {
            document
              .getElementById("text_tooltipbar" + current_text_id)
              .remove();
          }
        }
      });

      handleText();

      document
        .getElementById("text-save-button")
        .addEventListener("click", handleText);
      resizeCanvas(textDiv.id, TEXTFIELD, textId, TEXTFIELD_OPTION);

      break;
    case COMBOBOX:
      document.getElementById("option-content").innerHTML = "";
      removeCombo();

      let combo_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = combo_x_y[0];
      pos_y_pdf = combo_x_y[1];

      let comboId = baseId;
      current_form_id = comboId;

      const comboWidth = 300;
      const comboHeight = 40;

      let comboDiv = document.createElement("div");
      comboDiv.id = "combo" + comboId;
      comboDiv.style.position = "absolute";
      comboDiv.style.top = e.pageY - top - absoluteOffset.y + "px";
      comboDiv.style.left = e.pageX - left - absoluteOffset.x + "px";
      comboDiv.style.width = comboWidth + "px";
      comboDiv.style.height = comboHeight + "px";
      comboDiv.style.background = "#3C97FE80";
      comboDiv.style.zIndex = 100;
      comboDiv.tabIndex = 0;

      pg.appendChild(comboDiv);

      // Show Combobox OptionPane
      showOptionAndResizebar(
        COMBOBOX_OPTION,
        comboDiv,
        comboWidth,
        comboHeight,
        "combo"
      );
      const comboAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      comboAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "combo-input-name"
      ).value = `Combobox Form Field ${comboCount++}`;

      comboDiv.addEventListener("dblclick", (e) => {
        current_combo_id = comboId;

        let iscombotooltipshow = false;

        if (document.getElementById("combo_tooltipbar" + current_combo_id)) {
          iscombotooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!iscombotooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = comboId;
            document.getElementById("option-content").innerHTML = "";
            form_storage.map((element) => {
              if (element.id == comboId) {
                document.getElementById("combo-input-name").value =
                  element.form_field_name;
                isOptionPane = true;
                option = showOption(
                  COMBOBOX_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                document.getElementById("combo-font-style").value =
                  element.fontStyle;
                document.getElementById("combo-font-size").value =
                  element.fontSize;
                document.getElementById("combo-font-color").value =
                  element.textColor;
                element.optionArray.map((elementItem) => {
                  const optionContent = document.createElement("div");
                  const deleteDivId = `delete-span-${comboboxOptionCount}`;
                  optionContent.id = `comboOption${deleteDivId}`;
                  optionContent.className = "combobox-options-content";
                  const contentSpan = document.createElement("span");
                  contentSpan.textContent = elementItem;
                  const deleteSpan = document.createElement("span");
                  deleteSpan.className = "option-delete";
                  deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                  deleteSpan.addEventListener("click", function () {
                    // Remove the corresponding div when the delete span is clicked
                    element = element.optionArray.filter(function (item) {
                      return item !== elementItem;
                    });
                    optionContent.remove();
                  });
                  optionContent.append(contentSpan, deleteSpan);
                  document
                    .getElementById("option-content")
                    .append(optionContent);
                });
                comboDiv.append(option);
              }
            });

            document
              .getElementById("combo-save-button")
              .addEventListener("click", handleCombo);

            addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo");
          } else {
            document
              .getElementById("combo_tooltipbar" + current_combo_id)
              .remove();
          }
        }
      });

      handleCombo();

      document.getElementById("add-option").addEventListener("click", () => {
        const optionName = document.getElementById("option-description").value;
        const optionContainer = document.getElementById("option-content");
        const optionContent = document.createElement("div");
        const deleteDivId = `delete-span-${comboboxOptionCount}`;

        optionContent.id = `comboOption${deleteDivId}`;
        optionContent.className = "combobox-options-content";
        const contentSpan = document.createElement("span");
        contentSpan.textContent = optionName;

        const deleteSpan = document.createElement("span");
        deleteSpan.className = "option-delete";
        deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

        if (optionName != "") comboboxOptionArray.push(optionName);

        deleteSpan.addEventListener("click", function () {
          // Remove the corresponding div when the delete span is clicked
          comboboxOptionArray = comboboxOptionArray.filter(function (item) {
            return item !== optionName;
          });
          optionContent.remove();
        });
        optionContent.appendChild(contentSpan);
        optionContent.appendChild(deleteSpan);

        if (optionName != "") {
          optionContainer.appendChild(optionContent);
          comboboxOptionCount++;
        }

        document.getElementById("option-description").value = "";
      });

      document
        .getElementById("combo-save-button")
        .addEventListener("click", handleCombo);

      resizeCanvas(comboDiv.id, COMBOBOX, comboId, COMBOBOX_OPTION);
      break;
    case LIST:
      document.getElementById("option-content-list").innerHTML = "";
      removeList();

      let list_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = list_x_y[0];
      pos_y_pdf = list_x_y[1];

      let listId = baseId;
      current_form_id = listId;

      const listWidth = 300;
      const listHeight = 120;

      let listDiv = document.createElement("div");
      listDiv.id = "list" + listId;
      listDiv.style.position = "absolute";
      listDiv.style.top = e.pageY - top - absoluteOffset.y + "px";
      listDiv.style.left = e.pageX - left - absoluteOffset.x + "px";
      listDiv.style.width = listWidth + "px";
      listDiv.style.height = listHeight + "px";
      listDiv.style.background = "#3C97FE80";
      listDiv.style.zIndex = 100;
      listDiv.tabIndex = 0;

      pg.appendChild(listDiv);

      showOptionAndResizebar(
        LIST_OPTION,
        listDiv,
        listWidth,
        listHeight,
        "list"
      );
      const listAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      listAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "list-input-name"
      ).value = `Listbox Form Field ${listCount++}`;

      listDiv.addEventListener("dblclick", (e) => {
        current_list_id = listId;

        let islisttooltipshow = false;

        if (document.getElementById("list_tooltipbar" + current_list_id)) {
          islisttooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!islisttooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = listId;
            document.getElementById("option-content-list").innerHTML = "";
            form_storage.map((element) => {
              if (element.id == listId) {
                document.getElementById("list-input-name").value =
                  element.form_field_name;
                isOptionPane = true;
                option = showOption(
                  LIST_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                document.getElementById("list-font-style").value =
                  element.fontStyle;
                document.getElementById("list-font-size").value =
                  element.fontSize;
                document.getElementById("list-font-color").value =
                  element.textColor;
                element.optionArray.map((elementItem) => {
                  const optionContent = document.createElement("div");
                  const deleteDivId = `delete-span-${listboxOptionCount}`;
                  optionContent.id = `listOption${deleteDivId}`;
                  optionContent.className = "combobox-options-content";
                  const contentSpan = document.createElement("span");
                  contentSpan.textContent = elementItem;
                  const deleteSpan = document.createElement("span");
                  deleteSpan.className = "option-delete";
                  deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                  deleteSpan.addEventListener("click", function () {
                    // Remove the corresponding div when the delete span is clicked
                    element = element.filter(function (item) {
                      return item !== elementItem;
                    });
                    optionContent.remove();
                  });
                  optionContent.append(contentSpan, deleteSpan);
                  document
                    .getElementById("option-content-list")
                    .append(optionContent);
                });
                listDiv.append(option);
              }
            });
            document
              .getElementById("list-save-button")
              .addEventListener("click", handleList);

            addDeleteButton(current_list_id, tooltipbar, listDiv, "list");
          } else {
            document
              .getElementById("list_tooltipbar" + current_list_id)
              .remove();
          }
        }
      });

      handleList();

      document
        .getElementById("add-option-list")
        .addEventListener("click", () => {
          const optionName = document.getElementById(
            "option-description-list"
          ).value;
          const optionContainer = document.getElementById(
            "option-content-list"
          );
          const optionContent = document.createElement("div");
          const deleteDivId = `delete-span-${listboxOptionCount}`;

          optionContent.id = `listOption${deleteDivId}`;
          optionContent.className = "combobox-options-content";
          const contentSpan = document.createElement("span");
          contentSpan.textContent = optionName;

          const deleteSpan = document.createElement("span");
          deleteSpan.className = "option-delete";
          deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

          if (optionName != "") listboxOptionArray.push(optionName);

          deleteSpan.addEventListener("click", function () {
            // Remove the corresponding div when the delete span is clicked
            listboxOptionArray = listboxOptionArray.filter(function (item) {
              return item !== optionName;
            });
            optionContent.remove();
          });
          optionContent.appendChild(contentSpan);
          optionContent.appendChild(deleteSpan);

          if (optionName != "") {
            optionContainer.appendChild(optionContent);
            listboxOptionCount++;
          }

          document.getElementById("option-description-list").value = "";
        });

      document
        .getElementById("list-save-button")
        .addEventListener("click", handleList);

      resizeCanvas(listDiv.id, LIST, listId, LIST_OPTION);
      break;
    case BUTTON:
      removeButton();
      document.getElementById("button-field-input-action").value = "submit";

      let button_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = button_x_y[0];
      pos_y_pdf = button_x_y[1];

      let buttonId = baseId;
      current_form_id = buttonId;

      const buttonWidth = 160;
      const buttonHeight = 40;

      let buttonDiv = document.createElement("div");
      buttonDiv.style.position = "absolute";
      buttonDiv.style.top = e.pageY - top - absoluteOffset.y + "px";
      buttonDiv.style.left = e.pageX - left - absoluteOffset.x + "px";
      buttonDiv.id = "button" + buttonId;
      buttonDiv.style.width = buttonWidth + "px";
      buttonDiv.style.height = buttonHeight + "px";
      buttonDiv.style.background = "#3C97FE80";
      buttonDiv.style.color = "white";
      buttonDiv.style.zIndex = 100;
      buttonDiv.tabIndex = 0;

      pg.appendChild(buttonDiv);

      showOptionAndResizebar(
        BUTTON_OPTION,
        buttonDiv,
        buttonWidth,
        buttonHeight,
        "button"
      );
      const buttonAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      buttonAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "button-field-input-name"
      ).value = `Button Form Field ${buttonCount++}`;
      document.getElementById("button-text").value = "Button";
      buttonDiv.addEventListener("dblclick", () => {
        current_button_id = buttonId;

        let isbuttontooltipshow = false;

        if (document.getElementById("button_tooltipbar" + current_button_id)) {
          isbuttontooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!isbuttontooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = buttonId;
            form_storage.map((element) => {
              if (element.id == buttonId) {
                document.getElementById("button-field-input-name").value =
                  element.form_field_name;
                isOptionPane = true;
                option = showOption(
                  BUTTON_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                document.getElementById("button-font-style").value =
                  element.fontStyle;
                document.getElementById("button-font-size").value =
                  element.fontSize;
                document.getElementById("button-font-color").value =
                  element.textColor;
                const selectedValue = document.getElementById(
                  "button-field-input-action"
                );
                if (element.action == SUBMIT) {
                  selectedValue.value = "submit";
                } else if (element.action == RESET) {
                  selectedValue.value = "reset";
                }
                buttonDiv.append(option);
              }
            });
            document
              .getElementById("button-save-button")
              .addEventListener("click", handleButton);
            addDeleteButton(current_button_id, tooltipbar, buttonDiv, "button");
          } else {
            document
              .getElementById("button_tooltipbar" + current_button_id)
              .remove();
          }
        }
      });

      handleButton();

      // const buttonValue = document.getElementById("button-text");
      // buttonValue.addEventListener('change', () => {
      //     document.getElementById(buttonDiv.id).textContent = buttonValue.value;
      // })

      document
        .getElementById("button-save-button")
        .addEventListener("click", handleButton);
      resizeCanvas(buttonDiv.id, BUTTON, buttonId, BUTTON_OPTION);
      break;
    case DATE:
      removeDate();

      let date_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = date_x_y[0];
      pos_y_pdf = date_x_y[1];

      let dateId = baseId;
      current_form_id = dateId;

      const dateWidth = 160;
      const dateHeight = 40;

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const newDate = document.createElement("input");
      newDate.id = "datecontent" + dateId;
      newDate.style.position = "relative";
      newDate.type = "date";
      newDate.style.width = "100%";
      newDate.style.height = "100%";
      newDate.classList.add("textcontent");
      newDate.value = formattedDate;

      let dateDiv = document.createElement("div");
      dateDiv.id = "date" + dateId;
      dateDiv.style.position = "absolute";
      dateDiv.style.top = e.pageY - top - absoluteOffset.y + "px";
      dateDiv.style.left = e.pageX - left - absoluteOffset.x + "px";
      dateDiv.style.width = dateWidth + "px";
      dateDiv.style.height = dateHeight + "px";
      dateDiv.style.zIndex = 100;
      dateDiv.style.background = "#3C97FE80";
      dateDiv.tabIndex = 0;
      dateDiv.classList.add("textfield-content");
      dateDiv.append(newDate);
      pg.appendChild(dateDiv);

      // Show TextField OptionPane
      showOptionAndResizebar(
        DATE_OPTION,
        dateDiv,
        dateWidth,
        dateHeight,
        "date"
      );

      newDate.style.fontFamily =
        document.getElementById("date-font-style").value;
      newDate.style.fontSize =
        document.getElementById("date-font-size").value + "px";
      newDate.style.color = document.getElementById("date-font-color").value;

      document
        .getElementById("date-font-style")
        .addEventListener("change", () => {
          document.getElementById(current_date_content_id).style.fontFamily =
            document.getElementById("date-font-style").value;
        });
      document
        .getElementById("date-font-size")
        .addEventListener("change", () => {
          document.getElementById(current_date_content_id).style.fontSize =
            document.getElementById("date-font-size").value + "px";
        });
      document
        .getElementById("date-font-color")
        .addEventListener("change", () => {
          document.getElementById(current_date_content_id).style.color =
            document.getElementById("date-font-color").value;
        });
      document.getElementById(
        "date-input-name"
      ).value = `Date Form Field ${datefieldCount++}`;

      current_date_id = dateId;
      current_date_content_id = newDate.id;

      dateDiv.addEventListener("dblclick", () => {
        current_date_id = dateId;
        current_date_content_id = newDate.id;

        let isdatetooltipshow = false;

        if (document.getElementById("date_tooltipbar" + current_date_id)) {
          isdatetooltipshow = true;
        }

        if (isDragging) {
          isDragging = false;
        } else {
          if (!isdatetooltipshow) {
            let tooltipbar = document.createElement("div");
            current_form_id = dateId;

            form_storage.map((element) => {
              if (element.id == dateId) {
                document.getElementById("date-input-name").value =
                  element.form_field_name;
                isOptionPane = true;
                option = showOption(
                  DATE_OPTION,
                  element.xPage / 2 - 180,
                  element.yPage + 15
                );
                document.getElementById("date-font-style").value =
                  element.fontStyle;
                document.getElementById("date-font-size").value =
                  element.baseFontSize;
                document.getElementById("date-font-color").value =
                  element.textColor;
                let selected = element.align;
                if (selected == ALIGN_LEFT)
                  document.getElementById("date-left").checked = true;
                if (selected == ALIGN_CENTER)
                  document.getElementById("date-center").checked = true;
                if (selected == ALIGN_RIGHT)
                  document.getElementById("date-right").checked = true;
                dateDiv.append(option);
              }
            });

            document
              .getElementById("date-save-button")
              .addEventListener("click", handleDate);

            addDeleteButton(current_date_id, tooltipbar, dateDiv, "date");
          } else {
            document
              .getElementById("date_tooltipbar" + current_date_id)
              .remove();
          }
        }
      });

      handleDate();

      document
        .getElementById("date-save-button")
        .addEventListener("click", handleDate);
      resizeCanvas(dateDiv.id, DATE, dateId, DATE_OPTION);
      break;
    case SIGNATURE:
      removeSignature();
      let signature_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = signature_x_y[0];
      pos_y_pdf = signature_x_y[1];

      let signatureId = baseId;
      current_form_id = signatureId;

      const signatureWidth = 160;
      const signatureHeight = 80;

      const signature_creator = document.getElementById(SIGNATURE_OPTION);
      signature_creator.style.display = "flex";
      document.getElementById("signature-initial-tab").click();
      resetCanvas();
      document.getElementById("signature-close").onclick = function () {
        signature_creator.style.display = "none";
      };

      document.getElementById("signature-create").onclick = function () {
        let canvas;
        if (currentSignType == DRAW) {
          canvas = document
            .getElementById("signature-draw-body")
            .querySelector("canvas");
          signatureImgData = cropCanvas(canvas);
          handleSignature();
          createAndAppendImage(signatureImgData);
        } else if (currentSignType == TYPE) {
          canvas = document.getElementById("signature-type-canvas");
          signatureImgData = cropCanvas(canvas);
          handleSignature();
          createAndAppendImage(signatureImgData);
        } else if (currentSignType == UPLOAD) {
          const file = document.getElementById("signature-image-input")
            .files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              signatureImgData = e.target.result;
              handleSignature();
              createAndAppendImage(signatureImgData);
            };
            reader.readAsDataURL(file);
          } else {
            alert("Please select an image file.");
          }
        }

        function createAndAppendImage(imgData) {
          signature_creator.style.display = "none";
          const signatureImg = document.createElement("img");
          signatureImg.id = "signatureImg" + signatureId;
          signatureImg.style.width = "100%";
          signatureImg.style.height = "100%";
          signatureImg.src = imgData;
          signatureImg.style.objectFit = "contain";

          const signatureContainer = document.createElement("div");
          signatureContainer.id = "signature" + signatureId;
          signatureContainer.style.position = "absolute";
          signatureContainer.style.top =
            e.pageY - top - absoluteOffset.y + "px";
          signatureContainer.style.left =
            e.pageX - left - absoluteOffset.x + "px";
          signatureContainer.style.width = signatureWidth + "px";
          signatureContainer.style.height = signatureHeight + "px";
          signatureContainer.style.zIndex = 100;

          signatureContainer.append(signatureImg);

          pg.appendChild(signatureContainer);
          resizeCanvas(signatureContainer.id, SIGNATURE, signatureId);
          signatureContainer.addEventListener("dblclick", () => {
            current_signature_id = signatureId;

            let istooltipshow = false;

            if (
              document.getElementById(
                "signature_tooltipbar" + current_signature_id
              )
            ) {
              istooltipshow = true;
            }

            if (isDragging) {
              isDragging = false;
            } else {
              if (!istooltipshow) {
                let tooltipbar = document.createElement("div");
                current_form_id = signatureId;
                addDeleteButton(
                  current_signature_id,
                  tooltipbar,
                  signatureContainer,
                  "signature"
                );
              } else {
                document
                  .getElementById("signature_tooltipbar" + current_signature_id)
                  .remove();
              }
            }
          });
        }
      };
      break;
    default:
      break;
  }
};

function getBoundingBox(canvas) {
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  let minX = canvas.width,
    minY = canvas.height,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      if (pixels[i + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function cropCanvas(canvas) {
  // Get the bounding box of the drawn content
  boundingBox = getBoundingBox(canvas);

  // Create a new canvas with the dimensions of the bounding box
  let newCanvas = document.createElement("canvas");
  newCanvas.width = boundingBox.width;
  newCanvas.height = boundingBox.height;
  let newCtx = newCanvas.getContext("2d");

  // Copy the drawn content to the new canvas
  newCtx.drawImage(
    canvas,
    boundingBox.x,
    boundingBox.y,
    boundingBox.width,
    boundingBox.height,
    0,
    0,
    boundingBox.width,
    boundingBox.height
  );

  // Convert the content of the new canvas to a data URL
  return newCanvas.toDataURL();
}

const flatten = async function () {
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  form.flatten();
  pdfBytes = await pdfDoc.save();
  if (form_storage.length != 0)
    addFormElements().then(() => {
      add_txt_comment();
    });
  else {
    add_txt_comment();
  }
};

async function addFormElements() {
  const fontStyles = {
    Courier: PDFLib.StandardFonts.Courier,
    CourierBold: PDFLib.StandardFonts.CourierBold,
    CourierBoldOblique: PDFLib.StandardFonts.CourierBoldOblique,
    CourierOblique: PDFLib.StandardFonts.CourierOblique,
    Helvetica: PDFLib.StandardFonts.Helvetica,
    HelveticaBold: PDFLib.StandardFonts.HelveticaBold,
    HelveticaBoldOblique: PDFLib.StandardFonts.HelveticaBoldOblique,
    HelveticaOblique: PDFLib.StandardFonts.HelveticaOblique,
    TimesRoman: PDFLib.StandardFonts.TimesRoman,
    TimesRomanBold: PDFLib.StandardFonts.TimesRomanBold,
    TimesRomanBoldItalic: PDFLib.StandardFonts.TimesRomanBoldItalic,
    TimesRomanItalic: PDFLib.StandardFonts.TimesRomanItalic,
  };
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const firstPage = pdfDoc.getPage(0);
  const { width, height } = firstPage.getSize();
  const form = pdfDoc.getForm();
  let page;
  let checkboxForm, radioForm, textfieldForm, comboboxForm, datefieldForm;
  let radioOption;
  let selectedFont = "";
  if (form_storage.length != 0) {
    form_storage.map(async (form_item) => {
      page = pdfDoc.getPage(form_item.page_number - 1);
      if (form_item.form_type == RADIO) {
        if (radioOption != form_item.data.option) {
          radioOption = form_item.data.option;
          radioForm = form.createRadioGroup(radioOption);
        }
      }
      let customFont = "";
      if (
        form_item.form_type != CHECKBOX &&
        form_item.form_type != RADIO &&
        form_item.form_type != SIGNATURE &&
        form_item.form_type != SHAPE
      ) {
        const fontName = form_item.fontStyle;
        if (fontStyles.hasOwnProperty(fontName)) {
          selectedFont = fontStyles[fontName];
        } else {
          const fontByte = font_storage.find(
            (font) => font.fontName === fontName
          );
          selectedFont = fontByte.fontArrayBuffer;
        }
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
            borderColor: PDFLib.rgb(1, 1, 1),
          });
          break;
        case RADIO:
          radioForm.addOptionToPage(radioCount + "", page, {
            x: form_item.data.x,
            y: form_item.data.y - form_item.data.height,
            width: form_item.data.width,
            height: form_item.data.height,
            backgroundColor: PDFLib.rgb(1, 1, 1),
          });
          radioCount++;
          break;
        case DATE:
          datefieldForm = form.createTextField(form_item.form_field_name);
          datefieldForm.addToPage(page, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
            textColor: PDFLib.rgb(r, g, b),
            backgroundColor: PDFLib.rgb(1, 1, 1),
            borderColor: PDFLib.rgb(1, 1, 1),
          });
          datefieldForm.setFontSize(form_item.fontSize);
          datefieldForm.setText(form_item.text);
          datefieldForm.updateAppearances(customFont);
          datefieldForm.defaultUpdateAppearances(customFont);
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
            borderColor: PDFLib.rgb(1, 1, 1),
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
            borderColor: PDFLib.rgb(0.23, 0.23, 0.23),
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
            borderColor: PDFLib.rgb(1, 1, 1),
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
            backgroundColor: PDFLib.rgb(0.24, 0.59, 0.99),
          });
          buttonfieldForm.updateAppearances(customFont);
          buttonfieldForm.defaultUpdateAppearances(customFont);
          buttonfieldForm.setFontSize(form_item.fontSize);
          let formScript = "";
          if (form_item.action == SUBMIT) {
            formScript = `
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var field = this.getField(fieldName);
                                field.readonly = true;
                                field.lineWidth = 0;
                                field.fillColor = color.transparent;
                                field.strokeColor = color.transparent;
                            }
                            this.saveAs("flattened.pdf");
                        `;
          } else if (form_item.action == RESET) {
            formScript = `
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
                        `;
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
              PDFLib.PDFName.of("AA"),
              pdfDoc.context.obj({
                U: {
                  Type: "Action",
                  S: "JavaScript",
                  JS: PDFLib.PDFHexString.fromText(formScript),
                },
              })
            );
          });
          break;
        case SIGNATURE:
          const pngImage = await pdfDoc.embedPng(form_item.imgData);
          page.drawImage(pngImage, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
          });
          break;
        case SHAPE:
          const shapeImage = await pdfDoc.embedPng(form_item.imgData);
          page.drawImage(shapeImage, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
          });
          console.log('first')
          break;
        default:
          break;
      }
    });
  }
  if (text_storage.length != 0) {
    await Promise.all(
      text_storage.map(async (text_item) => {
        const fontName = text_item.fontStyle;
        if (fontStyles.hasOwnProperty(fontName)) {
          selectedFont = fontStyles[fontName];
        } else {
          const fontByte = font_storage.find(
            (font) => font.fontName === fontName
          );
          selectedFont = fontByte.fontArrayBuffer;
        }
        const customFont = await pdfDoc.embedFont(selectedFont);
        page = pdfDoc.getPage(text_item.page_number - 1);
        // selectedFont = fontStyles[text_item.fontStyle] || PDFLib.StandardFonts.Helvetica;

        let { r, g, b } = hexToRgb(text_item.textColor);
        let content = ``;
        text_item.text.map((item) => {
          content += `${item}\n`;
        });
        page.drawText(content, {
          x: text_item.x,
          y: text_item.y,
          font: customFont,
          size: text_item.fontSize,
          color: PDFLib.rgb(r, g, b),
          lineHeight: 10,
          // wordBreaks: true,
        });
      })
    );
  }
  pdfBytes = await pdfDoc.save();
}
