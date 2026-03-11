import { useState, useRef, useEffect } from "react";
import { uploadDocuments, sendMessage, getSummary, clearSession } from "../api";

const USER_LABELS = {
  student:    "🎓 Student Mode",
  business:   "💼 Business Mode",
  lawyer:     "⚖️ Legal Mode",
  doctor:     "🏥 Medical Mode",
  researcher: "🔬 Research Mode",
  hr:         "👥 HR Mode",
  finance:    "🏦 Finance Mode",
  other:      "💡 Assistant Mode",
};

const QUICK_ACTIONS = {
  student:    ["Explain key concepts", "Generate practice questions", "Summarize chapter", "Create flashcards"],
  business:   ["Summarize document", "Find risky clauses", "Extract key dates", "Calculate financials"],
  lawyer:     ["Summarize document", "Find key obligations", "Identify risks", "Extract deadlines"],
  doctor:     ["Summarize findings", "Extract critical values", "List recommendations", "Flag urgent items"],
  researcher: ["Summarize paper", "Extract key findings", "List methodology", "Find limitations"],
  hr:         ["Summarize policy", "Extract key dates", "List obligations", "Find benefits"],
  finance:    ["Summarize report", "Extract key figures", "Identify risks", "Calculate totals"],
  other:      ["Summarize document", "Extract key points", "Find important dates", "List action items"],
};

export default function Chat({ sessionId, userType, onReset }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [files, setFiles]       = useState([]);
  const [error, setError]       = useState(null);
  const bottomRef               = useRef(null);
  const fileRef                 = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      await uploadDocuments(sessionId, files);
      setProcessed(true);
      setMessages([{
        role: "assistant",
        content: `✅ ${files.length} document(s) processed! Ask me anything or use a quick action below.`
      }]);
    } catch {
      setError("Failed to process documents. Try smaller files.");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (q) => {
    const question = q || input.trim();
    if (!question || !processed) return;
    setInput("");
    setMessages(p => [...p, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await sendMessage(sessionId, question);
      setMessages(p => [...p, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "❌ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!processed) return;
    setLoading(true);
    setMessages(p => [...p, { role: "user", content: "📋 Generate a summary of my documents" }]);
    try {
      const res = await getSummary(sessionId);
      setMessages(p => [...p, { role: "assistant", content: res.data.summary }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "❌ Failed to generate summary." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await clearSession(sessionId).catch(() => {});
    onReset();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div>
          <h1 className="text-blue-400 font-bold text-sm">📄 DocuMind AI</h1>
          <p className="text-gray-500 text-xs">{USER_LABELS[userType]}</p>
        </div>
        <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-400 transition">
          ✕ Reset
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 flex flex-col p-4 gap-4 bg-gray-900">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Upload Documents</p>
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition"
            >
              <p className="text-2xl">📁</p>
              <p className="text-xs text-gray-400 mt-1">Click to upload PDFs</p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf" multiple hidden
              onChange={e => setFiles(Array.from(e.target.files))} />
            {files.length > 0 && (
              <div className="mt-2">
                {files.map((f, i) => (
                  <p key={i} className="text-xs text-gray-400 truncate">📄 {f.name}</p>
                ))}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-xs font-semibold transition"
                >
                  {uploading ? "Processing..." : "⚡ Process Documents"}
                </button>
              </div>
            )}
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          {processed && (
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Quick Actions</p>
              <button onClick={handleSummary}
                className="w-full text-left text-xs text-gray-300 hover:text-blue-400 py-1 transition">
                📋 Summarize documents
              </button>
              {QUICK_ACTIONS[userType]?.slice(1).map((a) => (
                <button key={a} onClick={() => handleSend(a)}
                  className="w-full text-left text-xs text-gray-300 hover:text-blue-400 py-1 transition">
                  ⚡ {a}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <p className="text-4xl">📄</p>
                <p className="text-gray-400 text-sm">Upload your documents to get started</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
                  ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={!processed || loading}
              placeholder={processed ? "Ask anything about your documents..." : "Upload documents first..."}
              className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-sm text-white outline-none disabled:opacity-50 placeholder-gray-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!processed || loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl px-4 py-3 text-sm font-semibold transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}