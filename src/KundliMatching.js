import React, { useState } from 'react';
import { astrologyApi, SIGN_SYMBOLS } from './api';
import { HI } from './hi';

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 };

const KundliMatching = ({ profile, location, language = 'en' }) => {
  const [person1, setPerson1] = useState({
    name: profile?.name || '',
    birthDate: profile?.birthDate || '',
    birthTime: profile?.birthTime || '',
  });
  const [person2, setPerson2] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const calculateCharts = async (person) => {
    return await astrologyApi.getNatalChart(
      person.birthDate,
      person.birthTime,
      location?.lat || DEFAULT_LOCATION.lat,
      location?.lng || DEFAULT_LOCATION.lng,
      'Asia/Kolkata',
      language
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const [chart1, chart2] = await Promise.all([
        calculateCharts(person1),
        calculateCharts(person2)
      ]);
      const [matching, manglik] = await Promise.all([
        astrologyApi.getKundliMatching(chart1, chart2, language),
        astrologyApi.getManglik(chart1, null, language)
      ]);
      setResult({
        ...matching,
        manglik,
        person1: { name: person1.name, sun: chart1.sun_sign, moon: chart1.moon_sign },
        person2: { name: person2.name, sun: chart2.sun_sign, moon: chart2.moon_sign }
      });
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score, max) => {
    const percent = (score / max) * 100;
    if (percent >= 70) return 'text-green-400';
    if (percent >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResultColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-600';
    if (percentage >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">💍 {language === 'hi' ? HI.kundliMatching : 'Kundli Matching (36 Guna)'}</h2>
      
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">👤 Boy / Groom</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={person1.name}
                onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                className="w-full p-3 bg-gray-600 text-white rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="birthDate"
                  value={person1.birthDate}
                  onChange={(e) => setPerson1({ ...person1, birthDate: e.target.value })}
                  className="p-3 bg-gray-600 text-white rounded"
                />
                <input
                  type="time"
                  name="birthTime"
                  value={person1.birthTime}
                  onChange={(e) => setPerson1({ ...person1, birthTime: e.target.value })}
                  className="p-3 bg-gray-600 text-white rounded"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!person1.birthDate || !person1.birthTime}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50"
          >
            Continue for Girl ➡️
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">👩 Girl / Bride</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={person2.name}
                onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                className="w-full p-3 bg-gray-600 text-white rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="birthDate"
                  value={person2.birthDate}
                  onChange={(e) => setPerson2({ ...person2, birthDate: e.target.value })}
                  className="p-3 bg-gray-600 text-white rounded"
                  required
                />
                <input
                  type="time"
                  name="birthTime"
                  value={person2.birthTime}
                  onChange={(e) => setPerson2({ ...person2, birthTime: e.target.value })}
                  className="p-3 bg-gray-600 text-white rounded"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg"
            >
              ⬅️ Back
            </button>
            <button
              type="submit"
              disabled={loading || !person2.birthDate || !person2.birthTime}
              className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-bold disabled:opacity-50"
            >
              {loading ? (language === 'hi' ? HI.kundliMatching : 'Matching...') : `💍 ${language === 'hi' ? HI.kundliMatching : 'Match Kundli'}`}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && step === 3 && (
        <div className="space-y-6">
          <div className={`text-center p-8 rounded-lg ${getResultColor(result.percentage)}`}>
            <p className="text-7xl font-bold text-white mb-2">{result.percentage}%</p>
            <p className="text-xl text-white">{result.result}</p>
            <p className="text-white mt-2">{result.obtained_gunas} / {result.total_gunas} {language === 'hi' ? HI.guna : 'Gunas'}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400">👤 {result.person1.name || 'Boy'}</p>
              <p className="text-2xl text-yellow-400">{SIGN_SYMBOLS[result.person1.sun]} {result.person1.sun}</p>
              <p className="text-gray-400">Moon: {result.person1.moon}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400">👩 {result.person2.name || 'Girl'}</p>
              <p className="text-2xl text-yellow-400">{SIGN_SYMBOLS[result.person2.sun]} {result.person2.sun}</p>
              <p className="text-gray-400">Moon: {result.person2.moon}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">📊 {language === 'hi' ? HI.gunaMilaan : 'Guna Breakdown'}</h3>
            <div className="space-y-2">
              {Object.entries(result.details).map(([key, data]) => (
                <div key={key} className="flex justify-between items-center bg-gray-600 p-3 rounded">
                  <span className="text-gray-300">{key}</span>
                  <span className={`font-bold ${getScoreColor(data.score, data.max)}`}>
                    {data.score} / {data.max}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.manglik && (
            <div className={`p-4 rounded-lg ${result.manglik.is_manglik ? 'bg-red-900' : 'bg-green-900'}`}>
              <h3 className="text-lg font-semibold text-white mb-2">
                {result.manglik.is_manglik ? `🔥 ${language === 'hi' ? HI.manglikDosha : 'Manglik Dosha Detected'}` : `✅ ${language === 'hi' ? HI.manglikDosha : 'No Manglik Dosha'}`}
              </h3>
              {result.manglik.is_manglik && (
                <div className="space-y-2">
                  <p className="text-white">{language === 'hi' ? 'दोष स्तर' : 'Dosha Level'}: <strong>{result.manglik.dosha_level}</strong></p>
                  <p className="text-gray-300">{language === 'hi' ? 'मंगल भाव में' : 'Mars in houses'}: {result.manglik.house_placements?.join(', ') || '?'}</p>
                  <p className="text-gray-300">{result.manglik.description}</p>
                </div>
              )}
              {result.manglik.chart2 && (
                <div className="mt-2 p-2 bg-black bg-opacity-20 rounded">
                  <p className="text-gray-300">
                    {language === 'hi' ? '👩 साथी' : '👩 Partner'}: {result.manglik.chart2.is_manglik ? `🔥 ${HI.manglik}` : `✅ ${language === 'hi' ? 'गैर-मांगलिक' : 'Non-Manglik'}`} ({result.manglik.chart2.dosha_level})
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">💡 {language === 'hi' ? HI.advice : 'Advice'}</h3>
            <p className="text-gray-300">{result.advice}</p>
          </div>

          <button
            onClick={() => { setStep(1); setResult(null); }}
            className="w-full py-3 bg-gray-600 text-white rounded-lg"
          >
            🔄 {language === 'hi' ? HI.kundliMatching : 'Match Again'}
          </button>
        </div>
      )}
    </div>
  );
};

export default KundliMatching;