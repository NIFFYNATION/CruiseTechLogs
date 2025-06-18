import React from 'react';
import { Link } from 'react-router-dom';

// Button variants object for different styles
const BUTTON_VARIANTS = {
  primary: "bg-primary text-background hover:bg-[#D9700A]",
  secondary: "bg-secondary text-text-primary hover:bg-secondary-light",
  outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-background",
  ghost: "bg-background text-primary hover:bg-[#D9700A]",
  danger: "bg-red-500 text-background hover:bg-red-600",
  social: "bg-background border border-secondary text-text-primary hover:bg-background-alt",
  quinary: "bg-quinary hover:bg-quaternary text-white font-semibold",
  quinaryLight: "bg-quinary hover:bg-[#ff8c1a] text-white font-semibold",
  orange: "bg-[#FF6B00] hover:bg-[#ff8c1a] text-white font-semibold",
  quaternary: "bg-quaternary hover:bg-quaternary-dark text-white",
  quaternaryLight: "bg-quaternary-light text-quinary font-semibold",
  success: "bg-[#FFF4ED] text-[#FF6B00] font-semibold",
  textPrimary: "text-gray-600 hover:text-primary",
  textDanger: "text-gray-600 hover:text-danger",
};

// Button sizes
const BUTTON_SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

const BUTTON_SHAPES = {
  rounded: "rounded-full",
  roundedLg: "rounded-xl",
  roundedMd: "rounded-lg",
};

export const Button = ({
  variant = "primary",
  size = "md",
  shape = "rounded",
  fullWidth = false,
  disabled = false,
  type = "button",
  href,
  to,
  icon,
  iconPosition = "left",
  className = "",
  children,
  ...props
}) => {
  // Base classes that are common to all buttons
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-60 disabled:cursor-not-allowed
    ${BUTTON_SIZES[size]}
    ${BUTTON_VARIANTS[variant]}
    ${BUTTON_SHAPES[shape]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Icon rendering helper
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
        {icon}
      </span>
    );
  };

  // Content wrapper
  const content = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </>
  );

  // If it's a link (internal route)
  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  // If it's an external link
  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
};

// Social Button Component
export const SocialButton = ({
  icon,
  children,
  ...props
}) => {
  return (
    <Button
      variant="social"
      size="md"
      icon={icon}
      className="shadow-sm"
      {...props}
    >
      {children}
    </Button>
  );
};

// Submit Button Component
export const SubmitButton = ({
  children,
  loading,
  ...props
}) => {
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </Button>
  );
}; 