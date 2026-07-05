import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';
import KundliChart from './KundliChart';

const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const NavamsaChart = ({ birthDate, birthTime, latitude, longitude, timezone, language = 'en' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (birthDate && birthTime) {
      fetchChart();
    }
  }, [birthDate, birthTime]);

  const fetchChart = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getNavamsaChart(birthDate, birthTime, latitude, longitude, timezone, language);
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
      <h2 className="text-2xl font-bold mb-4 text-white">🔯 {language === 'hi' ? HI.navamsaChart : 'Navamsa (D9) Chart'}</h2>

      {loading && <p className="text-gray-400">Calculating Navamsa chart...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
            <h3 className="text-lg font-semibold text-white mb-3">{language === 'hi' ? HI.planets : 'Planet Positions in Navamsa'}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-600">
                  <th className="text-left py-2">{language === 'hi' ? HI.planet : 'Planet'}</th>
                  <th className="text-left py-2">{language === 'hi' ? HI.navamsaSign : 'Navamsa Sign'}</th>
                  <th className="text-left py-2">{language === 'hi' ? HI.degree : 'Degree'}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.planets || {}).map(([planet, info]) => (
                  <tr key={planet} className="border-b border-gray-700">
                    <td className="py-2 text-white">{planet}</td>
                    <td className="py-2 text-purple-400">{info.sign || info.navamsa_sign}</td>
                    <td className="py-2 text-gray-400">{info.degree?.toFixed(2)}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-white mb-3">{language === 'hi' ? HI.navamsaChart : 'Navamsa Kundli'}</h3>
            <KundliChart chart={data} compact={false} />
          </div>

          <div className="bg-blue-900 p-4 rounded-lg text-sm">
            <p className="text-blue-300">💡 The Navamsa (D9) chart is the most important divisional chart in Vedic astrology. It reveals the true strength of your planets and is primarily used for marriage analysis and spiritual development.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavamsaChart;
