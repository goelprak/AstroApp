import React, { useState } from 'react';

const HOUSE_GRID = [
  [10, 11, 12, 1],
  [9,  null, null, 2],
  [8,  null, null, 3],
  [7,  6,   5,    4]
];

const PLANET_COLORS = {
  Sun: '#FF6B35', Moon: '#C8C8D0', Mars: '#FF4444', Mercury: '#4ADE80',
  Jupiter: '#FFD700', Venus: '#FFB6C1', Saturn: '#6B8FFE', Rahu: '#CD853F',
  Ketu: '#9CA3AF', Uranus: '#22D3EE', Neptune: '#374FA8', Pluto: '#A855F7'
};

const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Venus: '♀',
  Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋', Uranus: '♅', Neptune: '♆', Pluto: '♇'
};

const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const SIGN_SYMBOLS_SHORT = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const HOUSE_NAMES = [
  'Self & Identity', 'Wealth & Values', 'Communication', 'Home & Family',
  'Creativity & Romance', 'Work & Health', 'Partnerships', 'Transformation',
  'Philosophy & Travel', 'Career & Status', 'Friendships & Hopes', 'Spirituality'
];

const HOUSE_TOPICS = [
  'personality, appearance, life approach',
  'money, possessions, self-worth',
  'thinking, siblings, short trips, skills',
  'mother, home, emotions, property',
  'children, romance, creativity, fun',
  'daily work, health, service, enemies',
  'marriage, partnerships, contracts',
  'inheritance, occult, secrets, rebirth',
  'higher learning, luck, long journeys',
  'career, reputation, authority, father',
  'gains, friendships, social networks',
  'foreign lands, solitude, spirituality'
];

const HOUSE_SUMMARIES = {
  1: (s, p) => p.length ? `${s} rising gives you a ${s.toLowerCase()} personality. ${p[0].name} in this house intensifies your self-expression.` : `${s} rising shapes your outward personality and physical appearance.`,
  2: (s, p) => p.length ? `Wealth comes through ${s.toLowerCase()} qualities. ${p.map(x => x.name).join(' and ')} influence your earnings.` : `Your values and approach to money are influenced by ${s}.`,
  3: (s, p) => p.length ? `Communication style reflects ${s}. ${p.map(x => x.name).join(' and ')} sharpen your mental abilities.` : `${s} here gives you a ${s.toLowerCase()} communication style.`,
  4: (s, p) => p.length ? `Home life shaped by ${s}. ${p.map(x => x.name).join(' and ')} influence your domestic environment.` : `${s} on the 4th house colors your home and emotional foundations.`,
  5: (s, p) => p.length ? `Creativity flows through ${s}. ${p.map(x => x.name).join(' and ')} boost your creative and romantic pursuits.` : `${s} influences your creative self-expression and romance.`,
  6: (s, p) => p.length ? `Work and health affected by ${s}. ${p.map(x => x.name).join(' and ')} indicate areas of focus.` : `${s} on the 6th shapes your daily routines and health.`,
  7: (s, p) => p.length ? `Relationships are ${s.toLowerCase()} in nature. ${p.map(x => x.name).join(' and ')} influence your partnerships.` : `${s} on the 7th house colors your approach to partnerships.`,
  8: (s, p) => p.length ? `Deep transformation through ${s}. ${p.map(x => x.name).join(' and ')} intensify this house.` : `${s} here indicates transformational experiences.`,
  9: (s, p) => p.length ? `Philosophy and luck shaped by ${s}. ${p.map(x => x.name).join(' and ')} expand your horizons.` : `${s} on the 9th influences your belief system and luck.`,
  10: (s, p) => p.length ? `Career driven by ${s}. ${p.map(x => x.name).join(' and ')} strongly influence your professional path.` : `${s} on the 10th shapes your career and public image.`,
  11: (s, p) => p.length ? `Social circles reflect ${s}. ${p.map(x => x.name).join(' and ')} bring gains through networks.` : `${s} on the 11th influences friendships and aspirations.`,
  12: (s, p) => p.length ? `Spirituality and solitude colored by ${s}. ${p.map(x => x.name).join(' and ')} here need conscious expression.` : `${s} on the 12th indicates how you find solitude.`
};

