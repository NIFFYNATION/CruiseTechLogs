import React, { useEffect, useState } from 'react';
import { fetchLiveChatWidget } from '../../services/generalService';
import parse from 'html-react-parser';
import he from 'he';
import { FaTelegramPlane } from 'react-icons/fa';

const TELEGRAM_CHAT_URL = 'https://t.me/cruisetechsupport';

const LiveChatWidget = ({ 
  customContainerClass = '' 
}) => {
    const [liveChatWidget, setLiveChatWidget] = useState(null);
  
    useEffect(() => {
      fetchLiveChatWidget().then(setLiveChatWidget);
    }, []);
  
    return (
      <>
        {/* Telegram Floating Button */}
        {/* <a
          href={TELEGRAM_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed z-[9000] flex items-center justify-center rounded-full shadow-2xl bg-[#229ED9] hover:bg-[#1b8ab8] text-white transition-all duration-200 ${customContainerClass}`}
          style={{ 
            bottom: '100px', 
            right: '24px', 
            width: '48px',
            height: '48px',
            boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.15)' 
          }}
          title="Chat on Telegram"
        >
          <FaTelegramPlane className="text-2xl" />
        </a> */}

        {/* Live Chat Widget Injection - Displays normally as per 3rd party script */}
        {liveChatWidget && (
            <div>
                {parse(he.decode(liveChatWidget))}
            </div>
        )}
      </>
    );
};

export default LiveChatWidget;
