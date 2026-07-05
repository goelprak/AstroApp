import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';

const WealthPrediction = ({ birthDate, birthTime, latitude, longitude, timezone, language = 'en' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (birthDate && birthTime) {
      fetchPrediction();
    }
  }, [birthDate, birthTime]);

  const fetchPrediction = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getWealthPrediction(birthDate, birthTime, latitude, longitude, timezone, language);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPotentialColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!birthDate || !birthTime) {
    return <div className="p-6 bg-gray-800 rounded-lg text-center"><p className="text-gray-400">Please enter your birth details in the Profile tab first.</p></div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">💰 {language === 'hi' ? HI.wealthPrediction : 'Wealth Prediction'}</h2>

      {loading && <p className="text-gray-400">Analyzing your wealth potential...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-1">{language === 'hi' ? HI.wealthPotential : 'Wealth Potential'}</p>
            <p className={`text-3xl font-bold ${getPotentialColor(data.wealth_potential)}`}>{data.wealth_potential}</p>
            {data.confidence_score && <p className="text-white text-lg mt-1">{language === 'hi' ? HI.confidence : 'Confidence'}: {data.confidence_score}%</p>}
          </div>

          {data.reasoning && (
            <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-gray-300 italic">{data.reasoning}</p>
            </div>
          )}

          {data.score_breakdown && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Score Breakdown</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(data.score_breakdown).map(([k,v]) => (
                  k !== 'total' && <div key={k} className="flex justify-between text-gray-400"><span>{k.replace(/_/g,' ')}</span><span className="text-white">{v}</span></div>
                ))}
                <div className="flex justify-between text-gray-300 font-bold border-t border-gray-600 pt-1 mt-1"><span>Total</span><span className="text-purple-400">{data.score_breakdown.total}</span></div>
              </div>
            </div>
          )}

          {data.best_investment_window && (
            <div className="bg-green-900 p-4 rounded-lg">
              <h3 className="text-green-400 font-semibold mb-1">📈 {language === 'hi' ? HI.favorablePeriods : 'Best Investment Window'}</h3>
              <p className="text-green-200">{data.best_investment_window}</p>
            </div>
          )}

          {data.preparation && (
            <div className="bg-indigo-900 p-4 rounded-lg">
              <h3 className="text-indigo-400 font-semibold mb-1">🎯 {language === 'hi' ? HI.preparation : 'Preparation'}</h3>
              <p className="text-indigo-200">{data.preparation}</p>
            </div>
          )}

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">{data.description}</p>
          </div>

          {data.investment_periods?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">📈 {language === 'hi' ? HI.favorablePeriods : 'Investment Periods'}</h3>
              <div className="flex flex-wrap gap-2">
                {data.investment_periods.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">{p}</span>
                ))}
              </div>
            </div>
          )}

          {data.loss_periods?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Loss Periods</h3>
              <div className="flex flex-wrap gap-2">
                {data.loss_periods.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm">{p}</span>
                ))}
              </div>
            </div>
          )}

          {data.lucky_years?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">🍀 Lucky Years</h3>
              <div className="flex flex-wrap gap-2">
                {data.lucky_years.map((y, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm">{y}</span>
                ))}
              </div>
            </div>
          )}

          {data.property_buying_periods?.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">🏠 Property Buying Periods</h3>
              <div className="flex flex-wrap gap-2">
                {data.property_buying_periods.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WealthPrediction;
