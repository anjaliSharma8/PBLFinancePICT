import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Paperclip } from 'lucide-react';
import './dashboard.css';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm VaultCore AI. Ask me about your budget, or upload a CSV or PDF of your recent statement for me to analyze!" }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "Compare available loans",
    "Can I afford a ₹50k loan?",
    "Show my top expenses",
    "Budget optimization tips"
  ]);

  const handleSend = async (e, directMsg = null) => {
    if (e) e.preventDefault();
    const finalMsg = directMsg || input;
    if (!finalMsg.trim() && !selectedFile) return;

    const userMsg = finalMsg.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg || "Please analyze my attached document and give me suggestions." }]);
    setInput('');
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      let userId = "";
      if (storedUser) {
        try { userId = JSON.parse(storedUser).id; } catch(e) {}
      }

      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('message', userMsg || "Please analyze this attached log and give me my spending summary and suggestions.");
        formData.append('userId', userId);
        formData.append('file', selectedFile);

        res = await fetch('http://127.0.0.1:5001/api/chat', {
          method: 'POST',
          body: formData
        });
        setSelectedFile(null); // Clear file after send
      } else {
        res = await fetch('http://127.0.0.1:5001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg, userId })
        });
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch(err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI engine. Ensure Python server is running." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button className="ai-fab shadow-glow" onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="ai-chat-window glass-card" initial={{opacity:0, y:50, scale:0.95}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:50, scale:0.95}}>
            <div className="chat-header">
              <div className="chat-title">
                <span className="online-dot"></span> VaultCore AI
              </div>
              <button onClick={() => setIsOpen(false)} className="close-chat"><X size={18}/></button>
            </div>
            
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {loading && <div className="chat-bubble assistant typing">Analyzing data...</div>}
            </div>

            {/* QUICK SUGGESTIONS */}
            {!loading && messages.length <= 2 && (
              <div style={{ padding: '0 16px 12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {suggestions.map((s, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05, background: 'rgba(99, 102, 241, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleSend(null, s);
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            {selectedFile && (
              <div className="chat-file-preview">
                <span className="file-name">📄 {selectedFile.name}</span>
                <button type="button" onClick={() => setSelectedFile(null)} className="remove-file-btn"><X size={14}/></button>
              </div>
            )}
            <form onSubmit={handleSend} className="chat-input-area border-t">
              <label htmlFor="csv-upload" className="chat-attach-btn" title="Upload Transactions CSV or PDF">
                <Paperclip size={18} />
              </label>
              <input type="file" id="csv-upload" accept=".csv, .pdf" style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
              <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Attach document or type message..." className="chat-input glass-input" disabled={loading} />
              <button type="submit" className="chat-send ai-glow-btn" disabled={loading || (!input.trim() && !selectedFile)}><Send size={18}/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
