function replaceAds() {
    chrome.storage.sync.get(["messages", "style"], (data) => {
        const category = data.style?.category || "motivational";
        const messages = data.messages?.[category] || ["Stay positive!"];
        const adSelectors = ["iframe", "div[role='banner']", ".adsbygoogle", ".ad", ".sponsored"];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => {
                const replacement = document.createElement("div");
                replacement.style.cssText = `
                    display: flex; justify-content: center; align-items: center;
                    width: 100%; height: 100px; padding: 10px; border-radius: 5px;
                    background: ${data.style?.bgColor || "#ffeb3b"};
                    color: ${data.style?.textColor || "#333"};
                    font-size: ${data.style?.fontSize || "16px"};
                    font-family: ${data.style?.font || "Arial, sans-serif"};
                    font-weight: bold;
                `;
                replacement.textContent = messages[Math.floor(Math.random() * messages.length)];
                ad.replaceWith(replacement);
            });
        });
    });
}

replaceAds();
setInterval(replaceAds, 5000);