// 1. DÁN API KEY CỦA BẠN VÀO ĐÂY
const YOUR_API_KEY = "DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY";

const msgContainer = document.getElementById('messages');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function handleChat() {
    const text = inputField.value.trim();
    if (!text) return;

    // Hiển thị tin nhắn User
    appendMsg(text, 'user');
    inputField.value = '';

    // Hiển thị trạng thái chờ
    const loadingMsg = appendMsg("Đang suy nghĩ...", 'bot');

    try {
        // Gọi thẳng API Google (không qua Vercel/Proxy)
        const response = await fetch(`https://generativelanguage.googleapis.com{YOUR_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        loadingMsg.remove();

        // Đọc dữ liệu từ cấu trúc chuẩn của Google
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            appendMsg(reply, 'bot');
        } else {
            appendMsg("Bot không phản hồi. Hãy kiểm tra API Key!", 'bot');
        }

    } catch (error) {
        loadingMsg.innerText = "Lỗi kết nối! Hãy thử lại.";
        console.error(error);
    }
}

function appendMsg(text, type) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerText = text;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return div;
}

sendBtn.addEventListener('click', handleChat);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
