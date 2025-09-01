import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateAnswer() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await axios({
        url: import.meta.env.VITE_GEMINI_API_URL,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
        },
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      setAnswer(
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
      );
    } catch (error) {
      setAnswer("⚠️ Error: Failed to fetch response.");
    }

    setLoading(false);
  }

  return (
    <div className="app-container">
      <h1 className="title">🤖 Chat AI</h1>

      <div className="chat-box">
        <div className="messages">
          {answer && (
            <div className="bot-message">
              <strong>AI:</strong> {answer}
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            className="input-field"
          />
          <button
            onClick={generateAnswer}
            className="send-btn"
            disabled={loading}
          >
            {loading ? "⏳ Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
