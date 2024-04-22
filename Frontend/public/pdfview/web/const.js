let comment_storage = [];
let text_storage = [];
let font_storage = [];
let form_storage = [];

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

const CHECKBOX_OPTION = "checkbox-option";
const RADIO_OPTION = "radio-button-option";
const TEXTFIELD_OPTION = "text-field-option";
const COMBOBOX_OPTION = "combo-option";
const LIST_OPTION = "list-option";
const BUTTON_OPTION = "button-field-option";
const TEXT_CONTENT_OPTION = "text-content-option";
const DATE_OPTION = "date-option";
const SIGNATURE_OPTION = "signature-creator";

const optionIdArray = [CHECKBOX_OPTION,
    RADIO_OPTION, TEXTFIELD_OPTION, COMBOBOX_OPTION, LIST_OPTION,
    BUTTON_OPTION, TEXT_CONTENT_OPTION, DATE_OPTION];

const checkboxOption = document.getElementById(CHECKBOX_OPTION);
const radioOption = document.getElementById(RADIO_OPTION);
const textFieldOption = document.getElementById(TEXTFIELD_OPTION);
const comboOption = document.getElementById(COMBOBOX_OPTION);
const listOption = document.getElementById(LIST_OPTION);
const buttonOption = document.getElementById(BUTTON_OPTION);
const dateOption = document.getElementById(DATE_OPTION);
const textContentOption = document.getElementById(TEXT_CONTENT_OPTION);

const rightSidebarButton = document.getElementById("penIcon");
const shareDocumentButton = document.getElementById("shareDocument");
const submitDocumentButton = document.getElementById("submitDocument");

const sidebar = document.querySelector(".right-sidebar");
const showHistoryBar = document.getElementById("show-history");
const BASE_SERVER_URL = "https://pdf-vision.com:8081";

const standardZIndex = 100;
const selectedZIndex = 150;

let isShowToolbar = false;

let clientName = '';
let clientEmail = '';
let isSubmit = false;

const USERNAME = localStorage.getItem('username');

let requestId = '';

/*
isEditing: true: Form Data Editing Mode
isEditing: false: Form Data Inserting Mode
 */
let isEditing = false;
let isMove = false;

let textContentSize = {x: 0, y: 0};