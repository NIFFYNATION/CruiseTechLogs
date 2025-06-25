import React from "react";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb9rsBW0LKZKBGTI940l" 
; // Replace with your actual channel link

const bannerWidth = 1100; // Adjust if your banner is wider/narrower

const WhatsAppBanner = () => (
  <div
    className="rounded-[20px] mt-6 p-6 py-10 bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-lg overflow-hidden relative group hidden md:block"
    style={{ minHeight: 128, maxWidth: bannerWidth, textDecoration: "none" }}
    tabIndex={0}
    aria-label="Join our WhatsApp Channel"
  >
    <div className="w-full h-full overflow-hidden relative" style={{ width: bannerWidth }}>
      <div
        className=" items-center gap-4 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        <div className="flex gap-4 items-center">
          <img
            src="/icons/whatsapp-white.svg"
            alt="WhatsApp"
            className="w-14 h-14"
          />
          <h3 className="text-white font-semibold text-lg mb-1 inline-block mr-4">Join our WhatsApp Channel.</h3>

        </div>
        <div className="flex-1 min-w-[300px]">
          <p className="text-white/80 text-sm mb-3 inline-block">
            Get instant updates, support, and exclusive offers directly on WhatsApp!
          </p>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-full bg-white text-[#128C7E] font-bold shadow transition hover:bg-[#e8f5e9] ml-2"
          >
            Join Now
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default WhatsAppBanner;
