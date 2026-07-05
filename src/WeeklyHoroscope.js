import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import InlineAI from './InlineAI';

const WeeklyHoroscope = ({ userSign, onUpdateContext, birthData }) => {
  const [sign, setSign] = useState(userSign || 'Aries');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHoroscope = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getWeeklyHoroscope(sign);
      setHoroscope(result);
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'weekly_horoscope',
          sign: sign,
          love: result.love,
          career: result.career,
          health: result.health,
          finance: result.finance,
          rating: result.rating,
          advice: result.advice,
          lucky_color: result.lucky_color,
          lucky_number: result.lucky_number
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userSign) setSign(userSign);
    fetchHoroscope();
  }, [userSign]);

  const getRatingColor = (rating) => {
    const num = parseInt(rating);
    if (num >= 8) return 'text-green-400';
    if (num >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">📅 Weekly Horoscope</h2>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Select Your Sign</label>
        <select
          value={sign}
          onChange={(e) => { setSign(e.target.value); }}
          className="w-full p-3 bg-gray-700 text-white rounded"
        >
          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchHoroscope}
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold mb-6 disabled:opacity-50"
      >
        {loading ? 'Loading...' : '🔮 Get Weekly Horoscope'}
      </button>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {horoscope && !loading && (
        <div className="space-y-6">
          <div className="text-center bg-gray-700 p-6 rounded-lg">
            <p className="text-5xl font-bold text-yellow-400 mb-2">{horoscope.rating}</p>
            <p className="text-gray-400">Your Week Rating</p>
            {horoscope.confidence_percentage && (
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                horoscope.confidence_percentage >= 80 ? 'bg-green-600' :
                horoscope.confidence_percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              } text-white`}>
                {horoscope.confidence_percentage}% Confidence
              </span>
            )}
          </div>

          {horoscope.reasoning && <p className="text-gray-400 italic text-center">{horoscope.reasoning}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">💕 Love</h3>
              <p className="text-gray-300">{horoscope.love}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">💼 Career</h3>
              <p className="text-gray-300">{horoscope.career}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">❤️ Health</h3>
              <p className="text-gray-300">{horoscope.health}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">💰 Finance</h3>
              <p className="text-gray-300">{horoscope.finance}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center text-center bg-gray-700 p-4 rounded-lg">
            <div>
              <p className="text-gray-400 text-sm">🎨 Lucky Color</p>
              <p className="text-white font-bold">{horoscope.lucky_color}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">🎯 Lucky Number</p>
              <p className="text-white font-bold">{horoscope.lucky_number}</p>
            </div>
          </div>

          <div className="bg-purple-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">✨ Weekly Advice</h3>
            <p className="text-gray-300">{horoscope.advice}</p>
          </div>
          {horoscope.best_window && (
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-gray-400 text-sm">⏰ Best Window: </span>
              <span className="text-white">{horoscope.best_window}</span>
            </div>
          )}

          {horoscope.preparation && (
            <div className="bg-indigo-900 p-3 rounded">
              <span className="text-gray-400 text-sm">📋 Preparation: </span>
              <span className="text-white">{horoscope.preparation}</span>
            </div>
          )}

          <InlineAI
            tabContext={{ weekly: { sign: sign, love: horoscope.love, career: horoscope.career, health: horoscope.health, finance: horoscope.finance, rating: horoscope.rating, advice: horoscope.advice, lucky_color: horoscope.lucky_color, lucky_number: horoscope.lucky_number } }}
            birthData={birthData}
            placeholder="Ask about this week..."
          />
        </div>
      )}
    </div>
  );
};

export default WeeklyHoroscope;