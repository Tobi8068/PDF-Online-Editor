document.getElementById("sidebarToggle").addEventListener("click", function () {
    const sidebarContainer = document.getElementById("sidebarContainer");
    if (window.getComputedStyle(sidebarContainer).visibility === "visible") {
        sidebarContainer.style.visibility = 'hidden';
        leftSideBarOpened = false;
        if (showHistoryBarOpened) {
            showHistoryBar.classList.remove("active");
            showHistoryBar.classList.toggle("active0");
        }
    } else {
        sidebarContainer.style.visibility = 'visible';
        leftSideBarOpened = true;
        if (showHistoryBarOpened) {
            showHistoryBar.classList.remove("active0");
            showHistoryBar.classList.toggle("active");
        }
    }
})

const saveHistory = function (username, date, page, reply, currentid) {
    if (currentid) {
        for (let i = 0; history_storage.length; i++) {
            if (history_storage[i].id === currentid) {
                history_storage[i].page = page;
                history_storage[i].reply = reply;
            }
        }
    } else {
        const history = {
            id: historyId,
            username: username,
            date: date,
            page: page,
            reply: reply
        };
        history_storage.push(history);
    }
    console.log(history_storage);
}

const addHistory = function (id, type, username, date, page, typeString) {
    if (id !== 0) {
        if (!showHistoryBar.querySelector(`#history${id}`)) {
            // Upper Parent Element
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
            // historyDiv: Child Element of PageDiv
            const historyDiv = document.createElement("div");
            historyDiv.id =  `historyDiv${id}`;
            // style
            historyDiv.style.display = "flex";
            historyDiv.style.flexDirection = "column";
            historyDiv.style.alignItems = "center";
            historyDiv.style.justifyContent = "center";
            historyDiv.style.cursor = "pointer";
            historyDiv.style.userSelect = "none";
            historyDiv.style.borderRadius = '5px';
            historyDiv.style.boxShadow = "#868e96 0px 0px 3px 0px";

            // history: Child Element of historyDiv

            const history = document.createElement('div');
            history.style.display = "flex";
            history.style.alignItems = "center";
            history.style.justifyContent = "space-between";
            history.style.padding = "5px 10px";
            history.style.width = "-webkit-fill-available";
            // history.style.borderBottom = `1px solid #ccc`;

            // AnnotationType: Child Element of history Element

            const annotationType = document.createElement("span");
            annotationType.style.fontSize = "x-large";
            switch (type) {
                case CHECKBOX:
                    annotationType.innerHTML = `<i class="fa-sharp fa-regular fa-square-check"></i>`;
                    break;
                case RADIO:
                    annotationType.innerHTML = `<i class="fa-regular fa-circle-dot"></i>`;
                    break;
                case TEXTFIELD:
                    annotationType.innerHTML = `<i class="fa fa-font"></i>`;
                    break;
                case DATE:
                    annotationType.innerHTML = `<i class="fa-regular fa-calendar-days"></i>`;
                    break;
                case COMBOBOX:
                    annotationType.innerHTML = `<i class="fa fa-caret-down"></i>`;
                    break;
                case LIST:
                    annotationType.innerHTML = `<i class="fa fa-list"></i>`;
                    break;
                case SIGNATURE:
                    annotationType.innerHTML = `<i class="fa-solid fa-stamp"></i>`;
                    break;
                case BUTTON:
                    annotationType.innerHTML = `<i class="fa fa-toggle-off"></i>`;
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

            // UserDiv: Child Element of history Element
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
            usernameDiv.innerHTML = `@${username}`;
            dateDiv.innerHTML = `${date}`;
            userDiv.append(usernameDiv, dateDiv);

            // OptionDiv: Child Element of history Element

            const optionDiv = document.createElement("div");
            optionDiv.style.padding = "0px 3px";
            optionDiv.style.position = "relative";
            optionDiv.style.borderRadius = "3px";
            const optionSpan = document.createElement("span");
            optionSpan.style.color = "#5d5656";
            optionSpan.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;

            const optionPan = document.createElement("div");
            optionPan.style.display = "none";
            optionPan.style.position = "absolute";
            optionPan.style.top = "21px";
            optionPan.style.right = "0";
            optionPan.style.zIndex = "100";
            optionPan.style.backgroundColor = "white";
            optionPan.style.borderRadius = '5px';
            optionPan.style.boxShadow = "#868e96 0px 0px 3px 0px";
            const DeleteBtn = document.createElement("div");
            DeleteBtn.textContent = "Delete";
            DeleteBtn.style.cursor = "pointer";
            DeleteBtn.style.fontSize = "small";
            DeleteBtn.style.padding = "3px 8px";
            DeleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                pageDiv.removeChild(historyDiv);
                const target = document.getElementById(`${typeString}${id}`);
                console.log(target, document.querySelector("#topLeft"));
                if (target && target.querySelector("#topLeft"))
                    {
                        console.log('first')
                        removeResizebar(target.id);
                    }
                if (target) target.style.display = "none";
                if (typeString == "text-content") {
                    text_storage = text_storage.filter(function (item) {
                        return item.id !== parseInt(id);
                    });
                } else if (typeString == "comment") {
                    comment_storage = comment_storage.filter(function (comment) {
                        return comment.id !== parseInt(id);
                    });
                } else {
                    form_storage = form_storage.filter(function (item) {
                        return item.id !== parseInt(id);
                    });
                }
            })
            optionPan.append(DeleteBtn);
            optionDiv.addEventListener("click", () => {
                if (window.getComputedStyle(optionPan).getPropertyValue('display') !== "none") {
                    optionPan.style.display = "none";
                    optionDiv.style.backgroundColor = "white";
                } else {
                    optionPan.style.display = "block";
                    optionDiv.style.backgroundColor = "#dde6ee";
                }
            })
            optionDiv.append(optionSpan, optionPan);

            const historyComment = document.createElement("div");
            historyComment.id = "historyComment" + id;
            historyComment.style.width = "100%";
            historyComment.style.display = "none";
            historyComment.style.alignItems = "center";
            historyComment.style.justifyContent = "center";
            historyComment.style.marginTop = "15px";
            historyComment.style.marginBottom = "10px";
            historyComment.classList.add("historyComment");
            const historyLeftPart = document.createElement("div");
            historyLeftPart.style.width = "20%";
            const historyMainPart = document.createElement("div");
            historyMainPart.id = "historyMainPart" + id;
            historyMainPart.style.width = "80%";
            historyMainPart.style.borderLeft = "1px solid #ccc";
            historyMainPart.style.display = "flex";
            historyMainPart.style.flexDirection = "column";
            historyMainPart.style.gap = "4px";

            historyComment.append(historyLeftPart, historyMainPart);

            // AddReply Element: Child Element of historyDiv

            const addReply = document.createElement("div");
            addReply.id = "addReply" + id;
            addReply.style.display = "none";
            addReply.style.alignItems = "center";
            addReply.style.justifyContent = "space-between";
            addReply.style.padding = "10px 10px";
            addReply.style.gap = '6px';
            addReply.style.width = "-webkit-fill-available";
            addReply.style.borderTop = `1px solid #ccc`;
            addReply.classList.add("add-reply");

            const replyInput = document.createElement("input");
            replyInput.id = "replyInput" + id;
            replyInput.style.width = "80%";
            replyInput.style.borderRadius = "3px";
            replyInput.addEventListener("focus", () => {
                replyInput.style.outline = "none";
                replyInput.style.border = "1px solid #3c97fe";
            });
            replyInput.placeholder = 'Add Reply...';
            replyInput.style.padding = '2px';
            replyInput.fontSize = '13px';
            const replySave = document.createElement("div");
            replySave.innerHTML = `<i class="fa-regular fa-paper-plane"></i>`;
            replySave.style.cursor = "pointer";
            const addHistoryElement = function () {
                const reply = replyInput.value;
                if (reply !== "") {
                    historyId++;
                    saveHistory(username, date, page, reply);
                    replyInput.value = '';
                    historyComment.style.display = "flex";
                    const commentReplyContainer = document.createElement("div");
                    commentReplyContainer.style.marginLeft = "10px";

                    const commentReply = document.createElement("div");
                    commentReply.style.display = "flex";
                    commentReply.style.alignItems = "center";
                    const replyUserDiv = document.createElement("div");
                    // style
                    replyUserDiv.style.display = 'flex';
                    replyUserDiv.style.flexDirection = "column";
                    replyUserDiv.style.width = "75%";
                    // child
                    const replyusernameDiv = document.createElement("span");
                    replyusernameDiv.style.fontSize = "xx-small";
                    const replydateDiv = document.createElement("span");
                    replydateDiv.style.fontSize = "xx-small";
                    replyusernameDiv.innerHTML = `@${username}`;
                    const replyTime = new Date(Date.now());
                    replydateDiv.innerHTML = `${convertStandardDateType(replyTime)}`;
                    replyUserDiv.append(replyusernameDiv, replydateDiv);
                    const replyoptionDiv = document.createElement("div");
                    replyoptionDiv.style.display = "flex";
                    replyoptionDiv.style.justifyContent = "center";
                    replyoptionDiv.style.width = "25%";
                    replyoptionDiv.style.padding = "0px 3px";
                    replyoptionDiv.style.position = "relative";
                    replyoptionDiv.style.borderRadius = "3px";
                    const replyoptionSpan = document.createElement("span");
                    replyoptionSpan.style.color = "#5d5656";
                    replyoptionSpan.style.cursor = "pointer";
                    replyoptionSpan.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;

                    const optionPan = document.createElement("div");
                    optionPan.style.display = "none";
                    optionPan.style.position = "absolute";
                    optionPan.style.top = "21px";
                    optionPan.style.right = "0";
                    optionPan.style.zIndex = "100";
                    optionPan.style.backgroundColor = "white";
                    optionPan.style.borderRadius = '5px';
                    optionPan.style.boxShadow = "#868e96 0px 0px 3px 0px";
                    const EditBtn = document.createElement("div");
                    EditBtn.textContent = "Edit";
                    EditBtn.style.cursor = "pointer";
                    EditBtn.style.fontSize = "small";
                    EditBtn.style.padding = "3px 8px";
                    EditBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        let textValue = replyText.textContent;
                        replyText.style.display = "none";
                        editReplyText.style.display = "flex";
                        editReplyTextInput.value = textValue;
                        editReplyTextInput.focus();
                        optionPan.style.display = "none";
                        replyoptionDiv.style.backgroundColor = "white";
                    })
                    const DeleteBtn = document.createElement("div");
                    DeleteBtn.textContent = "Delete";
                    DeleteBtn.style.cursor = "pointer";
                    DeleteBtn.style.fontSize = "small";
                    DeleteBtn.style.padding = "3px 8px";
                    DeleteBtn.addEventListener("click", () => {
                        historyMainPart.removeChild(commentReplyContainer);
                    })
                    optionPan.append(EditBtn, DeleteBtn);
                    replyoptionDiv.addEventListener("click", () => {
                        if (window.getComputedStyle(optionPan).getPropertyValue('display') !== "none") {
                            optionPan.style.display = "none";
                            replyoptionDiv.style.backgroundColor = "white";
                        } else {
                            optionPan.style.display = "block";
                            replyoptionDiv.style.backgroundColor = "#dde6ee";
                        }
                    })
                    replyoptionDiv.append(replyoptionSpan, optionPan);
                    commentReply.append(replyUserDiv, replyoptionDiv);

                    const replyText = document.createElement("div");
                    replyText.style.marginTop = "8px";
                    replyText.style.fontSize = "small";
                    replyText.textContent = reply;

                    const editReplyText = document.createElement("div");
                    editReplyText.style.display = "none";
                    editReplyText.style.flexDirection = "column";
                    editReplyText.style.marginRight = "10px";
                    editReplyText.style.marginTop = "10px";
                    editReplyText.style.gap = "3px";
                    const editReplyTextInput = document.createElement("input");
                    editReplyTextInput.style.borderRadius = "3px";
                    editReplyTextInput.addEventListener("focus", () => {
                        editReplyTextInput.style.outline = "none";
                        editReplyTextInput.style.border = "1px solid #3c97fe";
                    });
                    editReplyTextInput.style.padding = '2px';
                    editReplyTextInput.fontSize = '13px';
                    const editReplyBtnGroup = document.createElement("div");
                    editReplyBtnGroup.style.display = "flex";
                    editReplyBtnGroup.style.justifyContent = "end";
                    editReplyBtnGroup.style.fontSize = "small";
                    editReplyBtnGroup.style.gap = "6px";
                    const editReplySaveBtn = document.createElement("div");
                    editReplySaveBtn.textContent = "Save";
                    editReplySaveBtn.style.padding = "1px 7px";
                    editReplySaveBtn.style.borderRadius = "3px";
                    editReplySaveBtn.style.backgroundColor = "#3c97fe";
                    editReplySaveBtn.style.color = "white";
                    const editReplyCancelBtn = document.createElement("div");
                    editReplyCancelBtn.textContent = "Cancel";
                    editReplyBtnGroup.append(editReplyCancelBtn, editReplySaveBtn);
                    editReplyCancelBtn.addEventListener("click", () => {
                        editReplyText.style.display = "none";
                        replyText.style.display = "block";
                    });
                    editReplySaveBtn.addEventListener("click", () => {
                        const textValue = editReplyTextInput.value;
                        editReplyText.style.display = "none";
                        replyText.style.display = "block";
                        replyText.textContent = textValue;
                    });
                    editReplyText.append(editReplyTextInput, editReplyBtnGroup);

                    commentReplyContainer.append(commentReply, replyText, editReplyText);

                    historyMainPart.append(commentReplyContainer);
                }
            }
            replyInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    addHistoryElement();
                }
            })
            replySave.addEventListener("click", () => {
                addHistoryElement();
            })
            addReply.append(replyInput, replySave);

            const textHistory = document.createElement("span");
            textHistory.style.display = "flex";
            textHistory.style.alignItems = "center";
            textHistory.style.width = "60%";
            textHistory.style.justifyContent = "start";
            textHistory.textContent = "Your text is here";
            textHistory.style.fontSize = "11px";
            textHistory.style.color = "red";

            history.append(annotationType, userDiv, optionDiv);

            historyDiv.append(history, textHistory, historyComment, addReply);

            historyDiv.addEventListener("click", () => {
                showHistoryBar.querySelectorAll(".add-reply").forEach(reply => {
                    reply.style.display = "none";
                });
                showHistoryBar.querySelectorAll(".historyComment").forEach(comment => {
                    comment.style.display = "none";
                });
                addReply.style.display = "flex";
                if (historyMainPart.hasChildNodes()) historyComment.style.display = "flex";
                if (type !== TEXTFIELD && type !== TEXT_CONTENT) replyInput.focus();
                removeAllResizeBar();
                const focusItem = document.getElementById(`${typeString}${id}`);
                if (focusItem && !focusItem.querySelector("#topLeft")) addResizebar(focusItem.id);
            });
            pageDiv.appendChild(historyDiv);
            showHistoryBar.appendChild(pageDiv);
        }
    }
}

const showHistory = function () {
    if (leftSideBarOpened) showHistoryBar.classList.toggle("active");
    else showHistoryBar.classList.toggle("active0");
    showHistoryBarOpened = !showHistoryBarOpened;
}