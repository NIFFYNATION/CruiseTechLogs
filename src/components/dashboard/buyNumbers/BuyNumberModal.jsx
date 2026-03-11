import React, { useState } from "react";
import CountryFlag from "react-country-flag";
import { FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import CustomModal from "../../common/CustomModal";
import { bookNumber } from "../../../services/numberService";
import ToastPortal from "../common/ToastPortal";

const BuyNumberModal = ({
  open,
  onClose,
  service,
  country,
  selectedType,
  selectedOption,
  selectedPriceKey,
  onBuy,
}) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); // For highlighted error line
  const [modalSelectedPriceKey, setModalSelectedPriceKey] = useState(selectedPriceKey);
  const [onBuyValues, setOnBuyValues] = useState({});

  // Update modal selected price when prop changes
  React.useEffect(() => {
    setModalSelectedPriceKey(selectedPriceKey);
  }, [selectedPriceKey]);

  // Initialize onBuy values when modal opens or selectedType/selectedOption changes
  React.useEffect(() => {
    if (!open) return;
    const schema = selectedOption?.onbuy || selectedType?.onbuy || null;
    if (!schema || typeof schema !== 'object') {
      setOnBuyValues({});
      return;
    }
    const initial = {};
    Object.entries(schema).forEach(([key, val]) => {
      // default empty; don't auto-pick to force intentional choice when required
      initial[key] = "";
    });
    setOnBuyValues(initial);
  }, [open, selectedType, selectedOption]);

  const handleOnBuyChange = (key, value) => {
    setOnBuyValues(prev => ({ ...prev, [key]: value }));
  };

  // Helper: check if field should be shown based on conditions
  const shouldShowField = (fieldVal) => {
    if (!fieldVal?.show_if) return true;
    const { countryID } = fieldVal.show_if;
    
    // Check country condition
    if (countryID) {
       if (!country) return false;
       const matches = 
           country.value === countryID || 
           String(country.id) === String(countryID) ||
           country.name === countryID ||
           (countryID === 'USA' && country.value === 'US'); // Handle common alias
       
       if (!matches) return false;
    }
    
    return true;
  };

  // Helper: get default price for service with multiple costs
  const getDefaultPrice = (costObj) => {
    if (typeof costObj !== 'object' || costObj === null) return null;
    const prices = Object.values(costObj);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    // Find the price closest to average
    let closestPrice = null;
    let closestKey = null;
    let minDiff = Infinity;
    
    Object.entries(costObj).forEach(([key, price]) => {
      const diff = Math.abs(price - avgPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closestPrice = price;
        closestKey = key;
      }
    });
    
    return { key: closestKey, price: closestPrice };
  };

  // Set default price if none selected
  React.useEffect(() => {
    if (service && typeof service.cost === 'object' && service.cost !== null && !modalSelectedPriceKey) {
      const defaultPrice = getDefaultPrice(service.cost);
      if (defaultPrice) {
        setModalSelectedPriceKey(defaultPrice.key);
      }
    }
  }, [service, modalSelectedPriceKey]);

  // Always render ToastPortal if toast is set, even if modal is closed
  if (!open || !service || !country) {
    return (
      <>
        {toast && (
          <ToastPortal
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            timeout={toast.type === "success" ? 2500 : 5000}
          />
        )}
      </>
    );
  }

  const handleBuy = async () => {
    setToast(null);
    setErrorMsg("");
    setLoading(true);
    try {
      // Validate base inputs
      const serviceId = service?.id || service?.ID;
      if (!serviceId) {
        setErrorMsg("Invalid service selected. Please try again.");
        setLoading(false);
        return;
      }

      // Check if price selection is required
      if (typeof service.cost === 'object' && service.cost !== null && !modalSelectedPriceKey) {
        setErrorMsg("Please select a price option before proceeding.");
        setLoading(false);
        return;
      }

      // Prevent double click
      if (loading) return;

      // Validate on-buy dynamic fields if present
      const schema = selectedOption?.onbuy || selectedType?.onbuy || null;
      if (schema && typeof schema === 'object') {
        const missing = [];
        Object.entries(schema).forEach(([key, val]) => {
          if (!shouldShowField(val)) return; // Skip validation if field is hidden
          const required = Boolean(val?.is_required) || Boolean(val?.is_requied);
          const v = onBuyValues?.[key];
          if (required && (v === undefined || v === null || String(v).trim() === "")) {
            missing.push(key);
          }
        });
        if (missing.length > 0) {
          setErrorMsg(`Please fill required fields: ${missing.join(", ")}`);
          setLoading(false);
          return;
        }
      }

      // Prepare meta params (combine onBuyValues and selectedOption)
      const metaParams = { ...onBuyValues };
      if (selectedOption?.value) {
        metaParams.option = selectedOption.value;
      }

      // Book number with price ID and on-buy meta if available
      const result = await bookNumber(serviceId, modalSelectedPriceKey, metaParams);

      setToast({
        type: "success",
        message: result.message || "Number booked successfully!",
      });
      if (onBuy) onBuy(result.data);
    } catch (err) {
      // err.message is always present from numberService
      setErrorMsg(err.message || "Failed to book number. Please check your connection and try again.");
      setToast({
        type: "error",
        message: err.message || "Failed to book number. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear errorMsg on modal close
  const handleClose = () => {
    setErrorMsg("");
    onClose && onClose();
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Buy Number"
        showFooter={false}
        className="max-w-xl"
      >
        {/* Service Card */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between border rounded-lg border-primary px-4 py-3">
            <div className="flex items-center gap-3 ">
              {/* Generate iconUrl as in BuyNumbers page */}
              {(() => {
                const name = service.name?.split(/[ /]+/)[0] || "";
                const nameLower = name.trim().toLowerCase();
                let domain = `${nameLower}.com`;
                if (nameLower === "telegram" || nameLower === "signal") {
                  domain = `${nameLower}.org`;
                }
                const iconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=90`;
                return (
                  <img
                    src={iconUrl}
                    alt={service.name}
                    className="w-8 h-8"
                  />
                );
              })()}
              <div>
                <h3 className="font-semibold text-primary">{service.name}</h3>
                {typeof service.cost === 'object' && service.cost !== null ? (
                  <div className="text-sm text-text-secondary">
                    {(() => {
                      const prices = Object.values(service.cost);
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      return (
                        <span className="font-semibold text-primary">
                          ₦{minPrice.toLocaleString()} - ₦{maxPrice.toLocaleString()}
                        </span>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-sm text-text-secondary">
                    <span className="font-semibold text-primary">
                      {typeof service.cost === "number"
                        ? service.cost.toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                        : `₦${service.cost ? String(service.cost).replace(/^₦/, '').replace(/^N/, '').trim() : "0.00"}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CountryFlag
                countryCode={country.value}
                svg
                className="w-6 h-6"
                style={{ borderRadius: "4px" }}
              />
              <span className="text-sm font-medium">{country.code}</span>
            </div>
          </div>
        </div>

        {/* Price Selection for Multiple Costs */}
        {typeof service.cost === 'object' && service.cost !== null && (
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-semibold text-primary mb-2">Select Your Price</h4>
              <div className="text-xs text-text-grey mb-4">
                Higher prices increase your chances of getting a number
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(service.cost).map(([priceKey, price]) => (
                  <div
                    key={priceKey}
                    className={`relative cursor-pointer transition-all duration-200 ${
                      modalSelectedPriceKey === priceKey
                        ? 'ring-2 ring-quinary bg-quinary/10 border-quinary'
                        : 'border border-gray-200 hover:border-quinary/50 hover:bg-orange-50/50'
                    } rounded-lg p-3`}
                    onClick={() => setModalSelectedPriceKey(priceKey)}
                  >
                    {modalSelectedPriceKey === priceKey && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-quinary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        ₦{price.toLocaleString()}
                      </div>
                      <div className="text-xs text-text-grey mt-1">
                        {priceKey === Object.keys(service.cost)[0] ? 'Budget' : 
                         priceKey === Object.keys(service.cost)[Object.keys(service.cost).length - 1] ? 'Premium' : 'Standard'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Dynamic On-Buy Options */}
        {(() => {
           const schema = selectedOption?.onbuy || selectedType?.onbuy;
           if (!schema || typeof schema !== 'object') return null;

           const visibleEntries = Object.entries(schema).filter(([key, val]) => shouldShowField(val));
           
           if (visibleEntries.length === 0) return null;

           return (
            <div className="px-6 pb-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-primary mb-4 text-lg">Additional Options</h4>
                <div className="grid grid-cols-1 gap-5">
                  {visibleEntries.map(([key, val]) => {
                    const isObjWithData = val && typeof val === 'object' && Array.isArray(val.data);
                    const isArray = Array.isArray(val);
                    const required = Boolean(val?.is_required) || Boolean(val?.is_requied);
                    const description = val?.description;
  
                    // Format label: "camelCase" -> "Camel Case"
                    let label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
                    label = label.charAt(0).toUpperCase() + label.slice(1);
  
                    return (
                      <div key={key} className="flex flex-col group">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                            {label}
                            {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
                          </label>
                          {description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                          )}
                        </div>
  
                        {/* Render Input Control based on type */}
                        {(isObjWithData || isArray) ? (
                          <div className="relative">
                            <select
                              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-quinary/50 focus:border-quinary transition-all shadow-sm hover:border-gray-400"
                              value={onBuyValues[key] ?? ""}
                              onChange={(e) => handleOnBuyChange(key, e.target.value)}
                              required={required}
                            >
                              <option value="" disabled>Select {label}</option>
                              {(isObjWithData ? val.data : val).map((opt, idx) => (
                                <option key={idx} value={opt}>{String(opt)}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          (() => {
                            // Check if it's an object acting as a map (like carrier example)
                            // Exclude keys like 'description', 'is_required', etc.
                            const possibleOptions = typeof val === 'object' && val !== null ? Object.entries(val).filter(([k]) => !['description', 'is_required', 'is_requied', 'show_if'].includes(k)) : [];
                            
                            if (possibleOptions.length > 0) {
                               return (
                                  <div className="relative">
                                    <select
                                      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-quinary/50 focus:border-quinary transition-all shadow-sm hover:border-gray-400"
                                      value={onBuyValues[key] ?? ""}
                                      onChange={(e) => handleOnBuyChange(key, e.target.value)}
                                      required={required}
                                    >
                                      <option value="" disabled>Select {label}</option>
                                      {possibleOptions.map(([optKey, optVal]) => (
                                        <option key={optKey} value={optKey}>{String(optVal)}</option>
                                      ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                      </svg>
                                    </div>
                                  </div>
                               );
                            }
  
                            const isLongText = typeof val === 'string' && val.length === 0 && /remark|note|comment|description/i.test(key);
                            if (isLongText) {
                              return (
                                <textarea
                                  className="w-full border border-gray-300 text-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-quinary/50 focus:border-quinary transition-all shadow-sm resize-y min-h-[80px] hover:border-gray-400"
                                  rows={3}
                                  placeholder={`Enter ${label}...`}
                                  value={onBuyValues[key] ?? ""}
                                  onChange={(e) => handleOnBuyChange(key, e.target.value)}
                                  required={required}
                                />
                              );
                            }
                            return (
                              <input
                                type="text"
                                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-quinary/50 focus:border-quinary transition-all shadow-sm hover:border-gray-400"
                                placeholder={`Enter ${label}`}
                                value={onBuyValues[key] ?? ""}
                                onChange={(e) => handleOnBuyChange(key, e.target.value)}
                                required={required}
                              />
                            );
                          })()
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
           );
        })()}

        {/* Info Notice */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 bg-[#FFF4ED] border border-quinary rounded-lg px-4 py-3">
            <FiInfo className="text-quinary w-5 h-5" />
            <span className="text- text-sm">
              You'll be charged, but automatically refunded if no OTP is received.
            </span>
          </div>
          {/* display error message here too */}
          {errorMsg && (
            <div className="mt-3 px-4 py-2 rounded bg-red-100 border border-red-400 text-danger font-semibold text-sm">
              {errorMsg}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-border-grey px-6 py-4">
          <button
            className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-quinary hover:bg-quaternary text-white rounded-full px-4 md:px-6 py-2 font-semibold transition"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Number"}
          </button>
        </div>
      </CustomModal>
      {toast && (
        <ToastPortal
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          timeout={toast.type === "success" ? 2500 : 5000}
        />
      )}
    </>
  );
};

export default BuyNumberModal;
