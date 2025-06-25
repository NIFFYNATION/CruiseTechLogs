import React, { useState, useEffect } from "react";
import { fetchHelpContent } from "../../../services/generalService";
import { linkifyHtml } from '../../../utils/formatUtils';
import parse from 'html-react-parser';
import he from 'he';

const HelpCenter = () => {
  const [helpContent, setHelpContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpContent().then((data) => {
      setHelpContent(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-10">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Help Center</h1>
        <div className="bg-white rounded-2xl shadow p-6 md:p-10 mx-auto border-b-4 border-quaternary">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
            <div className="aspect-video bg-gray-200 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!helpContent) {
    return (
      <div className="p-4 md:p-10 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Help Center</h1>
        <p>Could not load help content. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl font-bold text-text-primary mb-8">
        {helpContent.title || "Help Center"}
      </h1>
      <div className="bg-white rounded-2xl shadow p-6 md:p-10 mx-auto border-b-4 border-quaternary">
        <div className="prose max-w-none">
          {parse(he.decode(linkifyHtml(helpContent.description, 'text-primary')))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
