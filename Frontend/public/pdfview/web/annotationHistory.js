document.getElementById("sidebarToggle").addEventListener("click", function () {
    const sidebarContainer = document.getElementById("sidebarContainer"); 
    console.log("firs", window.getComputedStyle(sidebarContainer).visibility);
    if(window.getComputedStyle(sidebarContainer).visibility === "visible") {
        console.log('hidden')
        sidebarContainer.style.visibility = 'hidden';
    } else {
        console.log('visible');
        sidebarContainer.style.visibility = 'visible';
    }
})

const openToolbar = () => {
    isShowToolbar = !isShowToolbar;
    document.getElementById("scaleSelect").value = "auto";
    PDFViewerApplication.pdfViewer.currentScaleValue = "auto";
    rightSidebarButton.classList.toggle("rotate");
    sidebar.classList.toggle("active");
};

const addHistory = function (id, type, username, date, page) {
    if (id !== 0) {
        const historyDiv = document.createElement("div");
        // style
        historyDiv.style.display = "flex";
        historyDiv.style.flexDirection = "column";
        historyDiv.style.alignItems = "center";
        historyDiv.style.justifyContent = "center";
        historyDiv.style.cursor = "pointer";
        historyDiv.style.userSelect = "none";
        historyDiv.style.borderRadius = '5px';
        historyDiv.style.boxShadow = "#868e96 0px 0px 3px 0px";
        // id
        historyDiv.id = `history${id}`;

        const addReply = document.createElement("div");
        addReply.style.display = "none";
        addReply.style.alignItems = "center";
        addReply.style.justifyContent = "space-between";
        addReply.style.padding = "10px 10px";
        addReply.style.gap = '6px';
        addReply.style.width = "-webkit-fill-available";
        addReply.classList.add("add-reply");

        const replyInput = document.createElement("input");
        replyInput.style.width = "80%";
        replyInput.addEventListener("focus", () => { replyInput.style.outline = "none" });
        replyInput.placeholder = 'Add Reply...';
        replyInput.style.padding = '2px';
        replyInput.fontSize = '13px';
        const replySave = document.createElement("div");
        replySave.innerHTML = `<i class="fa-regular fa-paper-plane"></i>`;
        replySave.style.cursor = "pointer";
        addReply.append(replyInput, replySave);

        const annotationType = document.createElement("span");
        annotationType.style.fontSize = "x-large";
        switch (type) {
            case CHECKBOX:
            case RADIO:
            case TEXTFIELD:
            case DATE:
            case COMBOBOX:
            case LIST:
            case SIGNATURE:
            case BUTTON:
                annotationType.innerHTML = `<i class="fa-solid fa-stamp"></i>`;
                break;
            case TEXT_CONTENT:
                annotationType.innerHTML = `<i class="fa-solid fa-font"></i>`;
                break;
            case SHAPE:
                annotationType.innerHTML = `<i class="fa-solid fa-shapes"></i>`;
                break;
            case COMMENT:
                annotationType.innerHTML = `<i class="fa-solid fa-comment-dots"></i>`;
                break;
            default:
                break;
        }

        const userDiv = document.createElement("div");
        // style
        userDiv.style.display = 'flex';
        userDiv.style.flexDirection = "column";
        userDiv.style.width = "60%";
        // child
        const usernameDiv = document.createElement("span");
        usernameDiv.style.fontWeight = "700";
        const dateDiv = document.createElement("span");
        dateDiv.style.fontSize = "xx-small";
        userDiv.append(usernameDiv, dateDiv);
        usernameDiv.innerHTML = `@${username}`;
        dateDiv.innerHTML = `${date}`;

        const optionDiv = document.createElement("div");
        const optionSpan = document.createElement("span");
        optionSpan.style.color = "#5d5656";
        optionSpan.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
        optionDiv.append(optionSpan);

        let pageDiv;

        if (showHistoryBar.querySelector(`#page${page}`)) {
            pageDiv = showHistoryBar.querySelector(`#page${page}`);
        } else {
            pageDiv = document.createElement("div");
            pageDiv.id = `page${page}`;
            pageDiv.style.display = "flex";
            pageDiv.style.flexDirection = "column";
            pageDiv.style.gap = "5px";
            const pageNum = document.createElement("span");
            pageNum.style.fontSize = "small";
            pageNum.innerHTML = `Page ${page}`;
            pageDiv.appendChild(pageNum)
        }

        const history = document.createElement('div');
        history.style.display = "flex";
        history.style.alignItems = "center";
        history.style.justifyContent = "space-between";
        history.style.padding = "5px 10px";
        history.style.width = "-webkit-fill-available";
        history.style.borderBottom = `1px solid #ccc`;
        history.append(annotationType, userDiv, optionDiv);

        historyDiv.append(history, addReply);

        historyDiv.addEventListener("click", () => {
            showHistoryBar.querySelectorAll(".add-reply").forEach(reply => {
                reply.style.display = "none";
            });
            addReply.style.display = "flex";
            replyInput.focus();
        });

        if (!showHistoryBar.querySelector(`#${historyDiv.id}`)) pageDiv.appendChild(historyDiv);

        if (!showHistoryBar.querySelector(`#${historyDiv.id}`)) showHistoryBar.appendChild(pageDiv);
    }
}

const showHistory = function () {
    showHistoryBar.classList.toggle("active");
    console.log(document.getElementById("sidebarContainer"));
    // if (document.getElementById("sidebarContainer").checkVisibility() == true) showHistoryBar.style.left = '0';
}