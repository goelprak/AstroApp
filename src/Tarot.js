import React, { useState } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';
import InlineAI from './InlineAI';

const Tarot = ({ onUpdateContext, birthData, language = 'en' }) => {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [count, setCount] = useState(3);

  const drawCards = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getTarot(count, question, language);
      setCards(result);
      if (onUpdateContext) {
        onUpdateContext({
          cards: result.cards,
          question: result.question,
          summary: result.summary,
          guidance: result.guidance
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🃏 {language === 'hi' ? HI.tarot : 'Tarot Reading'}</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-1">{language === 'hi' ? HI.question : 'Your Question (optional)'}</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What does my future hold?"
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">Number of Cards: {count}</label>
          <input
            type="range"
            min="1"
            max="7"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-gray-400 text-sm">
            <span>1</span><span>3</span><span>5</span><span>7</span>
          </div>
        </div>

        <button
          onClick={drawCards}
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? `🃏 ${language === 'hi' ? HI.drawCards : 'Shuffling cards...'}` : `🃏 ${language === 'hi' ? HI.drawCards : 'Draw Cards'}`}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {cards && !loading && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">Question: {cards.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.cards.map((card) => (
              <div key={card.position} className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-lg text-center">
                <p className="text-gray-400 text-sm mb-2">{language === 'hi' ? HI.position : 'Card'} {card.position}</p>
                <p className="text-2xl mb-3">🃏</p>
                <p className="text-white font-bold text-lg mb-2">{card.name}</p>
                <p className="text-gray-300 text-sm mb-3">{card.meaning}</p>
                <p className="text-purple-400 text-sm italic">{card.advice}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">✨ Summary</h3>
            <p className="text-gray-300">{cards.summary}</p>
          </div>

          <div className="bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">💡 Guidance</h3>
            <p className="text-gray-300">{cards.guidance}</p>
          </div>
          <InlineAI
            tabContext={{ tarot: { cards: cards.cards, question: cards.question, summary: cards.summary, guidance: cards.guidance } }}
            birthData={birthData}
            placeholder="Ask about these cards..."
          />
        </div>
      )}
    </div>
  );
};

export default Tarot;