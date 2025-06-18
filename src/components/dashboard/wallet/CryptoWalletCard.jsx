import React from "react";

const CryptoWalletCard = ({
  currency = "USDT",
  network = "bsc",
  address = "",
  url = "",
  qrSize = 150,
  onCopy,
}) => {
  const qrUrl = address
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(address)}`
    : "";

  return (
    <div className="bg-white rounded-xl shadow py-6 px-4 flex flex-col gap-4">
      <h4 className="font-semibold text-text-primary text-lg">Fund Wallet with Crypto</h4>
      <p className="text-sm md:text-base text-text-secondary mb-4">
        Please scan the QR code below or copy the wallet address to proceed with your transaction.
      </p>
      <div className="flex justify-between bg-bgLayout items-center gap-1 border border-[#D9D9D9] rounded-lg px-4 py-2 cursor-pointer">
        <div>
          <p className="text-xs font-semibold text-text-secondary">CURRENCY</p>
          <p className="font-semibold text-primary">{currency}</p>
        </div>
        <div className="flex items-center gap-3">
          {currency}
          <img src={`${currency == "USDT" ? 'https://cdn.simpleicons.org/tether' : `/icons/${currency.toLowerCase()}.svg`}`} alt={currency} className="w-5 h-5" />
          <span className="uppercase">{network}</span>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="relative bg-bgLayout rounded-lg p-2 ring-1 ring-[#D9D9D9]">
          {qrUrl && <img src={qrUrl} alt="QR Code" className="w-36 h-36" />}
          <img src={`${currency == "USDT" ? 'https://cdn.simpleicons.org/tether' : `/icons/${currency.toLowerCase()}.svg`}`} alt={currency} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full p-1 shadow" />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-primary underline text-xs"
        >
          Open in Crypto Payment Gateway
        </a>
      </div>
      <div className="flex justify-between items-center gap-2 bg-[#E8F0FE] rounded-lg px-4 py-3 mb-2">
        <div>
          <p className="text-xs font-medium text-primary rounded py-1">{currency} WALLET ADDRESS</p>
          <p className="font-mono text-sm font-semibold text-primary break-all">{address}</p>
        </div>
        <button
          className="ml-2"
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address);
              if (onCopy) onCopy(address);
            }
          }}
        >
          <img src="/icons/copy-bold-blue.svg" alt="Copy" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CryptoWalletCard;
