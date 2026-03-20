import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import './dashboard.css';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm VaultCore AI. Ask me if you can afford that new purchase or how an expense affects your budget!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      let userId = "";
      if (storedUser) {
        try { userId = JSON.parse(storedUser).id; } catch(e) {}
      }

      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, userId })
      });
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
              {loading && <div className="chat-bubble assistant typing">Analyzing database...</div>}
            </div>

            <form onSubmit={handleSend} className="chat-input-area border-t">
              <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Will this purchase break my budget?" className="chat-input glass-input" disabled={loading} />
              <button type="submit" className="chat-send ai-glow-btn" disabled={loading}><Send size={18}/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
