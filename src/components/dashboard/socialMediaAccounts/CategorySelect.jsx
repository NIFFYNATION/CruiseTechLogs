import React from "react";
import CustomModal from "../../common/CustomModal";

const CategorySelect = ({ open, onClose, categories, onSelect }) => (
  <CustomModal
    open={open}
    onClose={onClose}
    title="Choose Category"
    enableSearch={true}
    searchPlaceholder="Search categories"
    list={categories}
    onSelect={null}
    renderItem={(category, idx) => (
      <button
        key={category.ID}
        className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left"
        onClick={() => {
          onSelect(category);
          onClose();
        }}
      >
        <span className="font-medium">{category.name}</span>
      </button>
    )}
  />
);

export default CategorySelect;