const PLANET_PREDICTIONS = {
  Sun: h => `Sun here strengthens your confidence in House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]} matters.`,
  Moon: h => `Moon here brings emotional sensitivity to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]} areas.`,
  Mars: h => `Mars gives drive and ambition to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]} matters.`,
  Mercury: h => `Mercury enhances intellect and communication in House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Jupiter: h => `Jupiter brings expansion and good fortune to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Venus: h => `Venus brings harmony, love, and beauty to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Saturn: h => `Saturn brings discipline and karmic lessons to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Rahu: h => `Rahu brings ambition and unexpected events to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Ketu: h => `Ketu brings spiritual detachment to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Uranus: h => `Uranus brings innovation and sudden changes to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Neptune: h => `Neptune brings dreams and intuition to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`,
  Pluto: h => `Pluto brings transformation and power to House ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][h-1]}.`
};

export default function KundliChart({ chart, compact }) {
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!chart || !chart.planets) return null;

  const planetsByHouse = {};
  Object.entries(chart.planets).forEach(([name, data]) => {
    const h = data.house || 1;
    if (!planetsByHouse[h]) planetsByHouse[h] = [];
    planetsByHouse[h].push({ name, ...data });
  });

  const houseSign = {};
  if (chart.houses) {
    Object.entries(chart.houses).forEach(([num, data]) => {
      houseSign[num] = data.sign;
    });
  }
  if (Object.keys(houseSign).length === 0 && chart.rising_sign) {
    const ascIdx = SIGN_NAMES.indexOf(chart.rising_sign);
    for (let i = 1; i <= 12; i++) {
      houseSign[i] = SIGN_NAMES[(ascIdx + i - 1) % 12];
    }
  }

  const ascIdx = SIGN_NAMES.indexOf(chart.rising_sign || 'Aries');
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

  const handleMouseEnter = (hNum, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest('[data-chart-container]')?.getBoundingClientRect() || rect;
    setTooltipPos({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8
    });
    setHoveredHouse(hNum);
  };

  const handleMouseLeave = () => setHoveredHouse(null);

  return (
    <div data-chart-container style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '3px',
        width: compact ? '240px' : 'min(420px, 100%)',
        aspectRatio: '1 / 1',
        position: 'relative'
      }}>
        {HOUSE_GRID.flat().map((hNum, idx) => {
          if (hNum === null) {
            if (idx === 5) {
              return (
                <div key="center" style={{
                  background: 'linear-gradient(145deg, rgba(108,92,231,0.25), rgba(162,155,254,0.08))',
                  borderRadius: '12px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid rgba(108,92,231,0.3)',
                  gridColumn: '2 / 4', gridRow: '2 / 4',
                  boxShadow: 'inset 0 0 30px rgba(108,92,231,0.05)'
                }}>
                  <div style={{fontSize:'9px', color:'rgba(255,255,255,0.35)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'2px', fontWeight:500}}>Lagna</div>
                  <div style={{fontSize:'24px', fontWeight:'bold', color:'#7C5CFC', lineHeight:1.1}}>
                    {SIGN_SYMBOLS_SHORT[chart.rising_sign] || '?'}
                  </div>
                  <div style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', fontWeight:500, marginTop:'2px'}}>
                    {chart.rising_sign || '-'}
                  </div>
                </div>
              );
            }
            return <div key={`c${idx}`} />;
          }

          const planets = planetsByHouse[hNum] || [];
          const sign = houseSign[hNum] || '?';
          const isAngular = [1,4,7,10].includes(hNum);
          const isSuccedent = [2,5,8,11].includes(hNum);

          return (
            <div
              key={`h${hNum}`}
              onMouseEnter={(e) => handleMouseEnter(hNum, e)}
              onMouseLeave={handleMouseLeave}
              style={{
                background: isAngular
                  ? 'linear-gradient(145deg, rgba(108,92,231,0.18), rgba(108,92,231,0.05))'
                  : isSuccedent
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
                border: isAngular
                  ? '1.5px solid rgba(108,92,231,0.4)'
                  : hoveredHouse === hNum
                    ? '1.5px solid rgba(124,92,252,0.5)'
                    : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: compact ? '3px' : '5px',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                cursor: 'pointer', transition: 'all 0.2s ease',
                transform: hoveredHouse === hNum ? 'scale(1.03)' : 'scale(1)',
                zIndex: hoveredHouse === hNum ? 2 : 1
              }}
            >
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                padding: '0 2px'
              }}>
                <span style={{
                  fontSize: compact ? '10px' : '12px',
                  color: isAngular ? 'rgba(108,92,231,0.7)' : 'rgba(255,255,255,0.2)',
                  fontWeight: 'bold', fontFamily: 'serif'
                }}>
                  {ROMAN[hNum-1]}
                </span>
                <span style={{
                  fontSize: compact ? '12px' : '16px',
                  color: 'rgba(255,255,255,0.15)',
                  lineHeight: 1
                }}>
                  {SIGN_SYMBOLS_SHORT[sign] || ''}
                </span>
              </div>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: compact ? '2px' : '4px'
              }}>
                <div style={{display:'flex', flexWrap:'wrap', gap: compact ? '1px' : '2px', justifyContent:'center'}}>
                  {planets.map(p => (
                    <span key={p.name} style={{
                      fontSize: compact ? '16px' : '22px', lineHeight: 1.1,
                      color: PLANET_COLORS[p.name] || '#fff',
                      textShadow: '0 0 8px rgba(0,0,0,0.7)',
                      transition: 'transform 0.15s, filter 0.15s',
                      filter: hoveredHouse === hNum ? 'brightness(1.3)' : 'none'
                    }}>
                      {PLANET_SYMBOLS[p.name] || p.name[0]}
                    </span>
                  ))}
                </div>
              </div>
              {!compact && planets.length > 0 && (
                <div style={{display:'flex', flexWrap:'wrap', gap:'1px', justifyContent:'center', marginTop:'auto', paddingTop:'1px'}}>
                  {planets.map(p => (
                    <span key={`l${p.name}`} style={{
                      fontSize:'7px', color: PLANET_COLORS[p.name] || 'rgba(255,255,255,0.3)',
                      opacity: 0.6
                    }}>
                      {p.degree?.toFixed(1)}°
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div style={{marginTop:'14px', display:'flex', gap:'6px 14px', flexWrap:'wrap', justifyContent:'center', maxWidth:'420px'}}>
          {Object.entries(PLANET_SYMBOLS).filter(([name]) => chart.planets[name]).map(([name, sym]) => (
            <span key={name} style={{fontSize:'12px', color: PLANET_COLORS[name] || '#ccc', display:'flex', alignItems:'center', gap:'4px'}}>
              <span style={{fontSize:'16px'}}>{sym}</span>
              <span style={{color:'rgba(255,255,255,0.55)'}}>{name}</span>
            </span>
          ))}
        </div>
      )}

      {hoveredHouse && houseSign[hoveredHouse] && (
        <div style={{
          position: 'absolute',
          top: tooltipPos.y,
          left: '50%',
          transform: 'translate(-50%, -100%)',
          background: 'rgba(20,15,40,0.97)',
          border: '1px solid rgba(108,92,231,0.4)',
          borderRadius: '12px',
          padding: '14px 18px',
          zIndex: 100,
          maxWidth: '340px',
          width: 'max-content',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none'
        }}>
          <div style={{fontSize:'13px', fontWeight:'bold', color:'#7C5CFC', marginBottom:'4px'}}>
            House {ROMAN[hoveredHouse-1]} — {houseSign[hoveredHouse]} ({HOUSE_NAMES[hoveredHouse-1]})
          </div>
          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', marginBottom:'8px'}}>
            Governs: {HOUSE_TOPICS[hoveredHouse-1]}
          </div>
          {(() => {
            const planets = planetsByHouse[hoveredHouse] || [];
            const sign = houseSign[hoveredHouse];
            const summary = HOUSE_SUMMARIES[hoveredHouse];
            const summaryText = summary ? summary(sign, planets) : '';
            return (
              <>
                <p style={{fontSize:'12px', color:'rgba(255,255,255,0.85)', lineHeight:'1.5', margin:'0 0 8px 0'}}>
                  {summaryText}
                </p>
                {planets.length > 0 && (
                  <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'8px'}}>
                    <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'1px'}}>Planets in this house</div>
                    {planets.map(p => (
                      <div key={p.name} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                        <span style={{fontSize:'16px', color: PLANET_COLORS[p.name], width:'20px', textAlign:'center'}}>
                          {PLANET_SYMBOLS[p.name]}
                        </span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'12px', color:'#fff', fontWeight:500}}>
                            {p.name} in {p.sign} {p.degree?.toFixed(1)}°
                          </div>
                          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.6)'}}>
                            {PLANET_PREDICTIONS[p.name] ? PLANET_PREDICTIONS[p.name](hoveredHouse) : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{fontSize:'10px', color:'rgba(255,255,255,0.25)', marginTop:'6px', fontStyle:'italic'}}>
                  {[1,4,7,10].includes(hoveredHouse) ? '★ Angular house — strongly active in your life' :
                   [2,5,8,11].includes(hoveredHouse) ? '◈ Succedent house — stabilizing influence' :
                   '○ Cadent house — adapting and learning'}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
