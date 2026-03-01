const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const PROXY_URL = "/api/chat";

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    const loadingMsg = addMessage("Đang suy nghĩ...", 'bot typing');

    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        loadingMsg.remove();

        let reply = "";

        if (data.reply) {
            reply = data.reply;
        } else if (data.candidates && data.candidates[0].content.parts[0].text) {
            reply = data.candidates[0].content.parts[0].text;
        } else if (data.text) {
            reply = data.text;
        }

        if (reply) {
            addMessage(reply, 'bot');
        } else {
            const errorMsg = data.error || "Cấu trúc dữ liệu không khớp.";
            addMessage("Lỗi: " + errorMsg, 'bot');
            console.log("Dữ liệu nhận được:", data);
        }

    } catch (error) {
        if(loadingMsg) loadingMsg.remove();
        addMessage("Lỗi kết nối tới Server Vercel!", 'bot');
        console.error("Error details:", error);
    }
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerText = text;
    chatWindow.appendChild(div);

    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});


