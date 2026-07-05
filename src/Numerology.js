import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import InlineAI from './InlineAI';
import { HI } from './hi';

const Numerology = ({ name, birthDate, onUpdateContext, birthData, language = 'en' }) => {
  const [numerology, setNumerology] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputName, setInputName] = useState(name || '');
  const [inputDate, setInputDate] = useState(birthDate || '');

  const calculate = async () => {
    if (!inputName || !inputDate) return;
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getNumerology(inputName, inputDate, language);
      setNumerology(result);
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'numerology',
          life_path: result.life_path,
          destiny: result.destiny,
          soul_urge: result.soul_urge,
          personality: result.personality,
          personal_year: result.personal_year,
          birth_day: result.birth_day,
          name_number: result.name_number,
          challenges: result.challenges
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name && birthDate) {
      setInputName(name);
      setInputDate(birthDate);
      setTimeout(calculate, 0);
    }
  }, [name, birthDate]);

  const getNumberColor = (num) => {
    if (num === 11) return 'text-teal-400';
    if (num === 22) return 'text-rose-400';
    if (num === 33) return 'text-amber-400';
    const colors = { 1: 'text-yellow-400', 2: 'text-pink-400', 3: 'text-purple-400', 4: 'text-blue-400', 5: 'text-green-400', 6: 'text-orange-400', 7: 'text-cyan-400', 8: 'text-red-400', 9: 'text-indigo-400' };
    return colors[num] || 'text-white';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🔢 {language === 'hi' ? HI.numerology : 'Numerology Report'}</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </div>
        <button
          onClick={calculate}
          disabled={loading || !inputName || !inputDate}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Calculating...' : '🔮 Generate Report'}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {numerology && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">{language === 'hi' ? HI.lifePath : 'Life Path'}</p>
              <p className={`text-4xl font-bold ${getNumberColor(numerology.life_path)}`}>{numerology.life_path}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">{language === 'hi' ? HI.destiny : 'Destiny'}</p>
              <p className={`text-4xl font-bold ${getNumberColor(numerology.destiny)}`}>{numerology.destiny}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">{language === 'hi' ? HI.soulUrge : 'Soul Urge'}</p>
              <p className={`text-4xl font-bold ${getNumberColor(numerology.soul_urge)}`}>{numerology.soul_urge}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">{language === 'hi' ? HI.personality : 'Personality'}</p>
              <p className={`text-4xl font-bold ${getNumberColor(numerology.personality)}`}>{numerology.personality}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">🌟 {language === 'hi' ? HI.lifePath : 'Life Path'}: {numerology.life_path}</h3>
            <p className="text-gray-300 text-lg">{numerology.life_path_meaning}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">✨ {language === 'hi' ? HI.destiny : 'Destiny'}: {numerology.destiny}</h3>
            <p className="text-gray-300">{numerology.destiny_meaning}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">💫 {language === 'hi' ? HI.soulUrge : 'Soul Urge'}: {numerology.soul_urge}</h3>
            <p className="text-gray-300">{numerology.soul_urge_meaning}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">🎭 {language === 'hi' ? HI.personality : 'Personality'}: {numerology.personality}</h3>
            <p className="text-gray-300">{numerology.personality_meaning}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm">{language === 'hi' ? HI.birthDay : 'Birth Day'}</h4>
              <p className={`text-2xl font-bold ${getNumberColor(numerology.birth_day)}`}>{numerology.birth_day}</p>
              <p className="text-gray-400 text-xs mt-1">{numerology.birth_day_meaning}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm">Maturity</h4>
              <p className={`text-2xl font-bold ${getNumberColor(numerology.maturity)}`}>{numerology.maturity}</p>
              <p className="text-gray-400 text-xs mt-1">Your later life purpose</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm">Power</h4>
              <p className={`text-2xl font-bold ${getNumberColor(numerology.power_number)}`}>{numerology.power_number}</p>
              <p className="text-gray-400 text-xs mt-1">Life Path + Destiny</p>
            </div>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">📅 {language === 'hi' ? HI.year : 'This Year'}: {numerology.personal_year}</h3>
            <p className="text-gray-300">{numerology.personal_year_meaning}</p>
            <p className="text-gray-400 text-sm mt-2">{language === 'hi' ? HI.theme : 'Theme'}: {numerology.yearly_theme}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">📛 Name Analysis</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Name Number</p>
                <p className={`text-2xl font-bold ${getNumberColor(numerology.name_number)}`}>{numerology.name_number}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cornerstone</p>
                <p className={`text-2xl font-bold ${getNumberColor(numerology.cornerstone)}`}>{numerology.cornerstone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Capstone</p>
                <p className={`text-2xl font-bold ${getNumberColor(numerology.capstone)}`}>{numerology.capstone}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-3">{numerology.cornerstone_meaning}</p>
            <p className="text-gray-400 text-sm mt-2">{numerology.capstone_meaning}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">⚔️ Life Challenges</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-gray-600 p-3 rounded">
                <p className="text-gray-400 text-sm">Age 0-35</p>
                <p className={`text-xl font-bold ${getNumberColor(numerology.challenges.first)}`}>{numerology.challenges.first}</p>
              </div>
              <div className="bg-gray-600 p-3 rounded">
                <p className="text-gray-400 text-sm">Age 35-44</p>
                <p className={`text-xl font-bold ${getNumberColor(numerology.challenges.second)}`}>{numerology.challenges.second}</p>
              </div>
              <div className="bg-gray-600 p-3 rounded">
                <p className="text-gray-400 text-sm">Age 45-53</p>
                <p className={`text-xl font-bold ${getNumberColor(numerology.challenges.third)}`}>{numerology.challenges.third}</p>
              </div>
              <div className="bg-gray-600 p-3 rounded">
                <p className="text-gray-400 text-sm">Age 54+</p>
                <p className={`text-xl font-bold ${getNumberColor(numerology.challenges.fourth)}`}>{numerology.challenges.fourth}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">🔮 Current Reading</h3>
            <p className="text-gray-300">Personal Month: <span className="font-bold text-yellow-400">{numerology.personal_month}</span></p>
            <p className="text-gray-300">Personal Day: <span className="font-bold text-yellow-400">{numerology.personal_day}</span></p>
          </div>

          <InlineAI
            tabContext={{ numerology: { life_path: numerology.life_path, destiny: numerology.destiny, soul_urge: numerology.soul_urge, personality: numerology.personality, personal_year: numerology.personal_year, birth_day: numerology.birth_day, name_number: numerology.name_number, challenges: numerology.challenges } }}
            birthData={birthData}
            placeholder="Ask about your numbers..."
          />
        </div>
      )}
    </div>
  );
};

export default Numerology;