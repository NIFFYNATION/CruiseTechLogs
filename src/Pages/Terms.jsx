import React, { useEffect, useState } from 'react';
import { fetchTermsContent } from '../services/generalService';
import parse from 'html-react-parser';
import he from 'he';
import { Link, useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const html = await fetchTermsContent();
      if (html) {
        setContent(he.decode(html));
      } else {
        setError('Failed to load terms and conditions');
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-black mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 bg-black text-white rounded-xl font-bold mb-5">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span className="text-sm font-bold">Back</span>
        </button>
        <h1 className="text-3xl font-black mb-6 mt-6">Terms and Conditions</h1>
        <div className="prose max-w-none">
          {parse(content)}
        </div>
      </div>
    </div>
  );
};

export default Terms;
