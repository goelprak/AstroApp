import React, { useState, useRef, useCallback } from 'react';
import NatalChart from './NatalChart';
import Horoscope from './Horoscope';
import WeeklyHoroscope from './WeeklyHoroscope';
import MonthlyHoroscope from './MonthlyHoroscope';
import Transits from './Transits';
import Compatibility from './Compatibility';
import KundliMatching from './KundliMatching';
import Numerology from './Numerology';
import DetailedAnalysis from './DetailedAnalysis';
import Tarot from './Tarot';
import Muhurat from './Muhurat';
import KPChart from './KPChart';
import KPDasha from './KPDasha';
import KPHorary from './KPHorary';
import Remedies from './Remedies';
import AIChat from './AIChat';
import YearlyPredictions from './YearlyPredictions';
import Panchang from './Panchang';
import WealthPrediction from './WealthPrediction';
import ForeignSettlement from './ForeignSettlement';
import FestivalCalendar from './FestivalCalendar';
import NameCorrection from './NameCorrection';
import LifeTimeline from './LifeTimeline';
import NavamsaChart from './NavamsaChart';
import PdfReport from './PdfReport';

const TABS = [
  { id:'profile', label:'Profile', icon:'👤' },
  { id:'ai', label:'AI Chat', icon:'🤖' },
  { id:'natal', label:'Natal', icon:'🧿' },
  { id:'analysis', label:'Analysis', icon:'📊' },
  { id:'numerology', label:'Numbers', icon:'🔢' },
  { id:'horoscope', label:'Daily', icon:'🌟' },
  { id:'weekly', label:'Weekly', icon:'📅' },
  { id:'monthly', label:'Monthly', icon:'📆' },
  { id:'yearly', label:'10-Yr', icon:'📈' },
  { id:'transits', label:'Transits', icon:'🪐' },
  { id:'tarot', label:'Tarot', icon:'🃏' },
  { id:'muhurat', label:'Muhurat', icon:'🕐' },
  { id:'compatibility', label:'Synastry', icon:'💕' },
  { id:'kundli', label:'Kundli', icon:'💍' },
  { id:'remedies', label:'Remedies', icon:'📿' },
  { id:'kpchart', label:'KP Chart', icon:'🔯' },
  { id:'kpdasha', label:'KP Dasha', icon:'⏳' },
  { id:'kphorary', label:'KP Horary', icon:'❓' },
  { id:'panchang', label:'Panchang', icon:'📅' },
  { id:'navamsa', label:'Navamsa (D9)', icon:'🔯' },
  { id:'wealth', label:'Wealth', icon:'💰' },
  { id:'foreign', label:'Foreign', icon:'🌍' },
  { id:'festivals', label:'Festivals', icon:'🎉' },
  { id:'namecorrection', label:'NameFix', icon:'✏️' },
  { id:'timeline', label:'Timeline', icon:'⏳' },
  { id:'pdfreport', label:'PDF', icon:'📄' }
];

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name:'', birthDate:'', birthTime:'', placeOfBirth:'', timezone:'Asia/Kolkata'
  });
  const [userSunSign, setUserSunSign] = useState('');
  const [location, setLocation] = useState({ lat:28.6139, lng:77.2090 });
  const [showForm, setShowForm] = useState(true);
  const [customLocation, setCustomLocation] = useState(false);
  const [customCoords, setCustomCoords] = useState({ lat:'', lng:'' });
  const [customPlaceName, setCustomPlaceName] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [tabContext, setTabContext] = useState({});

  const birthData = profile.birthDate ? {
    name: profile.name || 'User', birthDate: profile.birthDate, birthTime: profile.birthTime,
    latitude: location.lat, longitude: location.lng, timezone: profile.timezone
  } : null;

  const updateTabContext = (tid, d) => setTabContext(prev => ({ ...prev, [tid]: d }));

  const handleProfileChange = (e) => {
    if (e.target.name === 'placeOfBirth' && e.target.value === '__custom__') { setCustomLocation(true); return; }
    if (e.target.name === 'placeOfBirth' && e.target.value !== '__custom__') { setCustomLocation(false); setCustomPlaceName(''); }
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const searchTimer = useRef(null);
  const handleCustomCoordsChange = async (e) => {
    const pn = e.target.value; setCustomCoords({ ...customCoords, placeName:pn });
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (pn.length >= 2) {
      searchTimer.current = setTimeout(async () => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pn)}&limit=8&addressdetails=1&countrycodes=in`);
          setLocationSuggestions(await r.json() || []);
        } catch { setLocationSuggestions([]); }
      }, 400);
    } else { setLocationSuggestions([]); }
  };

  const selectLocation = (place) => {
    setCustomCoords({ lat:place.lat, lng:place.lon, placeName:place.display_name.split(',')[0] });
    setLocationSuggestions([]); setCustomPlaceName(place.display_name.split(',')[0]);
  };

  const saveProfile = () => {
    let finalLat = location.lat, finalLng = location.lng;
    if (customLocation && customCoords.lat && customCoords.lng) {
      finalLat = parseFloat(customCoords.lat); finalLng = parseFloat(customCoords.lng);
      setLocation({ lat:finalLat, lng:finalLng });
    }
    if (profile.birthDate && profile.birthTime) {
      setShowForm(false); setActiveTab('natal');
      const m = parseInt(profile.birthDate.split('-')[1]), d = parseInt(profile.birthDate.split('-')[2]);
      const si = (m-1)*2 + (d >= [20,19,21,20,21,21,23,23,23,23,22,21][m-1] ? 1 : 0);
      setUserSunSign(['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][si%12]);
      const place = (profile.placeOfBirth||'').toLowerCase();
      const cities = {
        delhi:{lat:28.6139,lng:77.2090}, mumbai:{lat:19.0760,lng:72.8777}, bangalore:{lat:12.9716,lng:77.5946},
        bengaluru:{lat:12.9716,lng:77.5946}, chennai:{lat:13.0827,lng:80.2707}, kolkata:{lat:22.5726,lng:88.3639},
        hyderabad:{lat:17.3850,lng:78.4867}, pune:{lat:18.5204,lng:73.8567}, ahmedabad:{lat:23.0225,lng:72.5714},
        jaipur:{lat:26.9124,lng:75.7873}, lucknow:{lat:26.8467,lng:80.9462}, chandigarh:{lat:30.7333,lng:76.7794},
        surat:{lat:21.1702,lng:72.8311}, indore:{lat:22.7196,lng:75.8579}, bhopal:{lat:23.2599,lng:77.4126},
        patna:{lat:25.5941,lng:85.1376}, visakhapatnam:{lat:17.6868,lng:83.2185}, coimbatore:{lat:11.0168,lng:76.9558},
        vadodara:{lat:22.3072,lng:73.1812}, guwahati:{lat:26.1445,lng:91.7362}, kanpur:{lat:26.4499,lng:80.3319},
        nagpur:{lat:21.1458,lng:79.0822}, ludhiana:{lat:30.9010,lng:75.8573}, bhubaneswar:{lat:20.2961,lng:85.8245},
        ranchi:{lat:23.3441,lng:85.3095}, dehradun:{lat:30.3165,lng:78.0322}, mysore:{lat:12.2958,lng:76.6394},
        jodhpur:{lat:26.2389,lng:73.0246}, raipur:{lat:21.2514,lng:81.6297}, faridabad:{lat:28.4089,lng:77.3178},
        gurgaon:{lat:28.4595,lng:77.0266}, noida:{lat:28.5721,lng:77.3541}, ghaziabad:{lat:28.6692,lng:77.4538},
        srinagar:{lat:34.0833,lng:74.7973}, jammu:{lat:32.7266,lng:74.8570}, panaji:{lat:15.4909,lng:73.8278},
        puducherry:{lat:11.9416,lng:79.8083}, mangalore:{lat:12.9141,lng:74.8560}, tirupathi:{lat:13.6500,lng:79.4200},
        madurai:{lat:9.9252,lng:78.1198}, calicut:{lat:11.2588,lng:75.7804}, ernakulam:{lat:9.9312,lng:76.2673},
        guntur:{lat:16.2997,lng:80.4427}, warangal:{lat:17.9784,lng:79.5941}, nellore:{lat:14.4426,lng:79.9868}
      };
      if (!customLocation) {
        for (const [city,coords] of Object.entries(cities)) { if (place.includes(city)) { setLocation(coords); break; } }
      }
    }
  };

  const renderTab = () => {
    const k = activeTab;
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-card animate-fade-up" key={k}>
            <h2>Your Birth Details</h2>
            <p className="text-sm text-muted mb-4">Enter your birth information to get personalized readings</p>
            <div className="space-y-4">
              <div><label>Your Name</label><input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Enter your name" /></div>
              <div><label>Date of Birth *</label><input type="date" name="birthDate" value={profile.birthDate} onChange={handleProfileChange} required /></div>
              <div className="grid grid-2">
                <div>
                  <label>Place of Birth</label>
                  <select name="placeOfBirth" value={profile.placeOfBirth} onChange={handleProfileChange}>
                    <option value="">Select City</option>
                    {['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow','Chandigarh','Surat','Indore','Bhopal','Patna','Visakhapatnam','Coimbatore','Vadodara','Guwahati','Kanpur','Nagpur','Ludhiana','Bhubaneswar','Ranchi','Dehradun','Mysore','Jodhpur','Raipur','Faridabad','Gurgaon','Noida','Ghaziabad','Srinagar','Jammu','Panaji','Puducherry','Mangalore','Tirupathi','Madurai','Calicut','Ernakulam','Guntur','Warangal','Nellore'].map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="__custom__">+ Add Custom (Anywhere)</option>
                  </select>
                  {customLocation && (
                    <div style={{marginTop:8,position:'relative'}}>
                      <input type="text" name="placeName" placeholder="Search village/city..." value={customCoords.placeName||''} onChange={handleCustomCoordsChange} autoComplete="off" />
                      {locationSuggestions.length > 0 && (
                        <div style={{position:'absolute',top:'100%',left:0,width:'100%',maxHeight:200,overflowY:'auto',background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,zIndex:1000}}>
                          {locationSuggestions.map((p,i) => (
                            <div key={i} onClick={() => selectLocation(p)} style={{padding:'10px 12px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13,color:'#fff'}}
                              onMouseOver={e => e.target.style.background='rgba(124,92,252,0.15)'} onMouseOut={e => e.target.style.background='transparent'}>
                              <strong>{p.name || p.address?.city || p.address?.town || p.address?.village || 'Unknown'}</strong>
                              <div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>{p.address?.state}, {p.address?.country}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {customCoords.lat && customCoords.lng && !locationSuggestions.length && customCoords.placeName && <p className="text-sm" style={{color:'var(--primary-light)',marginTop:4}}>✓ Location found</p>}
                    </div>
                  )}
                </div>
                <div><label>Time of Birth *</label><input type="time" name="birthTime" value={profile.birthTime} onChange={handleProfileChange} required /></div>
              </div>
              <div><label>Timezone</label>
                <select name="timezone" value={profile.timezone} onChange={handleProfileChange}>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Singapore">Singapore (SGT)</option>
                  <option value="Asia/Bangkok">Bangkok (ICT)</option>
                  <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                  <option value="Asia/Tokyo">Japan (JST)</option>
                  <option value="Europe/London">UK (GMT)</option>
                  <option value="Europe/Paris">Europe (CET)</option>
                  <option value="America/New_York">USA Eastern (EST)</option>
                  <option value="America/Los_Angeles">USA Pacific (PST)</option>
                </select>
              </div>
              <button className="btn btn-primary btn-block" onClick={saveProfile} disabled={!profile.birthDate||!profile.birthTime}>Save & Continue</button>
            </div>
          </div>
        );
      case 'natal': return <div className="animate-fade-up" key={k}><NatalChart birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'analysis': return <div className="animate-fade-up" key={k}><DetailedAnalysis birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} onUpdateContext={d => updateTabContext('detailed_analysis',d)} birthData={birthData} /></div>;
      case 'numerology': return <div className="animate-fade-up" key={k}><Numerology name={profile.name} birthDate={profile.birthDate} onUpdateContext={d => updateTabContext('numerology',d)} birthData={birthData} /></div>;
      case 'ai': return <div className="animate-fade-up" key={k}><AIChat name={profile.name} birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} tabContext={tabContext} /></div>;
      case 'horoscope': return <div className="animate-fade-up" key={k}><Horoscope sign={userSunSign} onUpdateContext={d => updateTabContext('horoscope',d)} birthData={birthData} /></div>;
      case 'weekly': return <div className="animate-fade-up" key={k}><WeeklyHoroscope userSign={userSunSign} onUpdateContext={d => updateTabContext('weekly',d)} birthData={birthData} /></div>;
      case 'monthly': return <div className="animate-fade-up" key={k}><MonthlyHoroscope userSign={userSunSign} onUpdateContext={d => updateTabContext('monthly',d)} birthData={birthData} /></div>;
      case 'yearly': return <div className="animate-fade-up" key={k}><YearlyPredictions birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} onUpdateContext={d => updateTabContext('yearly',d)} birthData={birthData} /></div>;
      case 'transits': return <div className="animate-fade-up" key={k}><Transits latitude={location.lat} longitude={location.lng} /></div>;
      case 'tarot': return <div className="animate-fade-up" key={k}><Tarot onUpdateContext={d => updateTabContext('tarot',d)} birthData={birthData} /></div>;
      case 'muhurat': return <div className="animate-fade-up" key={k}><Muhurat /></div>;
      case 'compatibility': return <div className="animate-fade-up" key={k}><Compatibility profile={profile} location={location} /></div>;
      case 'kundli': return <div className="animate-fade-up" key={k}><KundliMatching profile={profile} location={location} /></div>;
      case 'remedies': return <div className="animate-fade-up" key={k}><Remedies birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'kpchart': return <div className="animate-fade-up" key={k}><KPChart birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'kpdasha': return <div className="animate-fade-up" key={k}><KPDasha birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} onBack={() => setActiveTab('profile')} /></div>;
      case 'kphorary': return <div className="animate-fade-up" key={k}><KPHorary /></div>;
      case 'panchang': return <div className="animate-fade-up" key={k}><Panchang onBack={() => setActiveTab('profile')} /></div>;
      case 'navamsa': return <div className="animate-fade-up" key={k}><NavamsaChart birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'wealth': return <div className="animate-fade-up" key={k}><WealthPrediction birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'foreign': return <div className="animate-fade-up" key={k}><ForeignSettlement birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'festivals': return <div className="animate-fade-up" key={k}><FestivalCalendar /></div>;
      case 'namecorrection': return <div className="animate-fade-up" key={k}><NameCorrection /></div>;
      case 'timeline': return <div className="animate-fade-up" key={k}><LifeTimeline birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} /></div>;
      case 'pdfreport': return <div className="animate-fade-up" key={k}><PdfReport birthDate={profile.birthDate} birthTime={profile.birthTime} latitude={location.lat} longitude={location.lng} timezone={profile.timezone} name={profile.name} /></div>;
      default: return null;
    }
  };

  return (
    <div className="app">
      {/* Sidebar - desktop */}
      <div className="sidebar">
        <h2>✦ Astrology</h2>
        <div style={{display:'flex',flexDirection:'column',gap:2,flex:1,overflowY:'auto'}}>
          {TABS.map(t => (
            <button key={t.id} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        {profile.name && <div className="profile-badge" style={{margin:'8px',justifyContent:'center'}}>👤 {profile.name}</div>}
      </div>

      {/* Header - mobile */}
      <div className="app-header">
        <h1>✦ Astrology</h1>
        <div className="sub">
          {profile.name ? <span>👤 {profile.name}</span> : <span>Discover the cosmos</span>}
          {profile.placeOfBirth && <span style={{marginLeft:6}}>📍 {profile.placeOfBirth.split(',')[0]}</span>}
        </div>
        {!profile.birthDate && (
          <button className="btn btn-sm btn-ghost" onClick={() => setActiveTab('profile')} style={{fontSize:11}}>Setup</button>
        )}
      </div>

      {/* Content */}
      <div className="app-main">
        {renderTab()}
      </div>

      {/* Bottom Nav - mobile */}
      <div className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
