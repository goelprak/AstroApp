import React, { useState } from 'react';
import { astrologyApi } from './api';

const Muhurat = () => {
  const [muhurat, setMuhurat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('Delhi');

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Surat', 'Indore', 'Bhopal', 'Patna', 'Visakhapatnam', 'Coimbatore', 'Vadodara', 'Guwahati', 'Kanpur', 'Nagpur', 'Ludhiana', 'Bhubaneswar', 'Ranchi', 'Dehradun', 'Mysore', 'Faridabad', 'Gurgaon', 'Noida', 'Ghaziabad', 'Srinagar', 'Jammu', 'Panaji', 'Puducherry', 'Mangalore', 'Tirupathi', 'Madurai', 'Calicut', 'Ernakulam', 'Guntur', 'Warangal', 'Nellore'];

  const calculate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getMuhurat(date, city);
      setMuhurat(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🕐 Daily Muhurat (Auspicious Timing)</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-1">📅 Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">🏙️ City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded"
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? 'Calculating...' : '🕐 Get Today\'s Muhurat'}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {muhurat && !loading && (
        <div className="space-y-6 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">📅 {muhurat.date} | 📍 {muhurat.city}</p>
            <p className="text-gray-400">🌅 Sunrise: {muhurat.sunrise} | 🌇 Sunset: {muhurat.sunset}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-3">✅ Auspicious Muhurats</h3>
            <div className="space-y-3">
              {muhurat.muhurats.map((m, i) => (
                <div key={i} className="bg-gray-600 p-3 rounded-lg">
                  <p className="text-white font-bold">{m.name}</p>
                  <p className="text-gray-400 text-sm">⏰ {m.time}</p>
                  <p className="text-gray-300 text-sm">🎯 {m.activities.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-900 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-red-300 mb-3">❌ Avoid These Times</h3>
            <div className="space-y-2">
              <p className="text-gray-300">⛔ Rahu Kalam: {muhurat.avoid.rahu_kalam}</p>
              <p className="text-gray-300">⛔ Yamaganda: {muhurat.avoid.yamaganda}</p>
              <p className="text-gray-300">⛔ Gulikai Kalam: {muhurat.avoid.gulikai_kalam}</p>
            </div>
          </div>

          <div className="bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">💡 Advice</h3>
            <p className="text-gray-300">{muhurat.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Muhurat;