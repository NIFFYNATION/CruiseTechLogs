// Format a number as Naira currency (₦)
export function money_format(amount, options = {}) {
  if (isNaN(amount)) return "₦0.00";
  return (
    "₦" +
    Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    })
  );
}

// Truncate a string to a max length, adding "..." if needed
export function truncate(str, max = 12) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

// Add more common utilities as needed...

// Extract the last number from a string
export function extractLastNumber(str) {
  if (!str) return null;
  const matches = str.match(/(\d+)(?!.*\d)/);
  return matches ? matches[1] : null;
}
