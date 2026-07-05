import React, { useState } from 'react';
import { astrologyApi } from './api';
import { HI } from './hi';

function KPHorary({ language = 'en' }) {
  const [formData, setFormData] = useState({
    question: '',
    questionDate: new Date().toISOString().split('T')[0],
    questionTime: new Date().toTimeString().slice(0, 5),
    latitude: 28.6139,
    longitude: 77.2090,
    customPlaceName: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async () => {
    if (!formData.question || !formData.questionDate || !formData.questionTime) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await astrologyApi.getKPHorary(
        formData.question,
        formData.questionDate,
        formData.questionTime,
        formData.latitude,
        formData.longitude,
        language
      );
      setResult(data);
    } catch (err) {
      setError(language === 'hi' ? 'होररी चार्ट की गणना विफल' : 'Failed to calculate Horary Chart');
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
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3095 },
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
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

  const [locationSuggestions, setLocationSuggestions] = useState([]);

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

  const exampleQuestions = [
    "Will I get married this year?",
    "Should I change my job?",
    "Is this business profitable?",
    "Will I pass my exam?",
    "Should I buy this property?"
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{color: 'white'}}>{language === 'hi' ? HI.kpHorary : 'KP Horary Astrology'}</h2>
      <p style={styles.info}>{language === 'hi' ? 'कोई भी प्रश्न पूछें और कृष्णमूर्ति पद्धति पर आधारित उत्तर प्राप्त करें' : 'Ask any question and get answer based on Krishnamurti Paddhati system'}</p>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>{language === 'hi' ? HI.question : 'Your Question:'}</label>
        <input 
          type="text" 
          name="question" 
          value={formData.question} 
          onChange={handleChange} 
          placeholder="e.g., Will I get married this year?"
          style={styles.inputWide} 
        />
      </div>
      
      <div style={styles.exampleSection}>
        <p style={{color: 'white'}}>{language === 'hi' ? 'प्रयास करें:' : 'Try:'}</p>
        {exampleQuestions.map((q, idx) => (
          <button key={idx} onClick={() => setFormData({...formData, question: q})} style={styles.exampleBtn}>
            {q}
          </button>
        ))}
      </div>
      
      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={{color: 'white', marginRight: '10px'}}>{language === 'hi' ? 'प्रश्न तिथि' : 'Question Date:'}</label>
          <input type="date" name="questionDate" value={formData.questionDate} onChange={handleChange} style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={{color: 'white', marginRight: '10px'}}>{language === 'hi' ? 'प्रश्न समय' : 'Question Time:'}</label>
          <input type="time" name="questionTime" value={formData.questionTime} onChange={handleChange} style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={{color: 'white', marginRight: '10px'}}>{language === 'hi' ? 'स्थान' : 'Location:'}</label>
          <select onChange={handleCityChange} style={styles.input} value={customCity ? '__custom__' : (formData.latitude === 28.6139 ? 'Delhi' : formData.latitude === 19.0760 ? 'Mumbai' : '')}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
            <option value="__custom__">+ Add Custom Village/City</option>
          </select>
        </div>
      </div>
      
      {customCity && (
        <div style={{marginBottom: '15px', position: 'relative'}}>
          <input 
            type="text" 
            placeholder="Enter village/city name (3+ letters)"
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
      
      <button onClick={calculate} disabled={loading} style={styles.button}>
        {loading ? (language === 'hi' ? HI.kpHorary : 'Analyzing...') : `${language === 'hi' ? HI.answer : 'Get Answer'}`}
      </button>
      
      {error && <p style={styles.error}>{error}</p>}
      
      {result && (
        <div style={styles.result}>
          <h3>{language === 'hi' ? HI.kpHorary : 'Analysis Result'}</h3>
          
          <div style={styles.chartBox}>
            <h4>{language === 'hi' ? 'होररी चार्ट विवरण' : 'Horary Chart Details'}</h4>
            <p><strong>Question:</strong> {result.question}</p>
            <p><strong>Ascendant Sign:</strong> {result.ascendant_sign}</p>
            <p><strong>Ascendant Nakshatra:</strong> {result.ascendant_nakshatra}</p>
            <p><strong>Lord:</strong> {result.lord}</p>
            <p><strong>Sub Lord:</strong> {result.sub_lord}</p>
          </div>
          
          <div style={styles.answerBox}>
            <h4>{language === 'hi' ? HI.answer : 'Answer'}</h4>
            <p><strong>{language === 'hi' ? 'विषय' : 'Topic'}:</strong> {result.answer.topic}</p>
            <p><strong>{language === 'hi' ? 'मुख्य भाव' : 'Important House'}:</strong> {result.answer.key_house}</p>
            <p><strong>{language === 'hi' ? HI.significators : 'Significators'}:</strong> {result.answer.significators}</p>
            <p><strong>{language === 'hi' ? 'विश्लेषण' : 'Analysis'}:</strong> {result.answer.analysis}</p>
            <p style={styles.verdict}><strong>{language === 'hi' ? 'निर्णय' : 'Verdict'}:</strong> {result.answer.verdict}</p>
          </div>
          
          <div style={styles.chartDetails}>
            <h4>{language === 'hi' ? HI.planets : 'Planet Positions'}</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>{language === 'hi' ? HI.planet : 'Planet'}</th>
                  <th>{language === 'hi' ? HI.nakshatra : 'Nakshatra'}</th>
                  <th>{language === 'hi' ? HI.starLord : 'Lord'}</th>
                  <th>{language === 'hi' ? HI.subLord : 'Sub Lord'}</th>
                  <th>{language === 'hi' ? HI.degree : 'Degree'}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.chart).map(([planet, data]) => (
                  <tr key={planet}>
                    <td><strong>{planet}</strong></td>
                    <td>{data.nakshatra}</td>
                    <td>{data.lord}</td>
                    <td>{data.sub_lord}</td>
                    <td>{data.degree}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  info: { color: 'white' },
  inputGroup: { marginBottom: '15px', marginRight: '20px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'white', backgroundColor: '#2d3748' },
  inputWide: { padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc', color: 'white', backgroundColor: '#2d3748' },
  row: { display: 'flex', flexWrap: 'wrap', marginBottom: '15px' },
  button: { padding: '12px 30px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red' },
  result: { marginTop: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', color: '#333' },
  exampleSection: { marginBottom: '15px', color: 'white' },
  exampleBtn: { margin: '3px', padding: '5px 10px', backgroundColor: '#4a5568', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '12px', color: 'white' },
  chartBox: { padding: '15px', backgroundColor: '#2d3748', borderRadius: '8px', marginBottom: '15px', color: 'white' },
  answerBox: { padding: '15px', backgroundColor: '#2d3748', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #6c5ce7', color: 'white' },
  verdict: { fontSize: '16px', fontWeight: 'bold', color: '#6c5ce7', marginTop: '10px' },
  chartDetails: { marginTop: '15px', color: 'white' },
  table: { width: '100%', borderCollapse: 'collapse', color: 'white' }
};

export default KPHorary;