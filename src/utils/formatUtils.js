
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

// Extract preview text from HTML (strip tags, limit length)
export function htmlPreviewText(html, maxLength = 80) {
  if (!html) return '';

  // Unescape HTML entities
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  const unescaped = txt.value;

  // Remove HTML tags
  const text = unescaped.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  // Shorten if needed
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}


// Linkify URLs in HTML or plain text, return HTML string
export function linkifyHtml(html, colorClass = 'text-primary') {
  if (!html) return '';
  // Regex for URLs (http, https, www)
  const urlRegex = /((https?:\/\/|www\.)[\w\-._~:/?#[\]@!$&'()*+,;=%]+)(?![^<]*>|[^[]*])/gi;
  // Replace URLs with anchor tags
  return html.replace(urlRegex, (url) => {
    let href = url;
    if (!href.match(/^https?:\/\//)) {
      href = 'https://' + href;
    }
    return `<a href="${href}" class="${colorClass}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

// Format date string into readable date and time
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return { date: formattedDate, time: formattedTime };
  } catch {
    return { date: dateString, time: '' };
  }
}
