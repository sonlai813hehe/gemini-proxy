const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// QUAN TRỌNG: Thay bằng link Vercel thực tế của bạn
const PROXY_URL = "/api/chat"; 

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Hiển thị tin nhắn người dùng
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Hiển thị trạng thái chờ
    const loadingMsg = addMessage("Đang suy nghĩ...", 'bot typing');

    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        loadingMsg.remove(); // Xóa trạng thái chờ

        // 3. Xử lý phản hồi từ Gemini (Cấu trúc chuẩn của AI Studio)
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            addMessage(reply, 'bot');
        } else {
            addMessage("Rất tiếc, App không phản hồi đúng cách.", 'bot');
        }

    } catch (error) {
        if(loadingMsg) loadingMsg.remove();
        addMessage("Lỗi kết nối tới Server!", 'bot');
        console.error("Error:", error);
    }
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    
    // Tự động cuộn xuống dưới cùng
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

// Bắt sự kiện Click và phím Enter
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

