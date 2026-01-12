import React from 'react';
import CustomModal from '../../components/common/CustomModal';

const LoginPromptModal = ({ open, onClose, onLogin, onSignup }) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Authentication Required"
      description="Please login or signup to continue shopping."
      showFooter={false}
      className="max-w-md w-full"
    >
      <div className="flex flex-col gap-4 mt-6">
        <button
            onClick={onLogin}
            className="w-full py-3 px-4 bg-[#0f1115] text-white font-bold rounded-xl hover:bg-[#ff6a00] transition-colors"
        >
            Login
        </button>
        <button
            onClick={onSignup}
            className="w-full py-3 px-4 bg-white text-[#0f1115] border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
            Sign Up
        </button>
      </div>
    </CustomModal>
  );
};

export default LoginPromptModal;
