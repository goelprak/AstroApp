import React, { useState } from 'react';
import { astrologyApi } from './api';

const CATEGORY_ICONS = {
  'Diwali': '🪔',
  'Holi': '🎨',
  'Navratri': '🙏',
  'Ganesh': '🐘',
  'Raksha': '🧵',
  'Janmashtami': '🦚',
  'Shivratri': '🔱',
  'Ram': '🏹',
  'Durga': '🛕',
  'Eid': '🌙',
  'Makar': '☀️',
  'Pongal': '🌾',
  'Onam': '🌺',
  'Guru': '📿',
  'default': '🎉'
};

const FestivalCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCalendar = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getFestivalCalendar(year);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name) => {
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
      if (name.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return CATEGORY_ICONS.default;
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🎉 Indian Festival Calendar</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-300 mb-1">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded" />
        </div>
      </div>

      <button onClick={fetchCalendar} disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50">
        {loading ? 'Loading...' : '🎉 Get Festival Calendar'}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6 mt-6">
          {data.months?.map((month) => (
            <div key={month.month} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">{month.month}</h3>
              <div className="space-y-2">
                {month.festivals?.map((festival, i) => (
                  <div key={i} className="bg-gray-600 p-3 rounded-lg flex items-start gap-3">
                    <span className="text-xl">{getIcon(festival.name)}</span>
                    <div>
                      <p className="text-white font-medium">{festival.name}</p>
                      <p className="text-gray-400 text-sm">{festival.date}</p>
                      {festival.description && <p className="text-gray-500 text-xs mt-1">{festival.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalCalendar;
