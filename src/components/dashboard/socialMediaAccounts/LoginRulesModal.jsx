import React from "react";

const LoginRulesModal = ({ open, onClose, platform }) => {
  if (!open) return null;

  
  const rules = {
    facebook: [
      "USE VPN (NOT PIA)",
      "Login with mbasic.facebook.com on chrome incognito if your vpn/device is not strong enough to avoid approval",
      "Please do not start usage on an account you just bought immediately, don't use marketplace or rush to add friends or edit immediately. Let the acct soak on your ip for few hrs (24hrs is okay) before you do that.",
      "SECURE YOUR ACCT, at least 24hrs after login (not immediately, to avoid it being locked)",
      "Check for other logged-in devices and log them out.",
      "Change your authentication key some hours you log in.",
      "Secure the email attached to your account.",
      "If you can't log in to the attached email, create a new one and change it in settings on Facebook.",
      "PLEASE adhere to instructions, No GUARANTEE for REPLACEMENT or REFUND if an account gets locked, suspended or disabled after login.",
      "We don't REFUND after an account is used.",
      "How it last depends on you or the social platform, thanks.",
    ],
    instagram: [
      "USE VPN (NOT PIA)",
      "Login with mbasic.facebook.com on chrome incognito if your vpn/device is not strong enough to avoid approval",
      "Please do not start usage on an account you just bought immediately, don't use marketplace or rush to add friends or edit immediately. Let the acct soak on your ip for few hrs (24hrs is okay) before you do that.",
      "SECURE YOUR ACCT, at least 24hrs after login (not immediately, to avoid it being locked)",
      "Check for other logged-in devices and log them out.",
    ],
    twitter: [
      "USE VPN (NOT PIA)",
      "Login with mbasic.facebook.com on chrome incognito if your vpn/device is not strong enough to avoid approval",
      "Please do not start usage on an account you just bought immediately, don't use marketplace or rush to add friends or edit immediately. Let the acct soak on your ip for few hrs (24hrs is okay) before you do that.",
      "SECURE YOUR ACCT, at least 24hrs after login (not immediately, to avoid it being locked)",
      "Check for other logged-in devices and log them out.",
    ],
    // Add other platforms here as needed
  };

  const platformKey = platform?.toLowerCase() || "facebook";
  const platformRules = rules[platformKey] || rules.facebook;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Header */}
        <div className="bg-bgLayout flex items-center justify-between px-6 pt-6 pb-2 border-b border-border-grey">
          <h2 className="text-lg font-semibold">{platform ? `${platform} Login Rules` : "Login Rules"}</h2>
          <button
            className="text-2xl text-tertiary hover:text-quinary"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Rules List */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-4">
            {platformRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 text-quinary">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <rect width="20" height="20" rx="4" fill="#FA5A15" />
                    <path d="M6 10.5l2 2 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm text-text-primary">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginRulesModal;
