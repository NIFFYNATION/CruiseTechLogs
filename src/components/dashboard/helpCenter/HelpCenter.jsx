import React from "react";

const tutorials = [
  {
    title: "How to fund your wallet",
    url: "https://youtube.com/shorts/EwU0VnpjIAE?si=uGDbEn8zKhhIwRdI",
  },
  {
    title: "How to fund your wallet",
    url: "https://youtube.com/shorts/EwU0VnpjIAE?si=uGDbEn8zKhhIwRdI",
  },
  {
    title: "How to fund your wallet",
    url: "https://youtube.com/shorts/EwU0VnpjIAE?si=uGDbEn8zKhhIwRdI",
  },
  {
    title: "How to fund your wallet",
    url: "https://youtube.com/shorts/EwU0VnpjIAE?si=uGDbEn8zKhhIwRdI",
  },
];

const HelpCenter = () => (
  <div className="p-4 md:p-10">
    <h1 className="text-2xl font-bold text-text-primary mb-8">Help Center</h1>
    <div className="bg-white rounded-2xl shadow p-6 md:p-10 mx-auto border-b-4 border-quaternary">
      <h2 className="text-lg font-semibold mb-1">Tutorial Videos</h2>
      <p className="text-tertiary mb-8 text-sm">
        These links will take you to youtube to assist you properly
      </p>
      <ul className="space-y-7">
        {tutorials.map((item, idx) => (
          <li key={idx} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 bg-quaternary  flex items-center justify-center"
                style={{
                  display: "inline-flex",
                  minWidth: "20px",
                  minHeight: "20px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect width="14" height="14" rx="2" fill="none"/>
                  <path d="M4 7.5L6 9.5L10 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-semibold text-text-primary text-base">{item.title}</span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-quaternary text-sm break-all hover:underline ml-7"
            >
              {item.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default HelpCenter;
