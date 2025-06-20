import React, { useState, useEffect } from "react";
import { FiSearch, FiBookmark } from "react-icons/fi";
import CountrySelectModal from "../buyNumbers/CountrySelectModal";
import CountryFlag from "react-country-flag";
import NumberTypeSelectModal from "./NumberTypeSelectModal";
import BuyNumberModal from "./BuyNumberModal";
import { fetchServices } from '../../../services/numberService';
import { useNavigate } from "react-router-dom";
import NumberDetailsModal from "../manageNumbers/NumberDetailsModal";

const BuyNumbers = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Accounts");
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "+1",
    value: "US",
    id: 2,
  });
  const [numberTypeModalOpen, setNumberTypeModalOpen] = useState(true); // Open by default
  const [selectedNumberType, setSelectedNumberType] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [pendingNumber, setPendingNumber] = useState(null);
  const [shouldShowModal, setShouldShowModal] = useState(false); // control modal after redirect
  const navigate = useNavigate();

  // Helper: does this type require country selection?
  const typeNeedsCountry = (type) =>
    type &&
    (
      type.value === "short_term_3" ||
      type.value === "short_term_5" ||
      type.value === "short_term_6"
    );

  // Fetch services when number type or country changes
  useEffect(() => {
    // Don't fetch until a type is selected
    if (!selectedNumberType) return;

    // If type requires country, wait for country to be selected
    if (typeNeedsCountry(selectedNumberType)) {
      if (!selectedCountry || !selectedCountry.id) return;
    }

    // Fetch services
    setServicesLoading(true);
    fetchServices({
      type: selectedNumberType.type || selectedNumberType.value || "",
      network: selectedNumberType.network,
      countryID: typeNeedsCountry(selectedNumberType)
        ? selectedCountry?.id
        : undefined,
    })
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
    // eslint-disable-next-line
  }, [selectedNumberType, selectedCountry]);

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuyClick = (service) => {
    setSelectedService(service);
    setBuyModalOpen(true);
  };

  const handleBuyNumber = (numberData) => {
    if (numberData && numberData.ID) {
      // Redirect first, then show modal after navigation
      setPendingNumber(numberData);
      setBuyModalOpen(false);
      setShouldShowModal(false);
      // Use replace to avoid double modal if user goes back
      navigate(`/dashboard/manage-numbers/${numberData.ID}`, { replace: true });
      // Delay modal open to next tick to allow navigation to complete
      setTimeout(() => setShouldShowModal(true), 0);
    } else {
      setBuyModalOpen(false);
    }
  };

  // After modal is closed, clear pendingNumber and modal state
  const handlePendingNumberModalClose = () => {
    setShouldShowModal(false);
    setPendingNumber(null);
  };

  // Open country modal immediately after selecting a number type if condition is met
  useEffect(() => {
    if (selectedNumberType && typeNeedsCountry(selectedNumberType)) {
      setCountryModalOpen(true);
    }
    // eslint-disable-next-line
  }, [selectedNumberType]);

  return (
    <div className="p-2 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Buy Number</h2>
        <p className="text-text-secondary font-semibold text-sm md:text-base">
          You will receive an instant refund if you do not receive OTP.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
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

         {/* Only render country filter for specific number type values */}
        {(selectedNumberType?.value === "short_term_3" ||
          selectedNumberType?.value === "short_term_5" ||
          selectedNumberType?.value === "short_term_6") && (
          <button
            className="flex-1 flex items-center justify-between bg-white border border-border-grey rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base"
            onClick={() => setCountryModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              {selectedCountry?.code && (
                <CountryFlag
                  countryCode={selectedCountry.code}
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
        )}
        {/* <button className="flex-1 flex items-center justify-between bg-white border border-border-grey  rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base">
           <div className="flex items-center gap-2">
           <img src="/icons/hourglass-full.svg" alt="USA" className="w-6 h-6 mr-2" />
          <div className="items-center">
            <h3 className="font-medium">Long Term Number 1 (USA)</h3>
            <p className="text-xs text-text-grey">(Up to 30 Days)</p>
          </div>
           </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button> */}
       
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
       {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
       <h3 className="text-lg font-semibold my-8">Short Term Number 1 (USA)</h3>
        <button className="bg-quinary hover:bg-quaternary text-background rounded-full px-6 py-2.5 font-semibold transition-colors">
            View Rented Numbers
          </button>
       </div> */}

        {/* Tabs */}
        {/* <div className="flex items-center border-b border-border-grey my-6">
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
        </div> */}

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
          {servicesLoading ? (
            <div className="col-span-3 flex justify-center items-center py-8 text-gray-500">
              Loading services...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-3 flex justify-center items-center py-8 text-gray-400">
              No services found.
            </div>
          ) : (
            filteredServices.map((service, idx) => {
              // JS logic for icon domain
              const name = service.name?.split(/[ /]+/)[0] || "";
              const nameLower = name.trim().toLowerCase();
              let domain = `${nameLower}.com`;
              if (
                nameLower === "telegram" ||
                nameLower === "signal"
              ) {
                domain = `${nameLower}.org`;
              }
              const iconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=90`;

              // Format cost as currency (Nigerian Naira)
              const formattedCost = typeof service.cost === "number"
                ? service.cost.toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                : `₦${service.cost ? String(service.cost).replace(/^₦/, '').replace(/^N/, '').trim() : "0.00"}`;

              return (
                <div
                  key={idx}
                  onClick={() => handleBuyClick(service)}
                  className="flex items-center rounded-xl shadow-sm px-4 py-4 mb-2 border-b-1 border-[#FFDE59] relative bg-gradient-to-tl from-rose-50/50 to-white-50"
                  // style={{ boxShadow: "0 2px 4px 0 rgba(255, 106, 0, 0.03)" }}
                >
                  <img src={iconUrl} alt={service.name} className="w-6 mr-4" />
                  <div className="flex-1">
                    <div className="font-semibold">{service.name}</div>
                    <h3 className="text-primary font-semibold">{formattedCost}</h3>
                  </div>
                  <button className="ml-2">
                    <FiBookmark className="w-5 h-5 text-[#FF6B00]" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Number Type Select Modal */}
      <NumberTypeSelectModal
        open={numberTypeModalOpen}
        onClose={() => setNumberTypeModalOpen(false)}
        onSelect={(type) => {
          setSelectedNumberType(type);
          setNumberTypeModalOpen(false);
        }}
      />

      {/* Country Select Modal */}
      <CountrySelectModal
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        onSelect={country => {
          setSelectedCountry(country);
          setCountryModalOpen(false);
        }}
        type={selectedNumberType}
      />

      <BuyNumberModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        service={selectedService}
        country={selectedCountry}
        onBuy={handleBuyNumber}
      />
      {/* Redirect to manage-numbers before showing modal */}
      {pendingNumber && shouldShowModal && (
        <NumberDetailsModal
          open={!!pendingNumber}
          onClose={handlePendingNumberModalClose}
          number={pendingNumber.number}
          expiration={pendingNumber.expiration}
          status={pendingNumber.expiration > 0 ? "active" : "expired"}
          verificationCode={""}
          onReload={null}
          onCopyNumber={null}
          onCopyCode={null}
          orderId={pendingNumber.ID}
          date={pendingNumber.date}
          expire_date={pendingNumber.expire_date}
          onNumberClosed={handlePendingNumberModalClose}
        />
      )}
    </div>
  );
};

export default BuyNumbers;
