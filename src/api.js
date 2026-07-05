const API_BASE = process.env.REACT_APP_API_URL || 'https://astrologyapp-pz4b.onrender.com';

export const astrologyApi = {
  getNatalChart: async (birthDate, birthTime, latitude, longitude, timezone = 'UTC', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/natal-chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to calculate natal chart');
    return response.json();
  },

  getDetailedAnalysis: async (birthDate, birthTime, latitude, longitude, timezone = 'UTC', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/detailed-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get detailed analysis');
    return response.json();
  },

  getHoroscope: async (sign, date = null, language = 'en') => {
    const params = new URLSearchParams({ sign, language });
    if (date) params.append('date', date);
    const response = await fetch(`${API_BASE}/api/astrology/horoscope/${sign}?${params}`);
    if (!response.ok) throw new Error('Failed to get horoscope');
    return response.json();
  },

  getWeeklyHoroscope: async (sign, weekStart = null, language = 'en') => {
    const params = new URLSearchParams({ sign, language });
    if (weekStart) params.append('week_start', weekStart);
    const response = await fetch(`${API_BASE}/api/astrology/weekly-horoscope/${sign}?${params}`);
    if (!response.ok) throw new Error('Failed to get weekly horoscope');
    return response.json();
  },

  getMonthlyHoroscope: async (sign, year = null, month = null, language = 'en') => {
    const params = new URLSearchParams({ sign, language });
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    const response = await fetch(`${API_BASE}/api/astrology/monthly-horoscope/${sign}?${params}`);
    if (!response.ok) throw new Error('Failed to get monthly horoscope');
    return response.json();
  },

  getTransits: async (date, latitude, longitude, language = 'en') => {
    const params = new URLSearchParams({ date, latitude, longitude, language });
    const response = await fetch(`${API_BASE}/api/astrology/transits?${params}`);
    if (!response.ok) throw new Error('Failed to get transits');
    return response.json();
  },

  getCompatibility: async (chart1, chart2, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart1, chart2, language })
    });
    if (!response.ok) throw new Error('Failed to calculate compatibility');
    return response.json();
  },

  getKundliMatching: async (chart1, chart2, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/kundli-matching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart1, chart2, language })
    });
    if (!response.ok) throw new Error('Failed to calculate kundli matching');
    return response.json();
  },

  getNumerology: async (name, birthDate, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/numerology`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, birth_date: birthDate, language })
    });
    if (!response.ok) throw new Error('Failed to calculate numerology');
    return response.json();
  },

  getTarot: async (count = 3, question = "", language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/tarot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, question, language })
    });
    if (!response.ok) throw new Error('Failed to draw tarot cards');
    return response.json();
  },

  getMuhurat: async (date, city = "Delhi", language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/muhurat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, city, language })
    });
    if (!response.ok) throw new Error('Failed to calculate muhurat');
    return response.json();
  },

  getKPChart: async (birthDate, birthTime, latitude, longitude, timezone = 'UTC', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/kp-chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to calculate KP chart');
    return response.json();
  },

  getKPDasha: async (birthDate, birthTime, latitude, longitude, timezone = 'UTC', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/kp-dasha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to calculate KP Dasha');
    return response.json();
  },

  getKPHorary: async (question, questionDate, questionTime, latitude, longitude, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/kp-horary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, question_date: questionDate, question_time: questionTime, latitude, longitude, language })
    });
    if (!response.ok) throw new Error('Failed to calculate KP Horary');
    return response.json();
  },

  getYearlyPredictions: async (birthDate, birthTime, latitude, longitude, timezone, years = 10, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/yearly-predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, years, language })
    });
    if (!response.ok) throw new Error('Failed to get yearly predictions');
    return response.json();
  },

  aiChat: async (message, birthData = null, tabContext = null, language = 'en') => {
    const body = { message, birth_data: birthData, language };
    if (tabContext && Object.keys(tabContext).length > 0) body.tab_context = tabContext;
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Failed to get AI response');
    return response.json();
  },

  getPanchang: async (date, latitude = 28.6139, longitude = 77.209, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/panchang`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, latitude, longitude, language })
    });
    if (!response.ok) throw new Error('Failed to get panchang');
    return response.json();
  },

  getWealthPrediction: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/wealth-prediction`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get wealth prediction');
    return response.json();
  },

  getForeignSettlement: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/foreign-settlement`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get foreign settlement analysis');
    return response.json();
  },

  getManglik: async (chart1, chart2 = null, language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/check-manglik`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart1, chart2, language })
    });
    if (!response.ok) throw new Error('Failed to check Manglik');
    return response.json();
  },

  getNavamsaChart: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/navamsa-chart`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get Navamsa chart');
    return response.json();
  },

  getNameCorrection: async (name, birthDate = '', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/name-correction`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, birth_date: birthDate, language })
    });
    if (!response.ok) throw new Error('Failed to get name correction');
    return response.json();
  },

  getRemediesDetailed: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/remedies-detailed`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get detailed remedies');
    return response.json();
  },

  getLifeTimeline: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/life-timeline`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to get life timeline');
    return response.json();
  },

  getPdfReport: async (birthDate, birthTime, latitude, longitude, timezone = 'Asia/Kolkata', language = 'en') => {
    const response = await fetch(`${API_BASE}/api/astrology/pdf-report`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, latitude, longitude, timezone, language })
    });
    if (!response.ok) throw new Error('Failed to generate PDF report');
    return response.json();
  }
};

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'North Node', 'Chiron'
];

export const ELEMENTS = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

export const SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  'North Node': '☊', Chiron: '⚷'
};

export const SIGN_SYMBOLS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};