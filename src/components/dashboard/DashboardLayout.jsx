import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../../controllers/userController';
import { fetchLiveChatWidget } from '../../services/generalService';
import parse from 'html-react-parser';
import he from 'he';
import { FaTelegramPlane, FaComments, FaTimes } from 'react-icons/fa';

const TELEGRAM_CHAT_URL = 'https://t.me/cruisetechsupport';

const DashboardLayout = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const [liveChatWidget, setLiveChatWidget] = useState(null);
    const [showChatPanel, setShowChatPanel] = useState(false);
  
    useEffect(() => {
      if (!isUserLoggedIn()) {
        navigate('/login');
      } else {
        setIsAuthorized(true);
      }
    }, [navigate]);
  
    useEffect(() => {
      fetchLiveChatWidget().then(setLiveChatWidget);
    }, []);

    // Control live chat widget visibility
    useEffect(() => {
      const chatway = document.querySelector('.button__NbFWA');
      if (chatway) {
        chatway.style.setProperty('display', showChatPanel ? 'block' : 'none', 'important');
      }
    }, [showChatPanel]);

    // Optionally, always hide on mount
    useEffect(() => {
      const chatway = document.querySelector('.button__NbFWA');
      if (chatway) chatway.style.display = 'none';
    }, []);
  
    if (!isAuthorized) {
      return null;
    }

    return (
      <SidebarProvider>
        <div className="flex justify-center min-h-screen">
          <Sidebar />
          <main className="flex-1 mt-16 transition-all duration-300 ml-0 lg:ml-8 pl-[8px] sm:pl-[30px] md:pl-[60px] xl:pl-[260px] p-2 sm:p-10">
            <DashboardHeader />
            <Outlet />
          </main>
        </div>
        {/* Style for chatway widget trigger */}
        <style>{`.button__NbFWA { bottom: 120px !important;  display: none !important; zoom: 0.7; } .live-chat-container { margin-bottom: 170px;} .live-chat-toggle{ margin-bottom: 60px;}`}</style>
        {/* Animation styles for chat panel */}
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s cubic-bezier(0.4,0,0.2,1); }
        `}</style>
        {/* Floating Chat Toggle and Panel */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end z-60 live-chat-container">
          {/* Chat Panel (shows Telegram and live chat) */}
          {showChatPanel && (
            <div className="mb-3 flex flex-col gap-3 items-end animate-fade-in-up">
              {/* Telegram Button */}
              <a
                href={TELEGRAM_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#229ED9] hover:bg-[#1b8ab8] text-white rounded-full shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-xl border border-white/30 text-sm md:text-base"
                style={{ fontSize: '1rem', minWidth: '0', maxWidth: '100%', boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)' }}
              >
                <FaTelegramPlane className="text-base md:text-xl" />
                <span className="font-semibold">Chat us</span>
              </a>
              {/* Live Chat Widget Trigger (if present) */}
              {/* No need to render anything for live chat, just control its visibility */}
            </div>
          )}
          {/* Toggle Button */}
          <button
            className={
              `flex items-center justify-center rounded-full shadow-2xl bg-primary/80 hover:bg-primary text-white border border-primary/30 transition-all duration-200 focus:outline-none backdrop-blur-xl z-90 live-chat-toggle`
              + ' ' +
              'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl fixed bottom-4 right-4 md:bottom-6 md:right-6'
            }
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
            onClick={() => setShowChatPanel((v) => !v)}
            aria-label={showChatPanel ? 'Close chat options' : 'Open chat options'}
          >
            {showChatPanel ? <FaTimes /> : <FaComments />}
          </button>
          {/* Live Chat Widget (remains in DOM for functionality) */}
          {liveChatWidget && (
            <>{parse(he.decode(liveChatWidget))}</>
          )}
        </div>
        
      </SidebarProvider>
    );
};

export default DashboardLayout;

/*
Add this to your global CSS for animation:
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.3s ease; }
*/ 