import React, { useEffect, useState } from "react";
import CustomModal from "../../common/CustomModal";
import { fetchNumberTypes } from "../../../services/numberService";

const NumberTypeSelectModal = ({ open, onClose, onSelect }) => {
  const [numberTypes, setNumberTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchNumberTypes()
      .then((data) => {
        if (data && data.code === 200 && Array.isArray(data.data)) {
          setNumberTypes(
            data.data.map((item) => ({
              label: item.title,
              value: `${item.type}_${item.network}`,
              type: item.type,
              network: item.network,
              title: item.title,
              badge: item.badge,
              time: Array.isArray(item.time) ? item.time : undefined,
              notice: item.notice,
              duration: item.duration,
              isallcountries: item.isallcountries,
              onbuy: item.onbuy,
              options: (() => {
                let raw = item.options || item.Options || item.option || item.Option || [];
                if (typeof raw === 'string') {
                  try {
                    raw = JSON.parse(raw);
                  } catch (e) {
                    console.error("Failed to parse options JSON", e);
                    raw = [];
                  }
                }
                
                // Case 1: raw is array
                if (Array.isArray(raw)) return raw;

                // Case 2: raw has .data property (common in this API)
                if (raw && typeof raw === 'object' && raw.data) {
                  const data = raw.data;
                  if (Array.isArray(data)) return data;
                  if (typeof data === 'object' && data !== null) {
                    // Map object keys to array
                    // e.g. "data": { "1": { title: "..." }, "2": { ... } }
                    return Object.entries(data).map(([key, val]) => {
                       // If val is object, merge key as value. If string, use as label/value
                       if (typeof val === 'object' && val !== null) {
                         return { value: key, ...val };
                       }
                       return { value: key, label: val };
                    });
                  }
                }

                // Case 3: raw is object but might be the map itself?
                // Only if it looks like a map of options (keys are IDs)
                if (raw && typeof raw === 'object' && raw !== null && Object.keys(raw).length > 0) {
                   // heuristic: check if keys are numeric or look like IDs
                   // For now, let's treat it as a map if it has keys
                   return Object.entries(raw).map(([key, val]) => {
                      if (typeof val === 'object' && val !== null) {
                        return { value: key, ...val };
                      }
                      return { value: key, label: val };
                   });
                }
                
                return [];
              })(),
            }))
          );
        } else {
          setNumberTypes([]);
        }
      })
      .catch(() => setNumberTypes([]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      defaultOpen={open}
      title="Choose Number Category"
      description={"Select which category you want to buy number from"}
      closeable={true}
      list={numberTypes}
      showFooter={true}
      loading={loading}
      renderItem={(type, idx) => (
        <React.Fragment key={type.value}>
          <button
            className="w-full flex items-center justify-between py-4 px-2 hover:bg-[#F7F7F7] transition rounded"
            onClick={() => {
              if (
                type.label &&
                type.label.trim() !== "" &&
                type.value &&
                String(type.value).trim() !== ""
              ) {
                onSelect(type);
                onClose();
              }
            }}
          >
            <span className="font-medium">{type.label}</span>
            {type.badge && type.badge.title && (
              <span
                className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                style={{
                  backgroundColor: type.badge.background || "#E5E7EB",
                  color: "#ffffff",
                }}
              >
                {type.badge.title}
              </span>
            )}
          </button>
          {idx !== numberTypes.length - 1 && (
            <hr className="border-t border-[#E5E7EB]" />
          )}
        </React.Fragment>
      )}
    >
      {!loading && numberTypes.length === 0 && (
        <div className="flex justify-center items-center py-8 text-gray-400 bg-background">
          No number types found.
        </div>
      )}
    </CustomModal>
  );
};

export default NumberTypeSelectModal;
