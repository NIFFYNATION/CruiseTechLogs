import React from "react";
import CustomModal from "../../common/CustomModal";

const PlatformSelect = ({ open, onClose, platforms, onSelect }) => (
  <CustomModal
    open={open}
    onClose={onClose}
    title="Choose Platform"
    enableSearch={true}
    searchPlaceholder="Search platforms"
    list={platforms}
    onSelect={null}
    renderItem={(platform, idx) => (
      <button
        key={platform.ID}
        className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left"
        onClick={() => {
          onSelect(platform);
          onClose();
        }}
      >
        <img src={platform.icon} alt={platform.name} className="w-6 h-6 rounded" />
        <span className="font-medium">{platform.name}</span>
      </button>
    )}
  />
);

export default PlatformSelect;
