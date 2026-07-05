import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';

const Transits = ({ latitude, longitude, language = 'en' }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    latitude: latitude || '',
    longitude: longitude || ''
  });
  const [transits, setTransits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (latitude && longitude) {
      setFormData({ ...formData, latitude, longitude });
      fetchTransits();
    }
  }, [latitude, longitude]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchTransits = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getTransits(
        formData.date,
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        language
      );
      setTransits(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTransits();
  };

  const getElementColor = (element) => {
    const colors = { Fire: 'text-red-400', Earth: 'text-amber-400', Air: 'text-cyan-400', Water: 'text-blue-400' };
    return colors[element] || 'text-white';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🪐 {language === 'hi' ? HI.transits : 'Current Transits'}</h2>
      <p className="text-gray-400 mb-4">Showing planetary positions for: {formData.date}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">📅 {language === 'hi' ? 'तिथि' : 'Date'}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">📍 {language === 'hi' ? 'अक्षांश' : 'Latitude'}</label>
            <input
              type="number"
              name="latitude"
              step="0.0001"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">📍 Longitude</label>
            <input
              type="number"
              name="longitude"
              step="0.0001"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !formData.latitude || !formData.longitude}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔄 Update Transits'}
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {transits && !loading && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">🪐 Planetary Positions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(transits).map(([planet, data]) => (
              <div key={planet} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium text-lg">{planet}</span>
                  <span className={`text-lg ${getElementColor(data.element)}`}>{data.sign}</span>
                </div>
                <p className="text-gray-400">
                  {data.sign_degree}° {data.sign_minute}'
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">{data.element}</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">{data.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transits;