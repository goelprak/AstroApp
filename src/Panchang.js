import React, { useState } from 'react';
import { astrologyApi } from './api';

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Surat', 'Indore', 'Bhopal', 'Patna', 'Visakhapatnam', 'Coimbatore', 'Vadodara', 'Guwahati', 'Kanpur', 'Nagpur', 'Ludhiana', 'Bhubaneswar', 'Ranchi', 'Dehradun', 'Mysore', 'Jodhpur', 'Raipur', 'Faridabad', 'Gurgaon', 'Noida', 'Ghaziabad', 'Srinagar', 'Jammu', 'Panaji', 'Puducherry', 'Mangalore', 'Tirupathi', 'Madurai', 'Calicut', 'Ernakulam', 'Guntur', 'Warangal', 'Nellore'];

const cityCoords = {
  Delhi: { lat: 28.6139, lng: 77.2090 }, Mumbai: { lat: 19.0760, lng: 72.8777 }, Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 }, Kolkata: { lat: 22.5726, lng: 88.3639 }, Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 }, Ahmedabad: { lat: 23.0225, lng: 72.5714 }, Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 }, Chandigarh: { lat: 30.7333, lng: 76.7794 }, Surat: { lat: 21.1702, lng: 72.8311 },
  Indore: { lat: 22.7196, lng: 75.8579 }, Bhopal: { lat: 23.2599, lng: 77.4126 }, Patna: { lat: 25.5941, lng: 85.1376 },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185 }, Coimbatore: { lat: 11.0168, lng: 76.9558 }, Vadodara: { lat: 22.3072, lng: 73.1812 },
  Guwahati: { lat: 26.1445, lng: 91.7362 }, Kanpur: { lat: 26.4499, lng: 80.3319 }, Nagpur: { lat: 21.1458, lng: 79.0822 },
  Ludhiana: { lat: 30.9010, lng: 75.8573 }, Bhubaneswar: { lat: 20.2961, lng: 85.8245 }, Ranchi: { lat: 23.3441, lng: 85.3095 },
  Dehradun: { lat: 30.3165, lng: 78.0322 }, Mysore: { lat: 12.2958, lng: 76.6394 }, Jodhpur: { lat: 26.2389, lng: 73.0246 },
  Raipur: { lat: 21.2514, lng: 81.6297 }, Faridabad: { lat: 28.4089, lng: 77.3178 }, Gurgaon: { lat: 28.4595, lng: 77.0266 },
  Noida: { lat: 28.5721, lng: 77.3541 }, Ghaziabad: { lat: 28.6692, lng: 77.4538 }, Srinagar: { lat: 34.0833, lng: 74.7973 },
  Jammu: { lat: 32.7266, lng: 74.8570 }, Panaji: { lat: 15.4909, lng: 73.8278 }, Puducherry: { lat: 11.9416, lng: 79.8083 },
  Mangalore: { lat: 12.9141, lng: 74.8560 }, Tirupathi: { lat: 13.6500, lng: 79.4200 }, Madurai: { lat: 9.9252, lng: 78.1198 },
  Calicut: { lat: 11.2588, lng: 75.7804 }, Ernakulam: { lat: 9.9312, lng: 76.2673 }, Guntur: { lat: 16.2997, lng: 80.4427 },
  Warangal: { lat: 17.9784, lng: 79.5941 }, Nellore: { lat: 14.4426, lng: 79.9868 }
};

const Panchang = ({ onBack }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('Delhi');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async () => {
    setLoading(true);
    setError('');
    try {
      const coords = cityCoords[city] || { lat: 28.6139, lng: 77.2090 };
      const result = await astrologyApi.getPanchang(date, coords.lat, coords.lng);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load Panchang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div style={{display:'flex',alignItems:'center',marginBottom:16,gap:12}}>
        {onBack && <button onClick={onBack} className="btn btn-sm btn-ghost">← Back</button>}
        <h2 className="text-2xl font-bold text-white">📅 Daily Panchang</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 bg-gray-700 text-white rounded">
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button onClick={calculate} disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50">
        {loading ? 'Loading...' : '📅 Get Panchang'}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {data && !loading && (
        <div className="space-y-4 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-300">{data.date || date} | {data.city || city}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Tithi</h3>
              <p className="text-white font-bold">{data.tithi?.name}</p>
              <p className="text-gray-400 text-xs">{data.tithi?.start_time || ''} - {data.tithi?.end_time || ''}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Yoga</h3>
              <p className="text-white font-bold">{data.yoga?.name}</p>
              <p className="text-gray-400 text-xs">{data.yoga?.description}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Karana</h3>
              <p className="text-white font-bold">{data.karana?.name}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Sunrise / Sunset</h3>
              <p className="text-white">🌅 {data.sunrise || 'N/A'}</p>
              <p className="text-white">🌇 {data.sunset || 'N/A'}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Rahu Kaal</h3>
              <p className="text-red-400 font-bold">{typeof data.rahu_kaal === 'string' ? data.rahu_kaal : data.rahu_kaal?.start + ' - ' + data.rahu_kaal?.end || 'N/A'}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Abhijit Muhurat</h3>
              <p className="text-green-400 font-bold">{typeof data.abhijit_muhurat === 'string' ? data.abhijit_muhurat : data.abhijit_muhurat?.start + ' - ' + data.abhijit_muhurat?.end || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panchang;
