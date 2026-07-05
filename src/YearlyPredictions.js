import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';
import InlineAI from './InlineAI';

function YearlyPredictions({ birthDate, birthTime, latitude, longitude, timezone, onUpdateContext, birthData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (!birthDate || !birthTime) {
      setError('Please enter your birth details in the Profile tab first.');
      setLoading(false);
      return;
    }
    loadPredictions();
  }, [birthDate, birthTime]);

  const loadPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await astrologyApi.getYearlyPredictions(birthDate, birthTime, latitude, longitude, timezone, 10);
      setData(result);
      if (result.predictions && result.predictions.length > 0) {
        setSelectedYear(result.predictions[0].year);
      }
      if (onUpdateContext) {
        onUpdateContext({
          tab: 'yearly',
          predictions: result.predictions,
          chart_summary: result.chart_summary,
          moon_nakshatra: result.moon_nakshatra
        });
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#48bb78';
    if (rating >= 6) return '#68d391';
    if (rating >= 4) return '#ecc94b';
    return '#fc8181';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return '#48bb78';
    if (confidence >= 50) return '#ecc94b';
    return '#fc8181';
  };

  const getPlanetEmoji = (planet) => {
    const emojis = {
      'Sun': '☀️', 'Moon': '🌙', 'Mars': '♂️', 'Mercury': '☿️',
      'Jupiter': '🪐', 'Venus': '♀️', 'Saturn': '⏳', 'Rahu': '🌑', 'Ketu': '🌘'
    };
    return emojis[planet] || '⭐';
  };

  const renderCategoryCard = (title, color, emoji, data) => (
    <div style={{ background: '#2d3748', borderRadius: '10px', padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color, fontWeight: 'bold' }}>{emoji} {title}</span>
        {data?.confidence != null && (
          <span style={{
            background: getConfidenceColor(data.confidence),
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#1a202c'
          }}>
            {data.confidence}%
          </span>
        )}
      </div>
      <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
        {data?.prediction}
      </div>
      {data?.reasoning && (
        <div style={{ color: '#a0aec0', fontSize: '12px', fontStyle: 'italic', marginBottom: '6px' }}>
          {data.reasoning}
        </div>
      )}
      {data?.best_window && (
        <div style={{ color: '#68d391', fontSize: '12px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>Best window:</span> {data.best_window}
        </div>
      )}
      {data?.preparation && (
        <div style={{
          color: '#ecc94b',
          fontSize: '12px',
          borderLeft: '2px solid #ecc94b',
          paddingLeft: '8px',
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          <span style={{ fontWeight: 'bold' }}>Preparation:</span> {data.preparation}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>🔮 10-Year Predictions</h2>
        <div style={{ color: '#6c5ce7', fontSize: '18px' }}>Calculating your future... 🔮</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>🔮 10-Year Predictions</h2>
        <div style={{ color: '#fc8181', background: '#2d3748', padding: '20px', borderRadius: '10px' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!data || !data.predictions) return null;

  const selectedPred = data.predictions.find(p => p.year === selectedYear);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: 'white', marginBottom: '5px' }}>🔮 10-Year Predictions</h2>
      <div style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
        {data.chart_summary && (
          <span>
            {data.chart_summary.sun_sign} Sun · {data.chart_summary.moon_sign} Moon · {data.chart_summary.rising_sign} Rising
            {data.moon_nakshatra && ` · ${data.moon_nakshatra} Nakshatra`}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginBottom: '20px' }}>
        {data.predictions.map((pred) => (
          <button
            key={pred.year}
            onClick={() => setSelectedYear(pred.year)}
            style={{
              padding: '10px 5px',
              border: selectedYear === pred.year ? `2px solid ${getRatingColor(pred.rating)}` : '2px solid transparent',
              borderRadius: '10px',
              background: selectedYear === pred.year ? '#2d3748' : '#1a202c',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pred.year}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>Age {pred.age}</div>
            <div style={{ fontSize: '20px', marginTop: '5px' }}>{getPlanetEmoji(pred.mahadasha)}</div>
            <div style={{
              fontSize: '10px',
              color: getRatingColor(pred.rating),
              fontWeight: 'bold',
              marginTop: '3px'
            }}>
              {pred.rating}/10
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              marginTop: '4px',
              fontSize: '7px',
              lineHeight: '1.4'
            }}>
              <span style={{ color: getConfidenceColor(pred.career?.confidence) }}>
                C:{pred.career?.confidence ?? '-'}%
              </span>
              <span style={{ color: getConfidenceColor(pred.love?.confidence) }}>
                L:{pred.love?.confidence ?? '-'}%
              </span>
              <span style={{ color: getConfidenceColor(pred.finance?.confidence) }}>
                F:{pred.finance?.confidence ?? '-'}%
              </span>
              <span style={{ color: getConfidenceColor(pred.health?.confidence) }}>
                H:{pred.health?.confidence ?? '-'}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedPred && (
        <div style={{ background: '#1a202c', borderRadius: '15px', padding: '25px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{selectedPred.year}</span>
              <span style={{ color: '#aaa', marginLeft: '10px', fontSize: '14px' }}>Age {selectedPred.age}</span>
            </div>
            <div style={{
              background: getRatingColor(selectedPred.rating),
              padding: '8px 15px',
              borderRadius: '20px',
              fontWeight: 'bold',
              color: '#1a202c'
            }}>
              {selectedPred.rating}/10 · {selectedPred.rating >= 8 ? 'Excellent' : selectedPred.rating >= 6 ? 'Good' : selectedPred.rating >= 4 ? 'Mixed' : 'Challenging'}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#6c5ce7', marginBottom: '5px' }}>Cosmic Theme</div>
            <div style={{ fontSize: '16px', color: 'white', fontStyle: 'italic' }}>
              {getPlanetEmoji(selectedPred.mahadasha)} {selectedPred.mahadasha} Mahadasha · {selectedPred.antardasha} Antardasha
            </div>
            <div style={{ color: '#ecc94b', marginTop: '5px', fontWeight: 'bold' }}>
              {selectedPred.overall_theme}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {renderCategoryCard('Career', '#48bb78', '💼', selectedPred.career)}
            {renderCategoryCard('Love', '#fc8181', '❤️', selectedPred.love)}
            {renderCategoryCard('Finance', '#ecc94b', '💰', selectedPred.finance)}
            {renderCategoryCard('Health', '#63b3ed', '🏥', selectedPred.health)}
          </div>
        </div>
      )}

      <div style={{ background: '#2d3748', borderRadius: '10px', padding: '15px', marginTop: '15px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {data.predictions.map((pred) => (
            <div key={pred.year} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#aaa' }}>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{pred.year}</span>
              <span>{getPlanetEmoji(pred.mahadasha)} {pred.mahadasha}</span>
              <span style={{ color: '#666' }}>·</span>
              <span style={{ color: getRatingColor(pred.rating) }}>{pred.rating}/10</span>
            </div>
          ))}
        </div>
      </div>
      <InlineAI
        tabContext={{ yearly: { predictions: data.predictions, chart_summary: data.chart_summary, moon_nakshatra: data.moon_nakshatra } }}
        birthData={birthData}
        placeholder="Ask about a specific year..."
      />
    </div>
  );
}

export default YearlyPredictions;
