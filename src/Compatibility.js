import React, { useState } from 'react';
import { astrologyApi, SIGN_SYMBOLS } from './api';

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 };

const Compatibility = ({ profile, location }) => {
  const [person1, setPerson1] = useState({
    name: profile?.name || '',
    birthDate: profile?.birthDate || '',
    birthTime: profile?.birthTime || '',
    latitude: profile?.latitude || '',
    longitude: profile?.longitude || ''
  });
  const [person2, setPerson2] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    latitude: '',
    longitude: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handlePerson1Change = (e) => {
    setPerson1({ ...person1, [e.target.name]: e.target.value });
  };

  const handlePerson2Change = (e) => {
    setPerson2({ ...person2, [e.target.name]: e.target.value });
  };

  const calculateCharts = async (person, loc) => {
    return await astrologyApi.getNatalChart(
      person.birthDate,
      person.birthTime,
      parseFloat(person.latitude || loc?.lat || DEFAULT_LOCATION.lat),
      parseFloat(person.longitude || loc?.lng || DEFAULT_LOCATION.lng),
      'Asia/Kolkata'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const [chart1, chart2] = await Promise.all([
        calculateCharts(person1, location),
        calculateCharts(person2, location)
      ]);
      const compatibility = await astrologyApi.getCompatibility(chart1, chart2);
      setResult({
        ...compatibility,
        person1: { name: person1.name, sun: chart1.sun_sign, moon: chart1.moon_sign, rising: chart1.rising_sign },
        person2: { name: person2.name, sun: chart2.sun_sign, moon: chart2.moon_sign, rising: chart2.rising_sign }
      });
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 70) return '💖 Excellent match!';
    if (score >= 50) return '💛 Good compatibility';
    return '💔 Challenging but can grow';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">💕 Compatibility</h2>
      
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">👤 You</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={person1.name}
                onChange={handlePerson1Change}
                className="w-full p-3 bg-gray-600 text-white rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="birthDate"
                  value={person1.birthDate}
                  onChange={handlePerson1Change}
                  className="p-3 bg-gray-600 text-white rounded"
                />
                <input
                  type="time"
                  name="birthTime"
                  value={person1.birthTime}
                  onChange={handlePerson1Change}
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
            Continue to Partner ➡️
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">👥 Partner</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Partner's Name"
                value={person2.name}
                onChange={handlePerson2Change}
                className="w-full p-3 bg-gray-600 text-white rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="birthDate"
                  placeholder="Date of Birth"
                  value={person2.birthDate}
                  onChange={handlePerson2Change}
                  className="p-3 bg-gray-600 text-white rounded"
                  required
                />
                <input
                  type="time"
                  name="birthTime"
                  placeholder="Time of Birth"
                  value={person2.birthTime}
                  onChange={handlePerson2Change}
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
              {loading ? 'Calculating...' : '💕 Check Compatibility'}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && step === 3 && (
        <div className="space-y-6">
          <div className="text-center bg-gray-700 p-8 rounded-lg">
            <p className="text-gray-400 mb-2">Compatibility Score</p>
            <p className={`text-7xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</p>
            <p className="text-white text-xl mt-4">{getScoreMessage(result.score)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-2">👤 {result.person1.name || 'You'}</p>
              <p className="text-yellow-400 text-2xl">{SIGN_SYMBOLS[result.person1.sun]} {result.person1.sun}</p>
              <p className="text-gray-400">🌙 {result.person1.moon} | ⬆️ {result.person1.rising}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-2">👥 {result.person2.name || 'Partner'}</p>
              <p className="text-yellow-400 text-2xl">{SIGN_SYMBOLS[result.person2.sun]} {result.person2.sun}</p>
              <p className="text-gray-400">🌙 {result.person2.moon} | ⬆️ {result.person2.rising}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">☀️ Sun Connection</p>
              <p className={`text-lg ${result.sun_aspect === 'Compatible' ? 'text-green-400' : 'text-orange-400'}`}>
                {result.sun_aspect}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">🌙 Moon Connection</p>
              <p className={`text-lg ${result.moon_aspect === 'Compatible' ? 'text-green-400' : 'text-orange-400'}`}>
                {result.moon_aspect}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">🔥 Element Match</p>
              <p className={`text-lg ${result.element_match ? 'text-green-400' : 'text-orange-400'}`}>
                {result.element_match ? 'Yes!' : 'Different'}
              </p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3">✨ Aspect Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-green-400 text-2xl font-bold">{result.aspect_summary.trines}</p>
                <p className="text-gray-400 text-sm">Trines 🌟</p>
              </div>
              <div>
                <p className="text-yellow-400 text-2xl font-bold">{result.aspect_summary.conjunctions}</p>
                <p className="text-gray-400 text-sm">Conjunctions ✨</p>
              </div>
              <div>
                <p className="text-orange-400 text-2xl font-bold">{result.aspect_summary.squares}</p>
                <p className="text-gray-400 text-sm">Squares ⚡</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setStep(1); setResult(null); }}
            className="w-full py-3 bg-gray-600 text-white rounded-lg"
          >
            🔄 Check Another Match
          </button>
        </div>
      )}
    </div>
  );
};

export default Compatibility;