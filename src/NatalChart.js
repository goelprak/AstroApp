import React, { useState, useEffect } from 'react';
import { astrologyApi, ELEMENTS, SIGN_SYMBOLS } from './api';
import KundliChart from './KundliChart';

const PLANET_LEGEND = [
  ['☉','Sun','#FF6B35'],['☽','Moon','#C8C8D0'],['♂','Mars','#FF4444'],
  ['☿','Mercury','#4ADE80'],['♃','Jupiter','#FFD700'],['♀','Venus','#FFB6C1'],
  ['♄','Saturn','#6B8FFE'],['☊','Rahu','#CD853F'],['☋','Ketu','#9CA3AF']
];

const HOUSE_NAMES = [
  'Self & Identity', 'Wealth & Values', 'Communication', 'Home & Family',
  'Creativity & Romance', 'Work & Health', 'Partnerships', 'Transformation',
  'Philosophy & Travel', 'Career & Status', 'Friendships', 'Spirituality'
];

const HOUSE_TOPICS = [
  'personality, appearance, life approach',
  'money, possessions, self-worth, speech',
  'thinking, siblings, short trips, skills',
  'mother, home, emotions, property',
  'children, romance, creativity, speculation',
  'daily work, health, service, enemies',
  'marriage, business partners, contracts',
  'inheritance, occult, secrets, transformation',
  'higher learning, luck, long journeys, dharma',
  'career, reputation, authority, father',
  'gains, friendships, hopes, social networks',
  'foreign lands, solitude, spirituality, losses'
];

const SIGN_HOUSE_TRAITS = {
  'Aries': { positive: 'bold, pioneering, assertive', negative: 'impulsive, aggressive', keyword: 'initiative' },
  'Taurus': { positive: 'stable, persistent, sensual', negative: 'stubborn, possessive', keyword: 'stability' },
  'Gemini': { positive: 'adaptable, curious, communicative', negative: 'restless, superficial', keyword: 'versatility' },
  'Cancer': { positive: 'nurturing, intuitive, protective', negative: 'moody, clingy', keyword: 'emotion' },
  'Leo': { positive: 'confident, generous, creative', negative: 'proud, domineering', keyword: 'expression' },
  'Virgo': { positive: 'analytical, practical, helpful', negative: 'critical, perfectionist', keyword: 'service' },
  'Libra': { positive: 'diplomatic, charming, fair', negative: 'indecisive, people-pleasing', keyword: 'harmony' },
  'Scorpio': { positive: 'intense, resourceful, passionate', negative: 'secretive, possessive', keyword: 'transformation' },
  'Sagittarius': { positive: 'optimistic, adventurous, honest', negative: 'tactless, restless', keyword: 'expansion' },
  'Capricorn': { positive: 'disciplined, ambitious, responsible', negative: 'rigid, pessimistic', keyword: 'achievement' },
  'Aquarius': { positive: 'innovative, humanitarian, original', negative: 'detached, unpredictable', keyword: 'innovation' },
  'Pisces': { positive: 'compassionate, artistic, spiritual', negative: 'escapist, overly trusting', keyword: 'compassion' }
};

function getHouseInterpretation(houseNum, sign, planets) {
  const traits = SIGN_HOUSE_TRAITS[sign] || { positive: 'influential', negative: 'challenging', keyword: 'energy' };
  const houseName = HOUSE_NAMES[houseNum - 1];
  const topics = HOUSE_TOPICS[houseNum - 1];
  const planetNames = planets.map(p => p.name);
  const planetList = planetNames.length > 0 ? `Planets placed here: ${planetNames.join(', ')}.` : 'No planets placed here.';
  const planetEffect = planetNames.length > 0
    ? ` ${planetNames.join(' and ')} energize this area of life.`
    : ` This area operates through its natural house ruler.`;

  return {
    title: `House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][houseNum-1]} — ${sign} (${houseName})`,
    summary: `With ${sign} on the ${houseName.toLowerCase()} house, ${traits.keyword} defines how this area unfolds. The ${sign} approach brings ${traits.positive}, but watch for ${traits.negative} tendencies.`,
    topics,
    planets: planetList + planetEffect
  };
}

