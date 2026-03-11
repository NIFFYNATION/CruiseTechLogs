import React from "react";
import { motion } from "framer-motion";
import CustomModal from "../../common/CustomModal";
import { FiList } from "react-icons/fi";

const optionItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, type: "spring", stiffness: 200, damping: 20 }
  }),
};

const OptionSelectModal = ({ open, onClose, onSelect, options }) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Choose Option"
      enableSearch={false}
      list={options || []}
      loading={false}
      renderItem={(option, idx) => (
        <motion.button
          key={option.value || idx}
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left border-b border-gray-50 last:border-0"
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={optionItemVariants}
        >
          <div className="bg-quinary/10 p-2 rounded-full">
            <FiList className="w-5 h-5 text-quinary" />
          </div>
          <div className="flex flex-col">
             <span className="font-semibold text-gray-800">{option.label || option.title || option.name || option.value || "Option"}</span>
             {option.description && (
               <span className="text-xs text-gray-500">{option.description}</span>
             )}
          </div>
        </motion.button>
      )}
    />
  );
};

export default OptionSelectModal;
