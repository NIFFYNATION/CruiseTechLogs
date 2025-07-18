import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../common/Button";
import { fetchOrderDetails, fetchLoginDetails } from '../../../services/socialAccountService';
import Toast from '../../common/Toast';
import CustomModal from '../../common/CustomModal';
import { money_format } from '../../../utils/formatUtils';
import { jsPDF } from "jspdf";
import parse from 'html-react-parser';
import he from 'he';
import { linkifyHtml } from '../../../utils/formatUtils';
import { FiDownload } from 'react-icons/fi';
import CleanText from "../../common/helper";

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.replace(/-/g, '/'));
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });
}

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const OrderConfirmedPage = () => {
  const navigate = useNavigate();
  const { id: urlOrderID } = useParams();
  const [order, setOrder] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [logins, setLogins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [rulesOpen, setRulesOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'info' });

  // Fetch order and logins
  React.useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setOrder(null);
      setAccount(null);
      setLogins([]);
      const orderData = await fetchOrderDetails(urlOrderID);
      if (!orderData) {
        setOrder(null);
        setLoading(false);
        return;
      }
      if (cancelled) return;
      setOrder(orderData);
      setAccount(orderData.account || null);
      let loginArr = [];
      if (orderData.loginIDs) {
        const ids = String(orderData.loginIDs).split(',').map(id => id.trim()).filter(Boolean);
        if (ids.length > 0) {
          const results = await Promise.all(ids.map(id => fetchLoginDetails(id)));
          loginArr = results.filter(Boolean);
        }
      }
      setLogins(loginArr);
      setLoading(false);
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [urlOrderID]);

  // Not found UI
  if (!loading && !order) {
    return (
      <div className="bg-background rounded-xl p-4 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-xl font-semibold text-primary mb-4">Account not found</h2>
        <Button
          variant="orange"
          size="md"
          className="rounded-full shadow-md"
          onClick={() => navigate('/dashboard/accounts')}
        >
          Buy an Account
        </Button>
      </div>
    );
  }

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <svg className="animate-spin h-8 w-8 text-quinary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  // Account info
  const platform = account?.platform;
  const accountTitle = account?.title || 'Account';
  const platformIcon = platform?.icon;
  const platformName = platform?.name || '';
  const platformUrl = platform?.login_url || '';
  const description = decodeHtml(account?.description);
  const rulesHtml = decodeHtml(account?.Aditional_auth_info);

  // Copy all logins as txt
  const handleCopyAll = () => {
    if (!logins.length) return;
    const txt = logins.map(l => l.login_details).join('\n');
    navigator.clipboard.writeText(txt).then(() => {
      setToast({ show: true, message: 'All logins copied!', type: 'success' });
    });
    setDropdownOpen(false);
  };
  // Download all logins as txt
  const handleDownloadAll = () => {
    if (!logins.length) return;
    const txt = logins.map(l => l.login_details).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logins_${order.ID}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToast({ show: true, message: 'Downloaded as txt!', type: 'success' });
    setDropdownOpen(false);
  };
  // Download as PDF
  const handleDownloadPDF = () => {
    if (!logins.length) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Order ID: ${order.ID}`, 10, 15);
    doc.text(`Account: ${accountTitle}`, 10, 25);
    doc.text(`Platform: ${platformName}`, 10, 35);
    doc.text(`Date: ${formatDate(order.date)}`, 10, 45);
    doc.text(`Amount: ${money_format(order.amount)}`, 10, 55);
    doc.text('Logins:', 10, 70);
    let y = 80;
    logins.forEach((login, idx) => {
      doc.setFontSize(12);
      doc.text(`LOGIN ${idx + 1} (${login.username}):`, 10, y);
      y += 7;
      const details = login.login_details.split('\n');
      details.forEach(line => {
        doc.text(line, 14, y);
        y += 7;
      });
      y += 2;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`logins_${order.ID}.pdf`);
    setToast({ show: true, message: 'Downloaded as PDF!', type: 'success' });
    setDropdownOpen(false);
  };
  // Copy individual login
  const handleCopyLogin = (login) => {
    navigator.clipboard.writeText(login.login_details).then(() => {
      setToast({ show: true, message: 'Login copied!', type: 'success' });
    });
  };

  // Responsive check
  const mobile = isMobile();

  return (
    <div className="bg-background rounded-xl p-4 sm:p-8 ">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      {/* Icon and title left-aligned */}
      <div className="flex items-center gap-2 mb-4">
        {platformIcon && (
          <img src={platformIcon} alt={platformName} className="w-7 h-7 inline-block align-middle mr-2" />
        )}
        <h2 className="text-xl font-semibold text-primary">{accountTitle}</h2>
      </div>
      {/* Additional Details (Rules) */}
      {rulesHtml && (
        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
          <div className="font-semibold text-primary mb-1 flex items-center gap-2">Login Rules / Additional Details</div>
          <div className="text-sm text-text-secondary line-clamp-3 overflow-hidden">
            {parse(he.decode(linkifyHtml(rulesHtml, 'text-primary')))}
          </div>
          <Button
            variant="outline"
            size="xs"
            className="w-fit mt-2 px-3"
            onClick={() => setDetailsOpen(true)}
          >
            View More
          </Button>
        </div>
      )}
     
      {/* Order Info */}
      <div className="border-b border-border-grey p-2 pb-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div><span className="">Order ID – </span><span className="text-primary font-mono font-bold">{order.ID}</span></div>
          <div><span className="">Account ID – </span><span className="text-primary font-mono font-bold">{order.accountID}</span></div>
          <div><span className="">Type of Account – </span><span className="text-primary font-semibold font-bold">{accountTitle}</span></div>
          <div><span className="">Price – </span><span className="text-primary font-bold font-bold">{money_format(order.amount)}</span></div>
          <div><span className="">Quantity – </span><span className="text-primary font-bold font-bold">{order.no_of_orders}</span></div>
          <div><span className="">Date – </span><span className="text-primary font-bold font-bold">{formatDate(order.date)}</span></div>
        </div>
      </div>
      {/* Logins Section */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-2 mb-6 flex flex-col items-cente border-b-1 border-[#FFDE59]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-0">Account Access Details</h3>
          {logins.length > 0 && (
            <div className="relative">
            <Button
                variant="outline"
              size="sm"
                className="px-3 py-1 flex items-center gap-2"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <FiDownload className="w-5 h-5" />
                Download Logins
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </Button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-border-grey">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-bgLayout text-primary font-medium"
                    onClick={handleCopyAll}
                  >
                    Copy All Logins
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-bgLayout text-primary font-medium"
                    onClick={handleDownloadAll}
                  >
                    Download as TXT
                  </button>
                <button
                    className="w-full text-left px-4 py-3 hover:bg-bgLayout text-primary font-medium"
                    onClick={handleDownloadPDF}
                >
                  Download as PDF
                </button>
              </div>
            )}
          </div>
          )}
        </div>
        <div className="w-full px-0 md:px-8 pb-8">
          {logins.length === 0 ? (
            <div className="text-center text-tertiary py-8">No login details found for this order.</div>
          ) : (
            logins.map((login, idx) => (
              <div key={login.ID || idx} className="bg-background rounded-xl p-4 mb-6">
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary text-base">LOGIN {idx + 1} ID</span>
                    <span className="font-semibold text-text-primary text-base">– {login.username}</span>
                    {login.preview_link && (
                      <a href={login.preview_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-quinary underline text-xs">View</a>
                    )}
                  </div>
                  {mobile ? (
                    <button
                      className="p-2 rounded-full hover:bg-quaternary/20 transition"
                      onClick={() => handleCopyLogin(login)}
                      aria-label="Copy Login"
                    >
                      <svg className="w-5 h-5 text-quinary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                    </button>
                  ) : (
                    <Button variant="outline" size="xs" className="px-2 py-1" onClick={() => handleCopyLogin(login)}>Copy</Button>
                  )}
            </div>
            <div className="overflow-x-auto w-full">
              <p className="text-xs sm:text-sm font-mono text-text-secondary break-all whitespace-pre-wrap leading-relaxed min-w-[310px]">
                    {login.login_details}
              </p>
            </div>
          </div>
            ))
          )}
        </div>
      </div>
      {/* Additional Details Modal */}
      <CustomModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={platformName + ' Login Rules / Additional Details'}
        showFooter={false}
        className="max-w-lg"
      >
        <div className="prose max-w-none p-5">
         {parse(he.decode(linkifyHtml(rulesHtml || '<div>No additional rules provided.</div>', 'text-primary')))}
        </div>
      </CustomModal>
    </div>
  );
};

export default OrderConfirmedPage;
