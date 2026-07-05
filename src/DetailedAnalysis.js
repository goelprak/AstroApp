import React, { useState, useEffect } from 'react';
import { astrologyApi, SIGN_SYMBOLS, ELEMENTS } from './api';
import InlineAI from './InlineAI';

const DetailedAnalysis = ({ birthDate, birthTime, latitude, longitude, timezone, onUpdateContext, birthData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (birthDate && birthTime) {
      calculateAnalysis();
    }
  }, [birthDate, birthTime, latitude, longitude]);

  const calculateAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getDetailedAnalysis(birthDate, birthTime, latitude, longitude, timezone);
      setAnalysis(result);
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'detailed_analysis',
          sun_sign: result.sun_sign,
          moon_sign: result.moon_sign,
          rising_sign: result.rising_sign,
          strengths: result.strengths,
          challenges: result.challenges,
          career: result.career,
          relationships: result.relationships,
          health: result.health,
          summary: result.summary
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!birthDate || !birthTime) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <p className="text-gray-400">Enter your birth details in Profile first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-white">📊 Detailed Chart Analysis</h2>
      
      {loading && <p className="text-gray-400">Analyzing your chart...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {analysis && !loading && (
        <>
          {analysis.confidence_overall && (
            <div className="text-center mb-2">
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
                analysis.confidence_overall >= 80 ? 'bg-green-600' :
                analysis.confidence_overall >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              } text-white`}>
                Overall Confidence: {analysis.confidence_overall}%
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-2">☀️ Sun Sign</p>
              <p className="text-3xl text-yellow-400">{SIGN_SYMBOLS[analysis.sun_sign]} {analysis.sun_sign}</p>
              <p className="text-gray-500 text-sm mt-2">Ruled by {analysis.sun_ruler}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-2">🌙 Moon Sign</p>
              <p className="text-3xl text-blue-400">{SIGN_SYMBOLS[analysis.moon_sign]} {analysis.moon_sign}</p>
              <p className="text-gray-500 text-sm mt-2">Ruled by {analysis.moon_ruler}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-2">⬆️ Rising Sign</p>
              <p className="text-3xl text-purple-400">{SIGN_SYMBOLS[analysis.rising_sign]} {analysis.rising_sign}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">🎯 Your Element & Quality</h3>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <p className="text-4xl">🔥</p>
                <p className="text-gray-400">Element</p>
                <p className="text-white text-lg">{analysis.element}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl">⚡</p>
                <p className="text-gray-400">Quality</p>
                <p className="text-white text-lg">{analysis.quality}</p>
              </div>
            </div>
          </div>

          {analysis.strengths.length > 0 && (
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-400 mb-3">💪 Your Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300">✓ {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              💼 Career Indications
              {analysis.career_confidence && (
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  analysis.career_confidence >= 80 ? 'bg-green-600' :
                  analysis.career_confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}>{analysis.career_confidence}%</span>
              )}
            </h3>
            <ul className="space-y-2">
              {analysis.career.map((c, i) => (
                <li key={i} className="text-gray-300">▸ {c}</li>
              ))}
            </ul>
            {analysis.career_reasoning && <p className="text-gray-400 italic mt-2">{analysis.career_reasoning}</p>}
            {analysis.best_timing_career && (
              <p className="text-gray-400 text-sm mt-2">⏰ Best Timing: <span className="text-white">{analysis.best_timing_career}</span></p>
            )}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-pink-400 mb-3">
              💕 Relationship
              {analysis.love_confidence && (
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  analysis.love_confidence >= 80 ? 'bg-green-600' :
                  analysis.love_confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}>{analysis.love_confidence}%</span>
              )}
            </h3>
            <ul className="space-y-2">
              {analysis.relationships.map((r, i) => (
                <li key={i} className="text-gray-300">▸ {r}</li>
              ))}
            </ul>
            {analysis.love_reasoning && <p className="text-gray-400 italic mt-2">{analysis.love_reasoning}</p>}
            {analysis.best_timing_love && (
              <p className="text-gray-400 text-sm mt-2">⏰ Best Timing: <span className="text-white">{analysis.best_timing_love}</span></p>
            )}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-400 mb-3">
              ❤️ Health
              {analysis.health_confidence && (
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  analysis.health_confidence >= 80 ? 'bg-green-600' :
                  analysis.health_confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}>{analysis.health_confidence}%</span>
              )}
            </h3>
            <ul className="space-y-2">
              {analysis.health.map((h, i) => (
                <li key={i} className="text-gray-300">▸ {h}</li>
              ))}
            </ul>
            {analysis.health_reasoning && <p className="text-gray-400 italic mt-2">{analysis.health_reasoning}</p>}
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">📝 Summary</h3>
            <p className="text-gray-300 text-lg">{analysis.summary}</p>
          </div>
          {analysis.preparation_advice && (
            <div className="bg-indigo-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📋 Preparation Advice</h3>
              <p className="text-gray-300">{analysis.preparation_advice}</p>
            </div>
          )}

          <InlineAI
            tabContext={{ detailed_analysis: { sun_sign: analysis.sun_sign, moon_sign: analysis.moon_sign, rising_sign: analysis.rising_sign, strengths: analysis.strengths, challenges: analysis.challenges, career: analysis.career, relationships: analysis.relationships, health: analysis.health, summary: analysis.summary } }}
            birthData={birthData}
            placeholder="Ask about your analysis..."
          />
        </>
      )}
    </div>
  );
};

export default DetailedAnalysis;