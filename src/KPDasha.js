import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';

function KPDasha({ birthDate: propBirthDate, birthTime: propBirthTime, latitude: propLat, longitude: propLng, timezone: propTz, onBack }) {
  const [formData, setFormData] = useState({
    birthDate: propBirthDate || '',
    birthTime: propBirthTime || '',
    latitude: propLat || 28.6139,
    longitude: propLng || 77.2090,
    timezone: propTz || 'Asia/Kolkata',
    customPlaceName: ''
  });
  const [dasha, setDasha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propBirthDate && propBirthTime && (!formData.birthDate || formData.birthDate !== propBirthDate)) {
      setFormData(prev => ({
        ...prev,
        birthDate: propBirthDate,
        birthTime: propBirthTime,
        latitude: propLat || 28.6139,
        longitude: propLng || 77.2090,
        timezone: propTz || 'Asia/Kolkata'
      }));
    }
  }, [propBirthDate, propBirthTime, propLat, propLng, propTz]);

  useEffect(() => {
    if (propBirthDate && propBirthTime) {
      calculate();
    }
  }, []);

  const calculate = async () => {
    if (!formData.birthDate || !formData.birthTime) {
      setError('Please enter birth date and time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await astrologyApi.getKPDasha(
        formData.birthDate,
        formData.birthTime,
        formData.latitude,
        formData.longitude,
        formData.timezone
      );
      setDasha(data);
    } catch (err) {
      setError('Failed to calculate KP Dasha');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Indore', lat: 22.7196, lng: 75.8579 },
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
    { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0822 },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    { name: 'Cochin', lat: 9.9312, lng: 76.2673 },
    { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3095 },
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0246 },
    { name: 'Raipur', lat: 21.2514, lng: 81.6297 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
    { name: 'Noida', lat: 28.5721, lng: 77.3541 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Srinagar', lat: 34.0833, lng: 74.7973 },
    { name: 'Jammu', lat: 32.7266, lng: 74.8570 },
    { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    { name: 'Puducherry', lat: 11.9416, lng: 79.8083 },
    { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
    { name: 'Tirupathi', lat: 13.6500, lng: 79.4200 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Calicut', lat: 11.2588, lng: 75.7804 },
    { name: 'Ernakulam', lat: 9.9312, lng: 76.2673 },
    { name: 'Guntur', lat: 16.2997, lng: 80.4427 },
    { name: 'Warangal', lat: 17.9784, lng: 79.5941 },
    { name: 'Nellore', lat: 14.4426, lng: 79.9868 }
  ];

  const [customCity, setCustomCity] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const handleCityChange = (e) => {
    if (e.target.value === '__custom__') {
      setCustomCity(true);
      return;
    }
    setCustomCity(false);
    const city = cities.find(c => c.name === e.target.value);
    if (city) {
      setFormData({ ...formData, latitude: city.lat, longitude: city.lng });
    }
  };

  const handleCustomCityChange = async (e) => {
    const placeName = e.target.value;
    setFormData({ ...formData, customPlaceName: placeName });
    if (placeName.length >= 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=8&addressdetails=1&countrycodes=in`);
        const json = await response.json();
        setLocationSuggestions(json || []);
      } catch { setLocationSuggestions([]); }
    } else { setLocationSuggestions([]); }
  };

  const selectLocation = (place) => {
    setFormData({ ...formData, latitude: parseFloat(place.lat), longitude: parseFloat(place.lon), customPlaceName: place.display_name.split(',')[0] });
    setLocationSuggestions([]);
  };

  const dashaMeanings = {
    'Ketu': { effect: 'Spiritual growth, detachment, liberation', career: 'Research, spirituality, healing, academia. Let go of ego-driven ambitions.', love: 'Relationships may feel karmic. Focus on inner connection rather than outward romance.', finance: 'Avoid major investments. Financial detachment can lead to spiritual gains.', health: 'Pay attention to mental health. Meditation and solitude are healing.' },
    'Venus': { effect: 'Love, luxury, creativity, pleasure', career: 'Careers in arts, fashion, beauty, finance, diplomacy. Excellent for negotiations and partnerships.', love: 'Strong romantic period. Marriage, new relationships, and deepening bonds are favored.', finance: 'Financial gains through creative pursuits and social connections. Favorable for luxury investments.', health: 'Good vitality. Focus on reproductive health and skin care.' },
    'Sun': { effect: 'Power, authority, recognition, leadership', career: 'Leadership roles, recognition, authority positions. Your confidence and visibility increase.', love: 'Confident in relationships but may dominate. Balance assertiveness with tenderness.', finance: 'Favorable for career-based income. Government or authority-linked gains.', health: 'Focus on heart health, eyesight, and vitality. Avoid overexertion.' },
    'Moon': { effect: 'Emotions, family, intuition', career: 'Careers in counseling, hospitality, caregiving, real estate. Emotional intelligence is your asset.', love: 'Emotional sensitivity heightens. Nurturing relationships and family bonds are highlighted.', finance: 'Fluctuating income. Real estate and family-related investments favored.', health: 'Digestive health, water retention, mood swings. Emotional wellbeing affects physical health.' },
    'Mars': { effect: 'Energy, action, courage, ambition', career: 'Leadership, entrepreneurship, sports, engineering, military. Bold initiatives succeed.', love: 'Passionate but potentially combative. Channel intensity constructively.', finance: 'Aggressive investments may pay off but carry risk. Avoid impulsive spending.', health: 'High energy but prone to accidents, inflammation, injuries. Channel aggression through exercise.' },
    'Rahu': { effect: 'Material success, ambition, foreign connections', career: 'Technology, foreign business, research, unconventional fields. Sudden opportunities arise.', love: 'Unconventional relationships. May attract foreign or different-background partners.', finance: 'Sudden gains through speculation or foreign sources. Verify all deals carefully.', health: 'Stress-related issues, skin problems, unusual ailments. Avoid overindulgence.' },
    'Jupiter': { effect: 'Wisdom, expansion, good fortune', career: 'Teaching, publishing, law, spirituality, international business. Growth and recognition.', love: 'Harmonious relationships. Marriage and family expansion favored.', finance: 'Expansion and abundance. Good for investments in education, property, and long-term growth.', health: 'Good health overall. Watch for weight gain, liver issues, and blood sugar.' },
    'Saturn': { effect: 'Discipline, challenges, karmic lessons', career: 'Slow but steady progress. Engineering, management, real estate, government. Hard work pays off.', love: 'Delays in relationships. Long-term commitments are serious. Older partners may appear.', finance: 'Conservative approach required. Avoid speculation. Long-term savings build steadily.', health: 'Bones, joints, teeth, knees need attention. Chronic issues require disciplined care.' },
    'Mercury': { effect: 'Intelligence, communication, business', career: 'Writing, technology, consulting, media, trading. Communication skills drive success.', love: 'Intellectual connection is key. Communicate openly. Short travels with partner favored.', finance: 'Business and trading gains. Good period for learning about investments.', health: 'Nervous system, digestion, skin. Mental stimulation supports wellbeing.' }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{display:'flex',alignItems:'center',marginBottom:16,gap:12}}>
        {onBack && <button onClick={onBack} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.2)',color:'#fff',padding:'6px 14px',borderRadius:6,cursor:'pointer'}}>← Back</button>}
        <h2 style={{color:'white',margin:0}}>KP Vimshottari Dasha</h2>
      </div>

      <div style={styles.inputGroup}>
        <label style={{color:'white',marginRight:'10px'}}>Birth Date:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={styles.input} />
      </div>
      <div style={styles.inputGroup}>
        <label style={{color:'white',marginRight:'10px'}}>Birth Time:</label>
        <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} style={styles.input} />
      </div>
      <div style={styles.inputGroup}>
        <label style={{color:'white',marginRight:'10px'}}>City:</label>
        <select onChange={handleCityChange} style={styles.input} value={customCity ? '__custom__' : (cities.find(c => c.lat === formData.latitude && c.lng === formData.longitude)?.name || '__custom__')}>
          <option value="">Select City</option>
          {cities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
          <option value="__custom__">+ Add Custom Village/City</option>
        </select>
      </div>
      {customCity && (
        <div style={{marginBottom:'15px',position:'relative'}}>
          <input type="text" placeholder="Enter village/city name" value={formData.customPlaceName || ''} onChange={handleCustomCityChange} style={{...styles.input,width:'300px'}} autoComplete="off" />
          {locationSuggestions.length > 0 && (
            <div style={{position:'absolute',top:'100%',left:0,width:'300px',maxHeight:'200px',overflowY:'auto',backgroundColor:'white',border:'1px solid #ccc',borderRadius:'4px',zIndex:1000,boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
              {locationSuggestions.map((place, idx) => (
                <div key={idx} onClick={() => selectLocation(place)} style={{padding:'10px',cursor:'pointer',borderBottom:'1px solid #eee',fontSize:'13px',color:'#333'}} onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'} onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
                  <strong>{place.name || place.address?.city || place.address?.town || place.address?.village || 'Unknown'}</strong>
                  <div style={{color:'#666',fontSize:'11px'}}>{place.address?.state}, {place.address?.country}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={calculate} disabled={loading} style={styles.button}>
        {loading ? 'Calculating...' : 'Get Vimshottari Dasha'}
      </button>
      {error && <p style={styles.error}>{error}</p>}

      {dasha && (
        <div style={styles.result}>
          <h3>Vimshottari Dasha Predictions</h3>
          <p><strong>Birth Date:</strong> {dasha.birth_date}</p>
          <p><strong>Moon Nakshatra:</strong> {dasha.moon_nakshatra} (Lord: {dasha.moon_nakshatra_lord})</p>
          <p><strong>Current Mahadasha:</strong> {dasha.current_dasha}</p>

          {dasha.current_dasha && dashaMeanings[dasha.current_dasha] && (
            <div style={styles.predictionBox}>
              <h4 style={{color:'#6c5ce7',marginBottom:12}}>🔮 {dasha.current_dasha} Mahadasha Predictions</h4>
              <p style={{marginBottom:8}}><strong>Overall Energy:</strong> {dashaMeanings[dasha.current_dasha].effect}</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
                <div style={styles.predCard}><strong>💼 Career</strong><p>{dashaMeanings[dasha.current_dasha].career}</p></div>
                <div style={styles.predCard}><strong>❤️ Love</strong><p>{dashaMeanings[dasha.current_dasha].love}</p></div>
                <div style={styles.predCard}><strong>💰 Finance</strong><p>{dashaMeanings[dasha.current_dasha].finance}</p></div>
                <div style={styles.predCard}><strong>🏥 Health</strong><p>{dashaMeanings[dasha.current_dasha].health}</p></div>
              </div>
            </div>
          )}

          <p style={styles.message}>{dasha.message}</p>

          <h4>Mahadasha Timeline</h4>
          <div style={styles.dashaGrid}>
            {dasha.dasha_sequence && dasha.dasha_sequence.map((mahadasha, idx) => (
              <div key={idx} style={{...styles.dashaCard, ...(mahadasha.mahadasha === dasha.current_dasha ? styles.activeDasha : {})}}>
                <h5>{mahadasha.mahadasha}</h5>
                <p>Total: {mahadasha.years} years</p>
                <p>Remaining: {mahadasha.remaining} years</p>
                <h6>Sub Periods:</h6>
                <div style={styles.subPeriods}>
                  {mahadasha.sub_periods && mahadasha.sub_periods.slice(0, 5).map((sub, subIdx) => (
                    <span key={subIdx} style={{...styles.subBadge, ...(sub.planet === dasha.current_sub?.planet ? {backgroundColor:'#6c5ce7',color:'white'} : {})}}>{sub.planet} ({sub.remaining}y)</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  inputGroup: { marginBottom: '15px' },
  input: { padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'white', backgroundColor: '#2d3748' },
  button: { padding: '10px 20px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red' },
  result: { marginTop: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', color: '#333' },
  message: { fontStyle: 'italic', color: '#333', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '4px', marginTop: 12 },
  dashaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' },
  dashaCard: { padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd', color: '#333' },
  activeDasha: { border: '2px solid #6c5ce7', backgroundColor: '#f0eeff', color: '#333' },
  subPeriods: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' },
  subBadge: { padding: '3px 8px', backgroundColor: '#e0e0e0', borderRadius: '10px', fontSize: '12px', color: '#333' },
  predictionBox: { marginTop: '20px', padding: '20px', backgroundColor: '#f8f0ff', borderRadius: '8px', borderLeft: '4px solid #6c5ce7' },
  predCard: { padding: '12px', backgroundColor: 'white', borderRadius: '6px', fontSize: '13px', lineHeight: '1.5' }
};

export default KPDasha;
