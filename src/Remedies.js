import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';

function Remedies({ birthDate, birthTime, latitude, longitude, timezone }) {
  const [formData, setFormData] = useState({
    birthDate: birthDate || '',
    birthTime: birthTime || '',
    latitude: latitude || 28.6139,
    longitude: longitude || 77.2090,
    timezone: timezone || 'Asia/Kolkata',
    customPlaceName: ''
  });
  const [remedies, setRemedies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateRemedies = async () => {
    if (!formData.birthDate || !formData.birthTime) {
      setError('Please enter birth date and time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const chart = await astrologyApi.getNatalChart(
        formData.birthDate,
        formData.birthTime,
        formData.latitude,
        formData.longitude,
        formData.timezone
      );
      
      const dasha = await astrologyApi.getKPDasha(
        formData.birthDate,
        formData.birthTime,
        formData.latitude,
        formData.longitude,
        formData.timezone
      );
      
      const result = generateRemedies(chart, dasha);
      setRemedies(result);
    } catch (err) {
      setError('Failed to calculate remedies');
    }
    setLoading(false);
  };

  const generateRemedies = (chart, dasha) => {
    const sunSign = chart.sun_sign || 'Aries';
    const moonSign = chart.moon_sign || 'Aries';
    const currentDasha = dasha?.current_dasha || 'Unknown';
    
    const gemstoneRecommendations = {
      'Sun': { gem: 'Ruby', metal: 'Gold', color: 'Red', planet: 'Sun' },
      'Moon': { gem: 'Pearl', metal: 'Silver', color: 'White', planet: 'Moon' },
      'Mars': { gem: 'Red Coral', metal: 'Copper', color: 'Red', planet: 'Mars' },
      'Mercury': { gem: 'Emerald', metal: 'Gold', color: 'Green', planet: 'Mercury' },
      'Jupiter': { gem: 'Yellow Sapphire', metal: 'Gold', color: 'Yellow', planet: 'Jupiter' },
      'Venus': { gem: 'Diamond', metal: 'Platinum', color: 'White', planet: 'Venus' },
      'Saturn': { gem: 'Blue Sapphire', metal: 'Iron', color: 'Blue', planet: 'Saturn' },
      'Rahu': { gem: 'Hessonite', metal: 'Gold', color: 'Orange', planet: 'Rahu' },
      'Ketu': { gem: 'Cat\'s Eye', metal: 'Copper', color: 'Green', planet: 'Ketu' }
    };

    const mantras = {
      'Sun': { mantra: 'Om Suryaya Namah', count: '108 times daily', time: 'Sunrise' },
      'Moon': { mantra: 'Om Chandraya Namah', count: '108 times daily', time: 'Evening' },
      'Mars': { mantra: 'Om Mangalaya Namah', count: '108 times daily', time: 'Tuesday' },
      'Mercury': { mantra: 'Om Budhaya Namah', count: '108 times daily', time: 'Wednesday' },
      'Jupiter': { mantra: 'Om Brihaspataye Namah', count: '108 times daily', time: 'Thursday' },
      'Venus': { mantra: 'Om Shukraya Namah', count: '108 times daily', time: 'Friday' },
      'Saturn': { mantra: 'Om Shanaya Namah', count: '108 times daily', time: 'Saturday' },
      'Rahu': { mantra: 'Om Rahave Namah', count: '108 times daily', time: 'Saturday' },
      'Ketu': { mantra: 'Om Ketave Namah', count: '108 times daily', time: 'Tuesday' }
    };

    const weakPlanets = [];
    const strongPlanets = [];
    
    if (chart.planets) {
      Object.entries(chart.planets).forEach(([planet, data]) => {
        const strength = data.strength || data.dignity?.toLowerCase() || '';
        if (strength.includes('exalted') || strength.includes('own') || strength.includes('strong')) {
          strongPlanets.push(planet);
        } else if (strength.includes('debilitated') || strength.includes('weak') || strength.includes('fallen')) {
          weakPlanets.push(planet);
        }
      });
    }

    const gemstone = weakPlanets.length > 0 ? gemstoneRecommendations[weakPlanets[0]] : gemstoneRecommendations['Jupiter'];
    const mantra = weakPlanets.length > 0 ? mantras[weakPlanets[0]] : mantras['Jupiter'];

    const doshas = [];
    if (moonSign === 'Scorpio' || moonSign === 'Capricorn') {
      doshas.push({ name: 'Sdosha', remedy: 'Donate jaggery on Saturday', severity: 'Medium' });
    }
    if (sunSign === 'Aries' || sunSign === 'Leo') {
      doshas.push({ name: 'Pitta Dosha', remedy: 'Avoid spicy food, donate ghee', severity: 'Low' });
    }
    if (moonSign === 'Taurus' || moonSign === 'Virgo') {
      doshas.push({ name: 'Kapha Dosha', remedy: 'Wake up early, avoid dairy', severity: 'Low' });
    }

    return {
      sun_sign: sunSign,
      moon_sign: moonSign,
      current_dasha: currentDasha,
      gemstone: gemstone,
      mantra: mantra,
      weak_planets: weakPlanets.length > 0 ? weakPlanets : ['Jupiter (for general)'],
      strong_planets: strongPlanets.length > 0 ? strongPlanets : ['Sun, Moon'],
      doshas: doshas.length > 0 ? doshas : [{ name: 'No major doshas detected', remedy: 'Maintain balance', severity: 'None' }],
      general_remedies: [
        'Chant Om Namah Shivaya daily',
        'Donate on Saturdays',
        'Light ghee lamp on Thursdays',
        'Wear white on Mondays',
        'Avoid non-vegetarian food during festivals'
      ],
      deity_recommendations: [
        { deity: 'Lord Shiva', purpose: 'Overall protection', timing: 'Morning' },
        { deity: 'Goddess Lakshmi', purpose: 'Wealth & prosperity', timing: 'Friday' },
        { deity: 'Lord Hanuman', purpose: 'Courage & strength', timing: 'Tuesday' },
        { deity: 'Lord Ganesha', purpose: 'Remove obstacles', timing: 'Sunday' },
        { deity: 'Lord Krishna', purpose: 'Peace & happiness', timing: 'Evening' }
      ]
    };
  };

  const [customCity, setCustomCity] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

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
        const data = await response.json();
        setLocationSuggestions(data || []);
      } catch (err) {
        setLocationSuggestions([]);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const selectLocation = (place) => {
    setFormData({ 
      ...formData, 
      latitude: parseFloat(place.lat), 
      longitude: parseFloat(place.lon),
      customPlaceName: place.display_name.split(',')[0]
    });
    setLocationSuggestions([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{color: 'white'}}>🔮 Astrological Remedies</h2>
      <p style={{color: '#ccc', marginBottom: '20px'}}>Get personalized gemstone, mantra, and dosha remedies based on your birth chart</p>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>Birth Date:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} style={styles.input} />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>Birth Time:</label>
        <input type="time" name="birthTime" value={formData.birthTime} onChange={(e) => setFormData({...formData, birthTime: e.target.value})} style={styles.input} />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>City:</label>
        <select onChange={handleCityChange} style={styles.input} value={customCity ? '__custom__' : ''}>
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
          <option value="__custom__">+ Add Custom Village/City</option>
        </select>
      </div>
      
      {customCity && (
        <div style={{marginBottom: '15px', position: 'relative'}}>
          <input 
            type="text" 
            placeholder="Enter village/city name (2+ letters)"
            value={formData.customPlaceName || ''}
            onChange={handleCustomCityChange}
            style={{...styles.input, width: '300px'}}
            autoComplete="off"
          />
          {locationSuggestions.length > 0 && (
            <div style={{
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              width: '300px', 
              maxHeight: '200px', 
              overflowY: 'auto',
              backgroundColor: 'white', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {locationSuggestions.map((place, idx) => (
                <div 
                  key={idx}
                  onClick={() => selectLocation(place)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    fontSize: '13px',
                    color: '#333'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <strong>{place.name || place.address?.city || place.address?.town || place.address?.village || 'Unknown'}</strong>
                  <div style={{color: '#666', fontSize: '11px'}}>
                    {place.address?.state}, {place.address?.country}
                  </div>
                </div>
              ))}
            </div>
          )}
          {formData.latitude && formData.longitude && !locationSuggestions.length && formData.customPlaceName && (
            <span style={{marginLeft: '10px', color: '#6c5ce7'}}>✓ Found: {formData.customPlaceName}</span>
          )}
        </div>
      )}
      
      <button onClick={calculateRemedies} disabled={loading} style={styles.button}>
        {loading ? 'Calculating...' : 'Get Remedies'}
      </button>
      
      {error && <p style={styles.error}>{error}</p>}
      
      {remedies && (
        <div style={styles.result}>
          <h3>📿 Your Personalized Remedies</h3>
          
          <div style={styles.section}>
            <h4>💎 Recommended Gemstone</h4>
            <div style={styles.gemBox}>
              <p><strong>Gemstone:</strong> {remedies.gemstone.gem}</p>
              <p><strong>Metal:</strong> {remedies.gemstone.metal}</p>
              <p><strong>Color:</strong> {remedies.gemstone.color}</p>
              <p><strong>Planet:</strong> {remedies.gemstone.planet}</p>
              <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>Wear in gold/silver ring on the correct finger after consulting an astrologer</p>
            </div>
          </div>
          
          <div style={styles.section}>
            <h4>🕉️ Recommended Mantra</h4>
            <div style={styles.mantraBox}>
              <p><strong>Mantra:</strong> {remedies.mantra.mantra}</p>
              <p><strong>Count:</strong> {remedies.mantra.count}</p>
              <p><strong>Best Time:</strong> {remedies.mantra.time}</p>
            </div>
          </div>
          
          <div style={styles.section}>
            <h4>🌟 Planet Status</h4>
            <p><strong>Weak Planets (need remedy):</strong> {remedies.weak_planets.join(', ')}</p>
            <p><strong>Strong Planets:</strong> {remedies.strong_planets.join(', ')}</p>
          </div>
          
          <div style={styles.section}>
            <h4>🩺 Dosha Analysis</h4>
            {remedies.doshas.map((dosha, idx) => (
              <div key={idx} style={styles.doshaBox}>
                <p><strong>{dosha.name}</strong> - {dosha.severity}</p>
                <p>Remedy: {dosha.remedy}</p>
              </div>
            ))}
          </div>
          
          <div style={styles.section}>
            <h4>🛕 Recommended Deities</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Deity</th>
                  <th>Purpose</th>
                  <th>Best Time</th>
                </tr>
              </thead>
              <tbody>
                {remedies.deity_recommendations.map((deity, idx) => (
                  <tr key={idx}>
                    <td>{deity.deity}</td>
                    <td>{deity.purpose}</td>
                    <td>{deity.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={styles.section}>
            <h4>✨ General Remedies</h4>
            <ul style={{paddingLeft: '20px'}}>
              {remedies.general_remedies.map((rem, idx) => (
                <li key={idx} style={{marginBottom: '5px'}}>{rem}</li>
              ))}
            </ul>
          </div>
          
          <div style={styles.disclaimer}>
            <p><strong>Disclaimer:</strong> These remedies are general recommendations. Please consult a qualified astrologer for personalized guidance. Gemstones should be worn after proper energized process.</p>
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
  section: { marginTop: '20px' },
  gemBox: { padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' },
  mantraBox: { padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' },
  doshaBox: { padding: '10px', backgroundColor: '#fce4ec', borderRadius: '4px', marginBottom: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  disclaimer: { marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '12px' }
};

export default Remedies;