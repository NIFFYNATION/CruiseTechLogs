import React, { useEffect, useState } from "react";
import CountryFlag from "react-country-flag";
import { motion } from "framer-motion";
import CustomModal from "../../common/CustomModal";
import { fetchCountries } from "../../../services/numberService";

const countryItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, type: "spring", stiffness: 200, damping: 20 }
  }),
};

const CountrySelectModal = ({ open, onClose, onSelect, type }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch countries only when modal is open and type changes
  useEffect(() => {
    let cancelled = false;
    if (!open || !type) {
      setCountries([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Fetch as soon as possible, but only update state if still mounted/open
    fetchCountries(type)
      .then(data => {
        if (!cancelled) {
          if (data && Array.isArray(data)) {
            setCountries(data);
          } else if (data && data.data && Array.isArray(data.data)) {
            setCountries(data.data);
          } else {
            setCountries([]);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup to avoid setting state after unmount/close
    return () => {
      cancelled = true;
    };
  }, [open, type]);

  // Preload countries in background when type changes, so modal opens instantly
  useEffect(() => {
    if (!type) return;
    fetchCountries(type).then(() => {});
  }, [type]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Choose Country"
      enableSearch={true}
      searchPlaceholder="Search for countries"
      list={countries}
      onSelect={country => {
        // onSelect(country);
      }}
      renderItem={(country, idx) => (
        <motion.button
          key={country.id || country.name || idx}
          className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left"
          onClick={() => {
            onSelect(country);
            onClose();
          }}
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={countryItemVariants}
        >
          {country.code && country.code !== "" && country.code != null ? (
            <CountryFlag
              countryCode={country.code}
              svg
              className="w-6 h-6"
              style={{ borderRadius: "4px" }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <img
              src="/icons/default-flag.svg"
              alt="Country"
              className="w-6 h-6"
              style={{ borderRadius: "4px" }}
            />
          )}
          <span className="font-medium">
            {country.name} {country.code ? `(${country.code})` : ""}
          </span>
        </motion.button>
      )}
    >
      {loading && (
        <div className="flex justify-center items-center py-8 text-gray-500">
          Loading...
        </div>
      )}
      {!loading && countries.length === 0 && (
        <div className="flex justify-center items-center py-8 text-gray-400 bg-background">
          No countries found.
        </div>
      )}
    </CustomModal>
  );
};

export default CountrySelectModal;
