import React, { useState, useEffect } from "react";
import { FiSearch, FiBookmark, FiBox, FiRefreshCw } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import CountrySelectModal from "../buyNumbers/CountrySelectModal";
import CountryFlag from "react-country-flag";
import NumberTypeSelectModal from "./NumberTypeSelectModal";
import BuyNumberModal from "./BuyNumberModal";
import { fetchServices } from '../../../services/numberService';
import { useNavigate } from "react-router-dom";
import NumberDetailsModal from "../manageNumbers/NumberDetailsModal";
import { SkeletonNumberCard } from "../../common/Skeletons";
import Toast from '../../common/Toast';

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
  const [savedServiceIds, setSavedServiceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedServices')) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

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
      .then((data) => {
        const servicesArray = Array.isArray(data) ? data : [];
        setServices(servicesArray);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
    // eslint-disable-next-line
  }, [selectedNumberType, selectedCountry]);

  // Add manual refresh function to fetch latest services and pricing from API
  const refreshServices = () => {
    if (!selectedNumberType) return;
    if (typeNeedsCountry(selectedNumberType) && (!selectedCountry || !selectedCountry.id)) return;
    setServicesLoading(true);
    fetchServices({
      type: selectedNumberType.type || selectedNumberType.value || "",
      network: selectedNumberType.network,
      countryID: typeNeedsCountry(selectedNumberType) ? selectedCountry?.id : undefined,
      forceRefresh: true,
    })
      .then((data) => {
        const servicesArray = Array.isArray(data) ? data : [];
        setServices(servicesArray);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  };

  // Helper: toggle bookmark
  const toggleBookmark = (serviceId) => {
    setSavedServiceIds(prev => {
      let updated;
      let isSaved;
      if (prev.includes(serviceId)) {
        updated = prev.filter(id => id !== serviceId);
        isSaved = false;
      } else {
        updated = [serviceId, ...prev];
        isSaved = true;
      }
      localStorage.setItem('savedServices', JSON.stringify(updated));
      setToast({
        show: true,
        message: isSaved ? 'Service saved!' : 'Service removed from saved!',
        type: isSaved ? 'success' : 'info',
      });
      return updated;
    });
  };

  // Filter and sort: saved services first
  const filteredServices = services
    .filter((service) => {
      const serviceName = service.name;
      return serviceName && typeof serviceName === 'string' && serviceName.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aSaved = savedServiceIds.includes(a.id || a.ID);
      const bSaved = savedServiceIds.includes(b.id || b.ID);
      if (aSaved === bSaved) return 0;
      return aSaved ? -1 : 1;
    });

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
                {selectedNumberType?.label || "Select a category"}
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
      {selectedNumberType ? (
        <div className="bg-background rounded-lg  p-4 md:p-8">
          {/* Refresh services button */}
          <div className="flex justify-end mb-2">
            <button
              className="inline-flex items-center gap-2 text-quinary text-sm font-semibold hover:underline disabled:opacity-50"
              onClick={refreshServices}
              disabled={servicesLoading || !selectedNumberType || (typeNeedsCountry(selectedNumberType) && !selectedCountry?.id)}
            >
              {servicesLoading ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Updating services...
                </>
              ) : (
                <>
                  <FiRefreshCw />
                  Refresh services
                </>
              )}
            </button>
          </div>
          {/* Search and View Rented Numbers */}
          {(services.length > 0 || search) && (
            <div className="relative w-full mb-2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-grey" size={20} />
              <input
                type="text"
                placeholder="Search Service"
                className="w-full font-semibold border border-border-grey rounded-sm pl-10 pr-4 py-2.5 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

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
          {/* <div className="hidden md:flex justify-between items-center bg-quaternary-light rounded-lg px-4 py-3 my-8 d-none">
         <div className="grid md:flex gap-2 items-center d-none">
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
        </div> */}

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {servicesLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonNumberCard key={i} />)
            ) : filteredServices.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-400">
                <FiBox className="w-16 h-16 mb-4 text-quinary" />
                <div className="text-md font-semibold text-text-secondary mb-2">No services found.</div>
                {search ? (
                  <div className="text-sm text-text-grey text-center">
                    No services match <span className="font-semibold text-quinary">"{search}"</span>.<br />
                    Try a different search term or clear your search.
                  </div>
                ) : (
                  <div className="text-sm text-text-grey text-center">
                    Try adjusting your filters or check back later for new services.
                  </div>
                )}
                {/* Refresh button visible even when empty */}
                <button
                  className="mt-3 inline-flex items-center gap-2 text-quinary text-sm font-semibold hover:underline disabled:opacity-50"
                  onClick={refreshServices}
                  disabled={servicesLoading || !selectedNumberType || (typeNeedsCountry(selectedNumberType) && !selectedCountry?.id)}
                >
                  {servicesLoading ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Updating services...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw />
                      Refresh services
                    </>
                  )}
                </button>
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

                const serviceId = service.id || service.ID;
                const isSaved = savedServiceIds.includes(serviceId);
                const hasMultipleCosts = typeof service.cost === 'object' && service.cost !== null;

                // Get price range for display
                const getPriceRange = (costObj) => {
                  if (typeof costObj !== 'object' || costObj === null) return null;
                  const prices = Object.values(costObj);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  return { min: minPrice, max: maxPrice };
                };

                const priceRange = hasMultipleCosts ? getPriceRange(service.cost) : null;

                return (
                  <div
                    key={idx}
                    onClick={() => handleBuyClick(service)}
                    className="flex items-center rounded-xl shadow-sm px-4 py-4 mb-0 border-b-1 border-[#FFDE59] relative bg-gradient-to-tl from-rose-50/50 to-white-50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <img src={iconUrl} alt={service.name} className="w-6 mr-4" />
                    <div className="flex-1">
                      <div className="font-semibold">{service.name}</div>
                      
                      {hasMultipleCosts ? (
                        <div className="mt-1">
                          <h3 className="text-primary font-semibold text-sm">
                            ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
                          </h3>
                          <p className="text-xs text-text-grey mt-1">
                            Select price in modal (higher = better chances)
                          </p>
                        </div>
                      ) : (
                        <h3 className="text-primary font-semibold">
                          {typeof service.cost === "number"
                            ? service.cost.toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                            : `₦${service.cost ? String(service.cost).replace(/^₦/, '').replace(/^N/, '').trim() : "0.00"}`}
                        </h3>
                      )}
                    </div>
                    <button
                      className="ml-2"
                      onClick={e => {
                        e.stopPropagation(); // Prevent triggering buy
                        toggleBookmark(serviceId);
                      }}
                      aria-label={isSaved ? "Unsave service" : "Save service"}
                    >
                      {isSaved ? (
                        <FaBookmark className="w-5 h-5 text-[#FF6B00] fill-[#FF6B00]" />
                      ) : (
                        <FiBookmark className="w-5 h-5 text-[#FF6B00]" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <img src="/icons/filter.svg" alt="Choose Category" className="w-16 h-16 mb-4" />
          <h4 className="text-lg font-semibold text-text-secondary mb-2">Select a category to see available number services</h4>
          <p className="text-sm text-text-grey mb-4 text-center">
            Please select a <span className="font-semibold text-quinary">category</span> to view and purchase number services.
          </p>
          <button
            className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition"
            onClick={() => setNumberTypeModalOpen(true)}
          >
            Choose Category
          </button>
        </div>
      )}

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
        selectedPriceKey={selectedService ? null : null} // Price selection is handled in modal
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
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default BuyNumbers;
