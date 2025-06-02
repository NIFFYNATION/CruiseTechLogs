import React, { useState } from "react";
import { FiSearch, FiBookmark } from "react-icons/fi";
import CountrySelectModal from "../buyNumbers/CountrySelectModal";
import CountryFlag from "react-country-flag";
import NumberTypeSelectModal from "./NumberTypeSelectModal";
import BuyNumberModal from "./BuyNumberModal";

// Dummy data for services
const services = [
  { name: "WhatsApp", icon: "/icons/whatsapp.svg", price: "₦1,200.14" },
  { name: "Instagram", icon: "/icons/instagram.svg", price: "₦1,200.14" },
  { name: "Amazon/ AWS", icon: "/icons/amazon.svg", price: "₦1,200.14" },
  { name: "Twitter", icon: "/icons/twitter.svg", price: "₦1,200.14" },
  { name: "Google", icon: "/icons/google.svg", price: "₦1,200.14" },
  { name: "TikTok", icon: "/icons/tiktok.svg", price: "₦1,200.14" },
  { name: "PayPal", icon: "/icons/paypal.svg", price: "₦1,200.14" },
  { name: "WhatsApp", icon: "/icons/whatsapp.svg", price: "₦1,200.14" },
  { name: "WhatsApp", icon: "/icons/whatsapp.svg", price: "₦1,200.14" },
];

const BuyNumbers = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Accounts");
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "+1",
    value: "US",
  });
  const [numberTypeModalOpen, setNumberTypeModalOpen] = useState(false);
  const [selectedNumberType, setSelectedNumberType] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuyClick = (service) => {
    setSelectedService(service);
    setBuyModalOpen(true);
  };

  const handleBuyNumber = () => {
    // Implement your buy logic here
    setBuyModalOpen(false);
    // Optionally show a success message or redirect
  };

  return (
    <div className="p-2 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Buy Number</h2>
        <p className="text-text-secondary font-semibold mb-1 text-sm md:text-base">
          Get phone number to receive OTP for <span className="text-quinary font-semibold">short term</span> or <span className="text-quinary font-semibold">long term</span> use.
        </p>
        <p className="text-text-secondary font-semibold text-sm md:text-base">
          You will receive an instant refund if you do not receive OTP.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <button
          className="flex-1 flex items-center justify-between bg-white border border-border-grey rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base"
          onClick={() => setCountryModalOpen(true)}
        >
            <div className="flex items-center gap-2">
            {selectedCountry?.value && (
              <CountryFlag
                countryCode={selectedCountry.value}
                svg
                className="mr-2"
                style={{ borderRadius: "4px", width: "24px", height: "24px" }}
              />
            )}
            
            <div className="items-center">
              <h3 className="font-medium">
                {selectedCountry.name} {selectedCountry.code && `(${selectedCountry.code})`}
              </h3>
              <p className="text-xs text-text-grey">(up to 200 countries)</p>
            </div>
          </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button>
        <button
          className="flex-1 flex items-center justify-between bg-white border border-border-grey rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base"
          onClick={() => setNumberTypeModalOpen(true)}
        >
          <div className="flex items-center gap-2">
            <img
              src="/icons/hourglass-low.svg"
              alt="Short Term"
              className="w-6 h-6 mr-2"
            />
            <div className="items-center">
              <h3 className="font-medium">
                {selectedNumberType?.label || "Short Term Number 1 (USA)"}
              </h3>
              <p className={`text-xs ${selectedNumberType?.duration ? "text-quinary" : "text-text-grey"}`}>
                {selectedNumberType?.duration
                  ? `(${selectedNumberType.duration})`
                  : "(Up to 10 - 25 minutes)"}
              </p>
            </div>
          </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-between bg-white border border-border-grey  rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base">
           <div className="flex items-center gap-2">
           <img src="/icons/hourglass-full.svg" alt="USA" className="w-6 h-6 mr-2" />
          <div className="items-center">
            <h3 className="font-medium">Long Term Number 1 (USA)</h3>
            <p className="text-xs text-text-grey">(Up to 30 Days)</p>
          </div>
           </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button>
       
      </div>

      {/* Main Card */}
      <div className="bg-background rounded-lg  p-4 md:p-8">
        {/* Search and View Rented Numbers */}
        
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-grey" size={20} />
            <input
              type="text"
              placeholder="Search Service"
              className="w-full font-semibold border border-border-grey rounded-sm pl-10 pr-4 py-2.5 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
         
      

        {/* Title */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
       <h3 className="text-lg font-semibold my-8">Short Term Number 1 (USA)</h3>
        <button className="bg-quinary hover:bg-quaternary text-background rounded-full px-6 py-2.5 font-semibold transition-colors">
            View Rented Numbers
          </button>
       </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-border-grey my-6">
          <button
            className={`py-2 px-4 font-semibold transition border-b-3 ${
              activeTab === "All Accounts"
                ? "border-primary text-primary"
                : "border-transparent text-[#A0A0A0]"
            }`}
            onClick={() => setActiveTab("All Accounts")}
          >
            All Accounts
          </button>
          <button
            className={`py-2 px-4 font-semibold transition border-b-3 ${
              activeTab === "Saved Accounts"
                ? "border-border-primary text-primary"
                : "border-transparent text-text-grey"
            }`}
            onClick={() => setActiveTab("Saved Accounts")}
          >
            Saved Accounts
          </button>
        </div>

        {/* Notice */}
        <div className="hidden md:flex justify-between items-center bg-quaternary-light rounded-lg px-4 py-3 my-8">
         <div className="grid md:flex gap-2 items-center">
         <span className="font-bold">
            Note that the price are not fixed.
          </span>
          <button className="border border-quinary text-quinary rounded-full px-4 py-1 font-semibold mx-2">
            Update Price
          </button>
         </div>
          <button className="text-xl text-[#FF6B00] font-bold px-2">
            <img src="/icons/cancel-outline.svg" alt="cancel" />
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center bg-white rounded-xl shadow-sm px-4 py-4 mb-2 border-b-1 border-[#FFDE59] relative"
              style={{ boxShadow: "0 2px 8px 0 rgba(255, 107, 0, 0.09)" }}
            >
              <img src={service.icon} alt={service.name} className="w-8 h-8 mr-4" />
              <div className="flex-1">
                <div className="font-semibold">{service.name}</div>
                <h3 className="text-primary font-semibold">{service.price}</h3>
              </div>
              <button className="ml-2" onClick={() => handleBuyClick(service)}>
                <FiBookmark className="w-5 h-5 text-[#FF6B00]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Country Select Modal */}
      <CountrySelectModal
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        onSelect={setSelectedCountry}
      />

      <NumberTypeSelectModal
        open={numberTypeModalOpen}
        onClose={() => setNumberTypeModalOpen(false)}
        onSelect={setSelectedNumberType}
      />

      <BuyNumberModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        service={selectedService}
        country={selectedCountry}
        onBuy={handleBuyNumber}
      />
    </div>
  );
};

export default BuyNumbers;
