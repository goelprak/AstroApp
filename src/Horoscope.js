import React, { useState, useEffect } from 'react';
import { astrologyApi, ZODIAC_SIGNS, SIGN_SYMBOLS } from './api';
import InlineAI from './InlineAI';
import { HI } from './hi';

const Horoscope = ({ sign: userSign, onUpdateContext, birthData, language = 'en' }) => {
  const [selectedSign, setSelectedSign] = useState(userSign || 'Aries');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHoroscope = async (sign) => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getHoroscope(sign || selectedSign, language);
      setHoroscope(result);
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'horoscope',
          sign: result.sign,
          date: result.date,
          prediction: result.prediction,
          mood: result.mood,
          lucky_number: result.lucky_number,
          lucky_color: result.lucky_color,
          lucky_day: result.lucky_day,
          focus_area: result.focus_area
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userSign) {
      setSelectedSign(userSign);
    }
    fetchHoroscope(userSign || selectedSign);
  }, [userSign]);

  const getElementColor = (sign) => {
    const colors = { Fire: 'text-red-400', Earth: 'text-amber-400', Air: 'text-cyan-400', Water: 'text-blue-400' };
    const elements = { Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire', Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth', Gemini: 'Air', Libra: 'Air', Aquarius: 'Air', Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water' };
    return colors[elements[sign]] || 'text-white';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🌟 {language === 'hi' ? HI.dailyHoroscope : 'Daily Horoscope'}</h2>
      {userSign && <p className="text-gray-400 mb-4">Your Sun Sign: {SIGN_SYMBOLS[userSign]} {userSign}</p>}

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Or select a different sign:</label>
        <div className="flex flex-wrap gap-2">
          {ZODIAC_SIGNS.map((sign) => (
            <button
              key={sign}
              onClick={() => { setSelectedSign(sign); fetchHoroscope(sign); }}
              className={`px-3 py-2 rounded transition-colors ${selectedSign === sign ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <span className="mr-1">{SIGN_SYMBOLS[sign]}</span>
              {sign}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading horoscope...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {horoscope && !loading && (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-3xl font-bold ${getElementColor(horoscope.sign)}`}>
                {SIGN_SYMBOLS[horoscope.sign]} {horoscope.sign}
              </h3>
              <p className="text-gray-400">{horoscope.date}</p>
            </div>
            <div className={`text-4xl font-bold ${getElementColor(horoscope.sign)}`}>
              {horoscope.mood}
            </div>
          </div>

          <p className="text-lg text-white mb-6">{horoscope.prediction}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {['career', 'love', 'health', 'finance'].map(area => {
              const val = horoscope[`confidence_${area}`];
              const colors = { career: 'bg-blue-600', love: 'bg-pink-600', health: 'bg-green-600', finance: 'bg-yellow-600' };
              return val ? (
                <span key={area} className={`${colors[area]} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                  {area.charAt(0).toUpperCase() + area.slice(1)} {val}%
                </span>
              ) : null;
            })}
          </div>

          {horoscope.reasoning && <p className="text-gray-400 italic mb-4">{horoscope.reasoning}</p>}

          {horoscope.best_timing && (
            <div className="bg-gray-800 p-3 rounded mb-4">
              <span className="text-gray-400 text-sm">⏰ {language === 'hi' ? HI.bestWindow : 'Best Timing'}: </span>
              <span className="text-white">{horoscope.best_timing}</span>
            </div>
          )}

          {horoscope.preparation && (
            <div className="bg-indigo-900 p-3 rounded mb-4">
              <span className="text-gray-400 text-sm">📋 {language === 'hi' ? HI.preparation : 'Preparation'}: </span>
              <span className="text-white">{horoscope.preparation}</span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="text-gray-400 text-sm">🎯 Lucky Number</p>
              <p className="text-2xl text-yellow-400">{horoscope.lucky_number}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="text-gray-400 text-sm">🎨 Lucky Color</p>
              <p className="text-xl text-pink-400">{horoscope.lucky_color}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="text-gray-400 text-sm">📅 Lucky Day</p>
              <p className="text-xl text-blue-400">{horoscope.lucky_day}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="text-gray-400 text-sm">🎯 Focus Area</p>
              <p className="text-xl text-green-400">{horoscope.focus_area}</p>
            </div>
          </div>
          <InlineAI
            tabContext={{ horoscope: { sign: horoscope.sign, date: horoscope.date, prediction: horoscope.prediction, mood: horoscope.mood, lucky_number: horoscope.lucky_number, lucky_color: horoscope.lucky_color, lucky_day: horoscope.lucky_day, focus_area: horoscope.focus_area } }}
            birthData={birthData}
            placeholder="Ask about this horoscope..."
          />
        </div>
      )}
    </div>
  );
};

export default Horoscope;