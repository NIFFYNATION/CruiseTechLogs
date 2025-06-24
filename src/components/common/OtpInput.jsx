import React from 'react';

const OtpInput = ({
  value,
  onChange,
  length = 5,
  isError,
  inputClassName = "",
  containerClassName = "",
  ...inputProps // forward any extra props to each input
}) => {
  const handleChange = (index, val) => {
    if (/^[0-9]?$/.test(val)) {
      const newValue = [...value];
      newValue[index] = val;
      onChange(newValue);
      // Auto-focus next
      if (val && index < length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className={`flex gap-2 justify-center ${containerClassName}`}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          maxLength={1}
          value={value[idx] || ''}
          onChange={e => handleChange(idx, e.target.value)}
          className={`w-12 h-12 text-center text-text-primary border-2 rounded focus:outline-none transition-colors
            ${isError ? 'border-red-500' : 'border-secondary focus:border-primary'} ${inputClassName}`}
          {...inputProps}
        />
      ))}
    </div>
  );
};

export default OtpInput;
