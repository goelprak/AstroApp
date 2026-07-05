import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import InlineAI from './InlineAI';
import { HI } from './hi';

const MonthlyHoroscope = ({ userSign, onUpdateContext, birthData, language = 'en' }) => {
  const [sign, setSign] = useState(userSign || 'Aries');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const fetchHoroscope = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getMonthlyHoroscope(sign, year, month, language);
      setHoroscope(result);
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'monthly_horoscope',
          sign: sign,
          month: month,
          year: year,
          theme: result.theme,
          career: result.career,
          love: result.love,
          finance: result.finance,
          health: result.health,
          rating: result.rating,
          highlights: result.highlights,
          challenges: result.challenges,
          spirit_animal: result.spirit_animal,
          lucky_days: result.lucky_days
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

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">📆 {language === 'hi' ? HI.monthlyHoroscope : 'Monthly Horoscope'}</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-1">Sign</label>
          <select
            value={sign}
            onChange={(e) => setSign(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded"
          >
            {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="w-full p-3 bg-gray-700 text-white rounded"
          >
            {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={fetchHoroscope}
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold mb-6 disabled:opacity-50"
      >
        {loading ? 'Loading...' : '🔮 Get Monthly Horoscope'}
      </button>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {horoscope && !loading && (
        <div className="space-y-6">
          <div className="text-center bg-gray-700 p-6 rounded-lg">
            <p className="text-5xl font-bold text-yellow-400 mb-2">{horoscope.rating}</p>
            <p className="text-gray-400">Monthly Rating</p>
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

          <div className="bg-purple-900 p-6 rounded-lg text-center">
            <p className="text-gray-400 text-sm">🌟 {language === 'hi' ? HI.theme : 'Theme'}</p>
            <p className="text-2xl text-white font-bold">{horoscope.theme}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'career', label: language === 'hi' ? `💼 ${HI.career}` : '💼 Career', badge: 'bg-green-600', color: 'text-green-400' },
              { key: 'love', label: language === 'hi' ? `💕 ${HI.love}` : '💕 Love', badge: 'bg-pink-600', color: 'text-pink-400' },
              { key: 'finance', label: language === 'hi' ? `💰 ${HI.finance}` : '💰 Finance', badge: 'bg-yellow-600', color: 'text-yellow-400' },
              { key: 'health', label: language === 'hi' ? `❤️ ${HI.health}` : '❤️ Health', badge: 'bg-blue-600', color: 'text-blue-400' }
            ].map(({ key, label, badge, color }) => (
              <div key={key} className="bg-gray-700 p-4 rounded-lg">
                <h3 className={`text-lg font-semibold ${color} mb-2`}>
                  {label}
                  {horoscope[key]?.confidence && (
                    <span className={`ml-2 text-xs ${badge} text-white px-2 py-1 rounded-full`}>{horoscope[key].confidence}%</span>
                  )}
                </h3>
                <p className="text-gray-300">{horoscope[key]?.prediction}</p>
                {horoscope[key]?.reasoning && <p className="text-gray-400 italic text-sm mt-2">{horoscope[key].reasoning}</p>}
              </div>
            ))}
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">🔮 Spirit Animal</h3>
            <p className="text-white">{horoscope.spirit_animal}</p>
          </div>

          <div className="flex gap-4 justify-center text-center bg-gray-700 p-4 rounded-lg">
            <div>
              <p className="text-gray-400 text-sm">⭐ {language === 'hi' ? HI.highlights : 'Highlights'}</p>
              <p className="text-gray-300">{horoscope.highlights}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">⚠️ {language === 'hi' ? HI.challenges : 'Challenges'}</p>
              <p className="text-gray-300">{horoscope.challenges}</p>
            </div>
          </div>

          <div className="bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">🗓️ Lucky Days</h3>
            <p className="text-gray-300">{horoscope.lucky_days}</p>
          </div>
          {horoscope.best_window && (
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-gray-400 text-sm">⏰ {language === 'hi' ? HI.bestWindow : 'Best Window'}: </span>
              <span className="text-white">{horoscope.best_window}</span>
            </div>
          )}

          {horoscope.preparation && (
            <div className="bg-indigo-900 p-3 rounded">
              <span className="text-gray-400 text-sm">📋 {language === 'hi' ? HI.preparation : 'Preparation'}: </span>
              <span className="text-white">{horoscope.preparation}</span>
            </div>
          )}

          <InlineAI
            tabContext={{ monthly: { sign: sign, month: month, year: year, theme: horoscope.theme, career: horoscope.career, love: horoscope.love, finance: horoscope.finance, health: horoscope.health, rating: horoscope.rating, highlights: horoscope.highlights, challenges: horoscope.challenges, spirit_animal: horoscope.spirit_animal, lucky_days: horoscope.lucky_days } }}
            birthData={birthData}
            placeholder="Ask about this month..."
          />
        </div>
      )}
    </div>
  );
};

export default MonthlyHoroscope;