const newMessageInput = document.getElementById("newMessage");
const addMessageButton = document.getElementById("addMessage");
const messageList = document.getElementById("messageList");
const clearMessagesButton = document.getElementById("clearMessages");
const messageType = document.getElementById("messageType");

// Style customization elements
const fontStyle = document.getElementById("fontStyle");
const fontSize = document.getElementById("fontSize");
const textColor = document.getElementById("textColor");
const bgColor = document.getElementById("bgColor");
const saveStylesButton = document.getElementById("saveStyles");

// Load messages from storage
function loadMessages() {
    chrome.storage.sync.get("messages", (data) => {
        const messages = data.messages || {};
        const category = messageType.value;
        messageList.innerHTML = "";
        (messages[category] || []).forEach((message, index) => {
            const li = document.createElement("li");
            li.textContent = message;
            li.addEventListener("click", () => removeMessage(category, index));
            messageList.appendChild(li);
        });
    });
}

// Add new message
addMessageButton.addEventListener("click", () => {
    const newMessage = newMessageInput.value.trim();
    const category = messageType.value;

    if (newMessage) {
        chrome.storage.sync.get("messages", (data) => {
            const messages = data.messages || {};
            if (!messages[category]) messages[category] = [];
            messages[category].push(newMessage);
            chrome.storage.sync.set({ messages }, loadMessages);
            newMessageInput.value = "";
        });
    }
});

// Remove a message
function removeMessage(category, index) {
    chrome.storage.sync.get("messages", (data) => {
        const messages = data.messages || {};
        messages[category].splice(index, 1);
        chrome.storage.sync.set({ messages }, loadMessages);
    });
}

// Clear all messages
clearMessagesButton.addEventListener("click", () => {
    chrome.storage.sync.remove("messages", loadMessages);
});

// Load stored styles
chrome.storage.sync.get("style", (data) => {
    fontStyle.value = data.style?.font || "";
    fontSize.value = data.style?.fontSize || "";
    textColor.value = data.style?.textColor || "#000000";
    bgColor.value = data.style?.bgColor || "#ffffff";
});

// Save styles
saveStylesButton.addEventListener("click", () => {
    const styleSettings = {
        font: fontStyle.value || "Arial",
        fontSize: fontSize.value || "16px",
        textColor: textColor.value,
        bgColor: bgColor.value,
        category: messageType.value
    };

    chrome.storage.sync.set({ style: styleSettings }, () => {
        alert("Styles saved!");
    });
});

// Load messages when popup opens
messageType.addEventListener("change", loadMessages);
loadMessages();