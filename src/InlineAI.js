import React, { useState } from 'react';
import { astrologyApi } from './api';

export default function InlineAI({ tabContext, birthData, placeholder }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const result = await astrologyApi.aiChat(input, birthData, tabContext);
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
          background: open ? '#4a5568' : '#6c5ce7', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
        }}
      >
        {open ? '✕ Close AI' : '🤖 Ask AI about this'}
      </button>
      {open && (
        <div style={{ marginTop: '10px', background: '#1a202c', borderRadius: '10px', padding: '12px' }}>
          <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5',
                  background: m.role === 'user' ? '#6c5ce7' : '#2d3748', color: 'white'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: '#6c5ce7', fontSize: '13px' }}>Thinking...</div>}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
              placeholder={placeholder || 'Ask about this data...'}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #4a5568',
                background: '#2d3748', color: 'white', fontSize: '13px'
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: '#6c5ce7', color: 'white', cursor: 'pointer', fontSize: '13px'
            }}>Ask</button>
          </div>
        </div>
      )}
    </div>
  );
}
