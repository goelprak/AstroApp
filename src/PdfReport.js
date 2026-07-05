import React, { useState } from 'react';
import { astrologyApi } from './api';

const PdfReport = ({ birthDate, birthTime, latitude, longitude, timezone, name }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await astrologyApi.getPdfReport(birthDate, birthTime, latitude, longitude, timezone, name);
      if (result.pages) setPages(result.pages);
      if (result.base64) {
        const byteChars = atob(result.base64);
        const byteNums = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNums[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNums);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `astrology_report_${name || 'user'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">📄 PDF Report</h2>

      <p className="text-gray-400 mb-6">Generate a comprehensive PDF report of your astrological analysis.</p>

      <button onClick={generateReport} disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-lg font-bold disabled:opacity-50 text-lg">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Report...
          </span>
        ) : '📄 Download Your Report (PDF)'}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {pages && !loading && (
        <div className="bg-green-900 p-4 rounded-lg mt-4 text-center">
          <p className="text-green-300">✅ Report generated successfully!</p>
          <p className="text-green-400 text-sm mt-1">{pages} pages</p>
        </div>
      )}
    </div>
  );
};

export default PdfReport;
