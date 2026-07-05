import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';

const ForeignSettlement = ({ birthDate, birthTime, latitude, longitude, timezone, language = 'en' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (birthDate && birthTime) {
      fetchAnalysis();
    }
  }, [birthDate, birthTime]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getForeignSettlement(birthDate, birthTime, latitude, longitude, timezone, language);
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
      <h2 className="text-2xl font-bold mb-4 text-white">🌍 {language === 'hi' ? HI.foreignSettlement : 'Foreign Settlement Analysis'}</h2>

      {loading && <p className="text-gray-400">Analyzing foreign settlement potential...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">{language === 'hi' ? HI.probability : 'Probability Score'}</p>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div className="bg-purple-600 h-4 rounded-full transition-all" style={{ width: `${data.probability_score}%` }}></div>
            </div>
            <p className="text-white text-center font-bold">{data.probability_score}/100</p>
            {data.confidence_level && <p className="text-center text-sm text-gray-400 mt-1">{language === 'hi' ? HI.confidence : 'Confidence'}: {data.confidence_level}</p>}
          </div>

          {data.reasoning && (
            <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-gray-300 italic">{data.reasoning}</p>
            </div>
          )}

          {data.factor_breakdown && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Factor Breakdown</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(data.factor_breakdown).map(([k,v]) => (
                  k !== 'total' && <div key={k} className="flex justify-between text-gray-400"><span>{k.replace(/_/g,' ')}</span><span className="text-white">{v}%</span></div>
                ))}
                <div className="flex justify-between text-gray-300 font-bold border-t border-gray-600 pt-1 mt-1"><span>Total</span><span className="text-purple-400">{data.factor_breakdown.total}%</span></div>
              </div>
            </div>
          )}

          {data.best_window && (
            <div className="bg-green-900 p-4 rounded-lg">
              <h3 className="text-green-400 font-semibold mb-1">🌟 {language === 'hi' ? HI.bestWindow : 'Best Window'}</h3>
              <p className="text-green-200">{data.best_window}</p>
            </div>
          )}

          {data.preparation && (
            <div className="bg-indigo-900 p-4 rounded-lg">
              <h3 className="text-indigo-400 font-semibold mb-1">🎯 {language === 'hi' ? HI.preparation : 'Preparation'}</h3>
              <p className="text-indigo-200">{data.preparation}</p>
            </div>
          )}

          {data.best_years?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">🌟 Best Years for Settlement</h3>
              <div className="flex flex-wrap gap-2">
                {data.best_years.map((y, i) => (
                  <span key={i} className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">{y}</span>
                ))}
              </div>
            </div>
          )}

          {data.country_direction && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-1">🧭 Favorable Direction</h3>
              <p className="text-white text-lg">{data.country_direction}</p>
            </div>
          )}

          {data.description && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300">{data.description}</p>
            </div>
          )}

          <div className="bg-yellow-900 p-4 rounded-lg text-sm">
            <p className="text-yellow-300">⚠️ This analysis is for traditional astrological interpretation only and should not be the sole basis for major life decisions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForeignSettlement;
