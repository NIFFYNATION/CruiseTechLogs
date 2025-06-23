import React from 'react';

const InputField = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  className = "",

  onChange,
  icon,
  showToggle,
  onToggle,
  isToggled,
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={isToggled ? 'text' : type}
        required
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-secondary bg-background text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onToggle}
        >
          {isToggled ? (
            <span className="text-text-secondary">👁️</span>
          ) : (
            <span className="text-text-secondary">🙈</span>
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;