const NatalChart = ({ birthDate, birthTime, latitude, longitude, timezone }) => {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChart, setShowChart] = useState(true);
  const [showHouseInterpretations, setShowHouseInterpretations] = useState(true);

  useEffect(() => {
    if (birthDate && birthTime) {
      calculateChart();
    }
  }, [birthDate, birthTime, latitude, longitude]);

  const calculateChart = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getNatalChart(
        birthDate, birthTime,
        parseFloat(latitude), parseFloat(longitude), timezone
      );
      setChart(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!birthDate || !birthTime) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <p className="text-gray-400">Please enter your birth details in the Profile tab first.</p>
      </div>
    );
  }

  const planetsByHouse = {};
  if (chart && chart.planets && chart.houses) {
    Object.entries(chart.planets).forEach(([name, data]) => {
      const h = data.house || 1;
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push({ name, ...data });
    });
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🧿 Your Natal Chart</h2>
      <p className="text-gray-400 mb-4">Based on: {birthDate} at {birthTime}</p>

      {loading && <p className="text-gray-400">Calculating your chart...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {chart && !loading && (
        <div className="space-y-6">
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px'}}>
            <button className={`btn btn-sm ${showChart ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowChart(true)}>
              🏠 Kundli Chart
            </button>
            <button className={`btn btn-sm ${!showChart ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowChart(false)}>
              📋 Planet List
            </button>
          </div>

          {showChart && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'24px'}}>
              <KundliChart chart={chart} compact={false} />
              <div style={{marginTop:'12px',display:'flex',gap:'10px',flexWrap:'wrap',justifyContent:'center'}}>
                {PLANET_LEGEND.map(([sym,name,color]) => (
                  <span key={name} style={{fontSize:'11px',color,display:'flex',alignItems:'center',gap:'3px'}}>
                    {sym} {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!showChart && (<>
          <div className="flex gap-4 flex-wrap justify-center">
            <div className="bg-gray-700 p-6 rounded-lg text-center min-w-32">
              <p className="text-gray-400 text-sm">☀️ Sun Sign</p>
              <p className="text-3xl text-yellow-400">{SIGN_SYMBOLS[chart.sun_sign]} {chart.sun_sign}</p>
              <p className="text-gray-500 text-sm">{ELEMENTS[chart.sun_sign]}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center min-w-32">
              <p className="text-gray-400 text-sm">🌙 Moon Sign</p>
              <p className="text-3xl text-blue-400">{SIGN_SYMBOLS[chart.moon_sign]} {chart.moon_sign}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center min-w-32">
              <p className="text-gray-400 text-sm">⬆️ Rising Sign</p>
              <p className="text-3xl text-purple-400">{SIGN_SYMBOLS[chart.rising_sign]} {chart.rising_sign}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">🪐 Planetary Positions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(chart.planets).map(([planet, data]) => (
                <div key={planet} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-white font-medium text-lg">{planet}</p>
                  <p className="text-gray-400">{SIGN_SYMBOLS[data.sign]} {data.sign} {data.degree.toFixed(1)}° House {data.house || '?'}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">🏠 Houses</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(chart.houses).map(([house, data]) => (
                <div key={house} className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-gray-400 text-sm">House {house}</p>
                  <p className="text-white font-medium">{SIGN_SYMBOLS[data.sign]} {data.sign}</p>
                </div>
              ))}
            </div>
          </div></>)}

          {chart && (
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <h3 className="text-xl font-semibold text-white" style={{margin:0}}>📖 House Interpretations</h3>
                <button
                  className={`btn btn-xs ${showHouseInterpretations ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setShowHouseInterpretations(!showHouseInterpretations)}
                  style={{fontSize:11}}
                >
                  {showHouseInterpretations ? 'Hide' : 'Show'}
                </button>
              </div>
              {showHouseInterpretations && (
                <div className="space-y-3">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(hNum => {
                    const houseData = chart.houses && chart.houses[String(hNum)];
                    if (!houseData) return null;
                    const sign = houseData.sign;
                    const planets = planetsByHouse[hNum] || [];
                    const interp = getHouseInterpretation(hNum, sign, planets);
                    return (
                      <div key={hNum} className="bg-gray-700/50 p-4 rounded-lg border-l-4" style={{borderLeftColor: hNum === 1 ? '#7C5CFC' : 'rgba(124,92,252,0.3)'}}>
                        <h4 className="text-white font-semibold mb-1">{interp.title}</h4>
                        <p className="text-gray-300 text-sm mb-1">{interp.summary}</p>
                        <p className="text-gray-400 text-xs mb-1">Governs: {interp.topics}</p>
                        <p className="text-gray-500 text-xs">{interp.planets}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NatalChart;
