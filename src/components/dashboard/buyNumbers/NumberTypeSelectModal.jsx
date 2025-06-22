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
      closeable={false}
      list={numberTypes}
      showFooter={true}
      loading={loading}
      renderItem={(type, idx) => (
        <React.Fragment key={type.value}>
          <button
            className="w-full text-left py-4 px-2 hover:bg-[#F7F7F7] transition rounded"
            onClick={() => {
              if (
                (type.label && type.label.trim() !== "") &&
                (type.value && String(type.value).trim() !== "")
              ) {
                onSelect(type);
                onClose();
              }
            }}
          >
            <span className="font-medium">{type.label }</span>
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
