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
  if (!hasAccess) {
    return (
      <div className="p-2 md:p-6 min-h-screen">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Email Rental</h2>
          <p className="text-text-secondary font-semibold text-sm md:text-base">
            This feature is currently in development and only available to selected users.
          </p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-sm text-center">
          <img 
            src="/icons/lock.svg" 
            alt="Access Denied" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-text-secondary mb-4">
            You don't currently have access to the Email Rental feature. 
            This feature is in development and only available to selected users.
          </p>
        </div>
      </div>
    );
  }

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
            <img
              src="/icons/mail.svg"
              alt="Email Type"
              className="w-6 h-6 mr-2"
            />
            <div className="items-center">
              <h3 className="font-medium">
                {selectedEmailType?.name || selectedEmailType?.id || "Select an email type"}
              </h3>
            </div>
          </div>
          <img src="/icons/arrow-down.svg" alt="arrow" className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search services"
            className="w-full h-full bg-white border border-border-grey rounded-sm px-4 py-1 md:py-3 pl-10 text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-grey" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {servicesLoading ? (
          // Loading skeletons
          [...Array(8)].map((_, index) => (
            <SkeletonNumberCard key={index} />
          ))
        ) : filteredServices.length > 0 ? (
          // Service cards
          filteredServices.map((service) => {
            const serviceId = service.id || service.ID;
            const isSaved = savedServiceIds.includes(serviceId);
            return (
              <div
                key={serviceId}
                className="bg-white rounded-md shadow-sm overflow-hidden border border-border-grey hover:border-primary transition-all"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <button
                      onClick={() => toggleBookmark(serviceId)}
                      className="text-text-grey hover:text-primary"
                    >
                      {isSaved ? (
                        <FaBookmark className="text-primary" />
                      ) : (
                        <FiBookmark />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${service.name.toLowerCase().replace(/\s+/g, '')}.com&size=90`}
                        alt={service.name}
                        className="w-6 h-6 mr-2"
                        onError={(e) => {
                          e.target.src = "/icons/mail.svg";
                        }}
                      />
                      <span className="text-sm text-text-secondary">
                        {selectedEmailType?.name || selectedEmailType?.id || "Email"}
                      </span>
                    </div>
                    <span className="text-sm font-medium bg-secondary/10 text-secondary px-2 py-1 rounded">
                      {service.count || 0} available
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">₦{service.cost?.toFixed(2) || "0.00"}</span>
                    <button
                      onClick={() => handleBuyClick(service)}
                      className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-dark transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // No services found
          <div className="col-span-full text-center py-8">
            <FiBox className="mx-auto text-4xl text-text-grey mb-2" />
            <h3 className="font-medium text-lg mb-1">No services found</h3>
            <p className="text-text-secondary">
              {selectedEmailType
                ? "No services available for this email type. Try selecting a different type."
                : "Please select an email type to view available services."}
            </p>
          </div>
        )}
      </div>

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