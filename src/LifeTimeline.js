import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';

const PLANET_COLORS = {
  Sun: '#FF6B35', Moon: '#C8C8D0', Mars: '#FF4444', Mercury: '#4ADE80',
  Jupiter: '#FFD700', Venus: '#FFB6C1', Saturn: '#6B8FFE', Rahu: '#CD853F', Ketu: '#9CA3AF'
};

const LifeTimeline = ({ birthDate, birthTime, latitude, longitude, timezone }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (birthDate && birthTime) {
      fetchTimeline();
    }
  }, [birthDate, birthTime]);

  const fetchTimeline = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getLifeTimeline(birthDate, birthTime, latitude, longitude, timezone);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!birthDate || !birthTime) {
    return <div className="p-6 bg-gray-800 rounded-lg text-center"><p className="text-gray-400">Please enter your birth details in the Profile tab first.</p></div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">⏳ Life Timeline</h2>

      {loading && <p className="text-gray-400">Calculating your life timeline...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
              {data.timeline?.map((period, i) => (
                <div key={i} className="flex flex-col items-center" style={{ minWidth: period.ages ? `${Math.max(80, (parseInt(period.ages.split('-')[1] || period.ages.split('-')[0]) - parseInt(period.ages.split('-')[0])) * 20)}px` : '80px' }}>
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">{period.ages}</div>
                  <div className="w-full h-8 rounded-lg" style={{ backgroundColor: PLANET_COLORS[period.planet] || '#6B8FFE' }}></div>
                  <div className="text-xs text-gray-400 mt-1 whitespace-nowrap">{period.planet}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {data.timeline?.map((period, i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg border-l-4" style={{ borderLeftColor: PLANET_COLORS[period.planet] || '#6B8FFE' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-white font-bold">{period.planet}</span>
                    <span className="text-gray-400 text-sm ml-2">{period.ages}</span>
                  </div>
                  <div className="text-xs text-gray-500">{period.theme}</div>
                </div>
                <p className="text-gray-300 text-sm">{period.description}</p>
              </div>
            ))}
          </div>

          {data.life_stages && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">📋 Life Stages Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(data.life_stages).map(([stage, desc]) => (
                  <div key={stage} className="bg-gray-600 p-3 rounded-lg">
                    <p className="text-purple-400 font-medium text-sm mb-1">{stage}</p>
                    <p className="text-gray-300 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LifeTimeline;
