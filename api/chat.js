export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: }]
      })
    });

    const data = await response.json();

    // LẤY ĐÚNG VĂN BẢN TRẢ VỀ (Cấu trúc chuẩn của Google)
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const botText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: botText });
    } else {
      res.status(500).json({ error: "Google không trả về văn bản. Kiểm tra API Key!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi kết nối Server" });
  }
}
