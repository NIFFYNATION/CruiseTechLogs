import React, { useState, useEffect } from "react";
import { FiSearch, FiBookmark, FiBox } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import EmailTypeSelectModal from "./EmailTypeSelectModal";
import BuyEmailModal from "./BuyEmailModal";
import { fetchEmailServices } from '../../../services/emailService';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { hasEmailRentalAccess } from "../../../utils/featureAccess";
import Toast from '../../common/Toast';
import { SkeletonNumberCard } from "../../common/Skeletons";

const BuyEmails = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [emailTypeModalOpen, setEmailTypeModalOpen] = useState(true); // Open by default
  const [selectedEmailType, setSelectedEmailType] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const navigate = useNavigate();
  const [savedServiceIds, setSavedServiceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedEmailServices')) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [hasAccess, setHasAccess] = useState(false);

  // Check if user has access to email rental feature
  useEffect(() => {
    if (user && user.email) {
      setHasAccess(hasEmailRentalAccess(user.email));
    }
  }, [user]);

  // Fetch services when email type changes
  useEffect(() => {
    // Don't fetch until a type is selected
    if (!selectedEmailType) return;

    // Fetch services
    setServicesLoading(true);
    fetchEmailServices(selectedEmailType.id)
      .then((data) => {
        const servicesArray = Array.isArray(data) ? data : [];
        setServices(servicesArray);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, [selectedEmailType]);

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
      localStorage.setItem('savedEmailServices', JSON.stringify(updated));
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

  const handleBuyEmail = (emailData) => {
    if (emailData && emailData.ID) {
      // Redirect to manage emails page
      setBuyModalOpen(false);
      navigate(`/dashboard/manage-rentals/${emailData.ID}`, { replace: true });
    } else {
      setBuyModalOpen(false);
    }
  };

  // If user doesn't have access, show access denied message
  // if (!hasAccess) {
  //   return (
  //     <div className="p-2 md:p-6 min-h-screen">
  //       <div className="mb-6">
  //         <h2 className="text-xl md:text-2xl font-semibold mb-2">Email Rental</h2>
  //         <p className="text-text-secondary font-semibold text-sm md:text-base">
  //           This feature is currently in development and only available to selected users.
  //         </p>
  //       </div>
  //       <div className="bg-white p-6 rounded-md shadow-sm text-center">
  //         <img 
  //           src="/icons/lock.svg" 
  //           alt="Access Denied" 
  //           className="w-16 h-16 mx-auto mb-4"
  //         />
  //         <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
  //         <p className="text-text-secondary mb-4">
  //           You don't currently have access to the Email Rental feature. 
  //           This feature is in development and only available to selected users.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-2 md:p-6 min-h-screen">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Buy Email</h2>
        <p className="text-text-secondary font-semibold text-sm md:text-base">
          Rent temporary email addresses for verification and registration.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <button
          className="flex-1 flex items-center justify-between bg-white border border-border-grey rounded-sm px-4 py-1 md:py-3 text-left text-sm md:text-base"
          onClick={() => setEmailTypeModalOpen(true)}
        >
          <div className="flex items-center gap-2">
            {/* <img
              src="/icons/mail.svg"
              alt="Email Type"
              className="w-6 h-6 mr-2"
            /> */}
            <div className="items-center">
              <h3 className="font-medium">
                {selectedEmailType?.name || selectedEmailType?.id || "Select an email type"}
              </h3>
            </div>
          </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button>
      </div>

      {/* Main Card */}
      {selectedEmailType ? (
        <div className="bg-background rounded-lg p-4 md:p-8">
          {/* Search and View Rented Emails */}
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

          {/* Services Count */}
          {!servicesLoading && services.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-text-grey">
                {search ? (
                  filteredServices.length === services.length ? (
                    `Showing all ${services.length} service${services.length !== 1 ? 's' : ''}`
                  ) : (
                    `Showing ${filteredServices.length} of ${services.length} service${services.length !== 1 ? 's' : ''}`
                  )
                ) : (
                  `${services.length} service${services.length !== 1 ? 's' : ''} available`
                )}
              </p>
            </div>
          )}

          {/* Services Grid */}
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

                return (
                  <div
                    key={idx}
                    onClick={() => handleBuyClick(service)}
                    className="flex items-center rounded-xl shadow-sm px-4 py-4 mb-0 border-b-1 border-[#FFDE59] relative bg-gradient-to-tl from-rose-50/50 to-white-50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <img src={iconUrl} alt={service.name} className="w-6 mr-4" onError={(e) => {
                      e.target.src = "/icons/mail.svg";
                    }} />
                    <div className="flex-1">
                      <div className="font-semibold">{service.name}</div>
                      {service.count && (
                        <div className="text-xs text-text-grey mb-1">
                          {service.count.toLocaleString()} account{service.count !== 1 ? 's' : ''} available
                        </div>
                      )}
                      <h3 className="text-primary font-semibold">
                        {typeof service.cost === "number"
                          ? service.cost.toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                          : `₦${service.cost ? String(service.cost).replace(/^₦/, '').replace(/^N/, '').trim() : "0.00"}`}
                      </h3>
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
          <img src="/icons/mail.svg" alt="Choose Email Type" className="w-16 h-16 mb-4" />
          <h4 className="text-lg font-semibold text-text-secondary mb-2">Select an email type to see available email services</h4>
          <p className="text-sm text-text-grey mb-4 text-center">
            Please select an <span className="font-semibold text-quinary">email type</span> to view and purchase email services.
          </p>
          <button
            className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition"
            onClick={() => setEmailTypeModalOpen(true)}
          >
            Choose Email Type
          </button>
        </div>
      )}

      {/* Email Type Selection Modal */}
      {emailTypeModalOpen && (
        <EmailTypeSelectModal
          isOpen={emailTypeModalOpen}
          onClose={() => setEmailTypeModalOpen(false)}
          onSelect={(type) => {
            setSelectedEmailType(type);
            setEmailTypeModalOpen(false);
          }}
        />
      )}

      {/* Buy Email Modal */}
      {buyModalOpen && selectedService && (
        <BuyEmailModal
          isOpen={buyModalOpen}
          onClose={() => setBuyModalOpen(false)}
          service={selectedService}
          emailType={selectedEmailType}
          onBuy={handleBuyEmail}
        />
      )}
    </div>
  );
};

export default BuyEmails;