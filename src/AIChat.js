import React, { useState } from 'react';
import { astrologyApi } from './api';

const GREETING = {
  en: "Hello! I'm your AI Astrology Assistant. Ask me anything about your chart, numerology, KP astrology, or general astrological guidance. For best results, share your birth details in the Profile tab first!",
  hi: "नमस्ते! मैं आपका AI ज्योतिष सहायक हूं। अपने चार्ट, अंक ज्योतिष, KP ज्योतिष या सामान्य ज्योतिष मार्गदर्शन के बारे में मुझसे कुछ भी पूछें। सर्वोत्तम परिणामों के लिए, पहले प्रोफ़ाइल टैब में अपनी जन्म जानकारी दर्ज करें!"
};

function AIChat({ name, birthDate, birthTime, latitude, longitude, timezone, tabContext, language }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING[language] || GREETING.en }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = {
    en: [
      "What does my birth chart say about my career?",
      "Tell me about my love life and relationships",
      "What are my strengths and weaknesses?",
      "Explain my current planetary periods",
      "What gemstones should I wear?",
      "Give me spiritual guidance for this year",
      "What does my numerology reveal about me?",
      "Explain my KP chart significators"
    ],
    hi: [
      "मेरी जन्म कुंडली मेरे करियर के बारे में क्या कहती है?",
      "मेरे प्रेम जीवन और संबंधों के बारे में बताएं",
      "मेरी ताकत और कमजोरियां क्या हैं?",
      "मेरे वर्तमान ग्रह काल समझाएं",
      "मुझे कौन से रत्न धारण करने चाहिए?",
      "इस वर्ष के लिए मुझे आध्यात्मिक मार्गदर्शन दें",
      "मेरा अंक ज्योतिष मेरे बारे में क्या बताता है?",
      "मेरे KP चार्ट सिग्निफिकेटर समझाएं"
    ]
  };

  const sendMessage = async (text = null) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const birthData = birthDate ? {
        name: name || 'User',
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      } : null;

      const result = await astrologyApi.aiChat(message, birthData, tabContext, language);

      const aiMessage = { role: 'assistant', content: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errMsg = language === 'hi' ? 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const qs = quickQuestions[language] || quickQuestions.en;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{color: 'white', marginBottom: '10px'}}>🤖 {language === 'hi' ? 'AI ज्योतिष सहायक' : 'AI Astrology Assistant'}</h2>
      <p style={{color: '#ccc', marginBottom: '20px', fontSize: '13px'}}>
        {language === 'hi' ? 'अपनी कुंडली के बारे में कुछ भी पूछें!' : 'Ask anything about your chart!'}
      </p>

      <div style={{marginBottom: '15px'}}>
        <p style={{color: '#aaa', marginBottom: '8px', fontSize: '14px'}}>
          {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick Questions:'}
        </p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
          {qs.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              disabled={loading}
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                backgroundColor: '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: '#1a202c',
        borderRadius: '10px',
        padding: '15px',
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '15px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: '15px',
              backgroundColor: msg.role === 'user' ? '#6c5ce7' : '#2d3748',
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <div style={{fontWeight: 'bold', fontSize: '11px', marginBottom: '5px', opacity: 0.8}}>
                {msg.role === 'user' ? (language === 'hi' ? 'आप' : 'You') : '🤖 AI'}
              </div>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{color: '#6c5ce7', fontSize: '14px'}}>
            {language === 'hi' ? 'सोच रहा हूं...' : 'Thinking...'}
          </div>
        )}
      </div>

      <div style={{display: 'flex', gap: '10px'}}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'hi' ? 'अपना ज्योतिष प्रश्न पूछें...' : "Ask your astrological question..."}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '25px',
            border: '1px solid #4a5568',
            backgroundColor: '#2d3748',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c5ce7',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {language === 'hi' ? 'भेजें' : 'Send'}
        </button>
      </div>

      <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#2d3748', borderRadius: '8px', fontSize: '12px', color: '#aaa'}}>
        <strong style={{color: '#6c5ce7'}}>💡 {language === 'hi' ? 'सुझाव:' : 'Tip:'}</strong> {language === 'hi'
          ? 'व्यक्तिगत उत्तरों के लिए, पहले प्रोफ़ाइल टैब में अपनी जन्म जानकारी भरें। AI आपके चार्ट डेटा का उपयोग करके अधिक सटीक जानकारी प्रदान करेगा!'
          : 'For personalized answers, first fill in your birth details in the Profile tab. The AI will use your chart data to provide more accurate insights!'}
      </div>
    </div>
  );
}

export default AIChat;
