import React, { useState, useEffect } from 'react';
import { astrologyApi } from './api';

function KPChart() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    customPlaceName: ''
  });
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async () => {
    if (!formData.birthDate || !formData.birthTime) {
      setError('Please enter birth date and time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await astrologyApi.getKPChart(
        formData.birthDate,
        formData.birthTime,
        formData.latitude,
        formData.longitude,
        formData.timezone
      );
      setChart(data);
    } catch (err) {
      setError('Failed to calculate KP Chart');
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
    { name: 'Cuttack', lat: 20.4625, lng: 85.8828 },
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3095 },
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
    { name: 'Jamshedpur', lat: 22.8267, lng: 86.2042 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0246 },
    { name: 'Kota', lat: 25.1500, lng: 75.8500 },
    { name: 'Raipur', lat: 21.2514, lng: 81.6297 },
    { name: 'Durgapur', lat: 23.5204, lng: 87.3219 },
    { name: 'Asansol', lat: 23.6867, lng: 86.9744 },
    { name: 'Siliguri', lat: 26.7111, lng: 88.4321 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7045 },
    { name: 'Salem', lat: 11.6643, lng: 78.1463 },
    { name: 'Tirunelveli', lat: 8.7286, lng: 77.7052 },
    { name: 'Ambala', lat: 30.3752, lng: 76.7719 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
    { name: 'Noida', lat: 28.5721, lng: 77.3541 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0822 },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3213 },
    { name: 'Solapur', lat: 17.6599, lng: 75.9060 },
    { name: 'Bhiwandi', lat: 19.3002, lng: 73.0587 },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433 },
    { name: 'Nashik', lat: 20.0054, lng: 73.7920 },
    { name: 'Aligarh', lat: 27.8791, lng: 78.0810 },
    { name: 'Meerut', lat: 28.9845, lng: 77.7080 },
    { name: 'Bareilly', lat: 28.3470, lng: 79.4217 },
    { name: 'Moradabad', lat: 28.8388, lng: 78.7736 },
    { name: 'Srinagar', lat: 34.0833, lng: 74.7973 },
    { name: 'Jammu', lat: 32.7266, lng: 74.8570 },
    { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
    { name: 'Leh', lat: 34.1526, lng: 77.5761 },
    { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    { name: 'Margao', lat: 15.2993, lng: 74.1240 },
    { name: 'Vasco', lat: 15.3909, lng: 73.8270 },
    { name: 'Puducherry', lat: 11.9416, lng: 79.8083 },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
    { name: 'Belgaum', lat: 15.8497, lng: 74.4978 },
    { name: 'Bellary', lat: 15.1394, lng: 76.9214 },
    { name: 'Tumkur', lat: 13.3400, lng: 77.1000 },
    { name: 'Hubli', lat: 15.3647, lng: 75.1249 },
    { name: 'Davanagere', lat: 14.4644, lng: 75.9216 },
    { name: 'Hassan', lat: 13.0019, lng: 76.0949 },
    { name: 'Udupi', lat: 13.3409, lng: 74.7428 },
    { name: 'Manipal', lat: 13.3411, lng: 74.7429 },
    { name: 'Kolar Gold Fields', lat: 12.9500, lng: 78.2800 },
    { name: 'Tirupathi', lat: 13.6500, lng: 79.4200 },
    { name: 'Kanchipuram', lat: 12.8341, lng: 79.6987 },
    { name: 'Madhavaram', lat: 13.1500, lng: 80.2800 },
    { name: 'Trivandrum', lat: 8.5241, lng: 76.9366 },
    { name: 'Kollam', lat: 8.8932, lng: 76.5831 },
    { name: 'Calicut', lat: 11.2588, lng: 75.7804 },
    { name: 'Palakkad', lat: 10.7867, lng: 76.6558 },
    { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
    { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
    { name: 'Ernakulam', lat: 9.9312, lng: 76.2673 },
    { name: 'Alappuzha', lat: 9.4981, lng: 76.3388 },
    { name: 'Kottayam', lat: 9.5916, lng: 76.5222 },
    { name: 'Guntur', lat: 16.2997, lng: 80.4427 },
    { name: 'Warangal', lat: 17.9784, lng: 79.5941 },
    { name: 'Nellore', lat: 14.4426, lng: 79.9868 },
    { name: 'Rajahmundry', lat: 16.9878, lng: 81.6952 },
    { name: 'Kakinada', lat: 16.9437, lng: 82.2604 },
    { name: 'Tirupati', lat: 13.6288, lng: 79.4191 },
    { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
    { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
    { name: 'Chittoor', lat: 13.4162, lng: 79.1325 },
    { name: 'Eluru', lat: 16.7107, lng: 81.1107 },
    { name: 'Bhimavaram', lat: 16.5428, lng: 81.5320 },
    { name: 'Tenali', lat: 16.2403, lng: 80.6466 },
    { name: 'Srikakulam', lat: 18.2969, lng: 83.8927 },
    { name: 'Vizianagaram', lat: 18.1182, lng: 83.4155 },
    { name: 'Kadapa', lat: 14.4674, lng: 78.8242 },
    { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
    { name: 'Proddatur', lat: 14.7302, lng: 78.5520 },
    { name: 'Hindupur', lat: 13.8309, lng: 77.4934 },
    { name: 'Kadiri', lat: 14.1114, lng: 78.1665 }
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

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{color: 'white'}}>KP (Krishnamurti Paddhati) Chart</h2>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>Birth Date:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={styles.input} />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>Birth Time:</label>
        <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} style={styles.input} />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={{color: 'white', marginRight: '10px'}}>City:</label>
        <select onChange={handleCityChange} style={styles.input} value={customCity ? '__custom__' : (formData.latitude === 28.6139 ? 'Delhi' : formData.latitude === 19.0760 ? 'Mumbai' : '')}>
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
        {loading ? 'Calculating...' : 'Get KP Chart'}
      </button>
      
      {error && <p style={styles.error}>{error}</p>}
      
      {chart && (
        <div style={styles.result}>
          <h3>KP Chart Results</h3>
          <p><strong>Birth Date:</strong> {chart.birth_date} | <strong>Time:</strong> {chart.birth_time}</p>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Planet</th>
                <th>Nakshatra</th>
                <th>Lord</th>
                <th>Sub Lord</th>
                <th>Pada</th>
                <th>Degree</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(chart.planets).map(([planet, data]) => (
                <tr key={planet}>
                  <td><strong>{planet}</strong></td>
                  <td>{data.nakshatra}</td>
                  <td>{data.lord}</td>
                  <td>{data.sub_lord}</td>
                  <td>{data.pada}</td>
                  <td>{data.degree}°</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {chart.significators && (
            <div style={styles.section}>
              <h4>Significators</h4>
              {Object.entries(chart.significators).map(([planet, sig]) => (
                <div key={planet} style={styles.sigBox}>
                  <strong>{planet}</strong> - {sig.sign} | Nakshatra: {sig.nakshatra_lord}
                  <br />
                  <small>Significators: {sig.significators.join(', ')}</small>
                </div>
              ))}
            </div>
          )}
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
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', color: '#333' },
  section: { marginTop: '20px', color: '#333' },
  sigBox: { padding: '10px', margin: '5px 0', backgroundColor: '#e8e8e8', borderRadius: '4px', color: '#333' }
};

export default KPChart;