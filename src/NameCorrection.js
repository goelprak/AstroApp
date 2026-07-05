import React, { useState } from 'react';
import { astrologyApi } from './api';

const NameCorrection = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!name) return;
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getNameCorrection(name, birthDate || undefined);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">✏️ Name Correction</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-1">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full p-3 bg-gray-700 text-white rounded" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Date of Birth (optional)</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded" />
        </div>
        <button onClick={analyze} disabled={loading || !name} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50">
          {loading ? 'Analyzing...' : '✏️ Analyze Name'}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Current Name</h3>
            <p className="text-white text-xl font-bold">{data.current_name}</p>
            <p className="text-purple-400 mt-2">Number: {data.current_name_number} - {data.current_name_meaning}</p>
          </div>

          {data.suggested_spellings?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">✨ Suggested Spellings</h3>
              <div className="space-y-3">
                {data.suggested_spellings.map((s, i) => (
                  <div key={i} className="bg-gray-600 p-3 rounded-lg">
                    <p className="text-white font-bold">{s.spelling}</p>
                    <p className="text-gray-400 text-sm">Number: {s.number}</p>
                    <p className="text-gray-300 text-sm">{s.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.business_name_suggestions?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">🏢 Business Name Suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {data.business_name_suggestions.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}

          {data.baby_name_suggestions?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-400 mb-3">👶 Baby Name Suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {data.baby_name_suggestions.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-pink-900 text-pink-300 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NameCorrection;
