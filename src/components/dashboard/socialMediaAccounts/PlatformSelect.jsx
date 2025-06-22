import React from "react";
import CustomModal from "../../common/CustomModal";

const PlatformSelect = ({ open, onClose, platforms, onSelect, onSelectCategory }) => (
  <CustomModal
    open={open}
    onClose={onClose}
    title="Choose Platform"
    enableSearch={true}
    searchPlaceholder="Search platforms"
    emptyMessage="No Platform found for seleted category"
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
        <span className="font-medium">{platform.name}
        <span className="p-0 bg-black/70 rounded-full px-3 py-0.5 text-white text-xs font-medium ml-2">{platform.no_account} accts</span>
        </span>
      </button>
    )}
  >
    {platforms.length === 0 && (
      <button
        className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition mt-4"
        onClick={onSelectCategory}
      >
        Choose a different category
      </button>
    )}
  </CustomModal>
);

export default PlatformSelect;
