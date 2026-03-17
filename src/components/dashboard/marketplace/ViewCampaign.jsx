import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiX, FiBriefcase, FiGlobe, FiPhone, FiTarget, FiMapPin, 
  FiMousePointer, FiCalendar, FiClock, 
  FiLink, FiExternalLink, FiBell, FiShield, FiFileText, FiInfo,
  FiArrowLeft, FiEdit2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FaNairaSign } from 'react-icons/fa6';
import { fetchMyCampaigns } from '../../../services/userService';
import Toast from '../../common/Toast';

const ViewCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    const res = await fetchMyCampaigns({ campaignID: id });
    if (res.success && res.campaigns?.length > 0) {
      setCampaign(res.campaigns[0]);
    } else {
      setToast({ show: true, message: res.message || 'Campaign not found.', type: 'error' });
      // If not found, redirect after a short delay
      setTimeout(() => navigate('/dashboard/manage-campaigns'), 2000);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending_review':
      case 'in_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canEdit = (status) => {
    const s = status?.toLowerCase();
    return s === 'pending_review' || s === 'in_review';
  };

  const DetailItem = ({ icon: Icon, label, value, isLink }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <Icon className="text-quinary" /> {label}
      </div>
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-semibold text-quinary hover:underline flex items-center gap-1 break-all"
        >
          {value} <FiExternalLink className="shrink-0" />
        </a>
      ) : (
        <p className="text-sm font-semibold text-gray-800 break-words">
          {value || 'N/A'}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quinary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-500">Loading campaign details...</p>
        {toast.show && <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />}
      </div>
    );
  }

  return (
    <div className="p-2 pt-6 md:p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => navigate('/dashboard/manage-campaigns')}
            className="p-2 md:p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-600 border border-gray-200 shrink-0"
          >
            <FiArrowLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.1em] uppercase truncate">
                #{campaign.campaignID}
              </span>
              <div className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusColor(campaign.status)}`}>
                {campaign.status?.replace('_', ' ')}
              </div>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 truncate">{campaign.businessName}</h1>
          </div>
        </div>
        
        {canEdit(campaign.status) && (
          <button 
            onClick={() => navigate(`/dashboard/campaign/${campaign.campaignID}/edit`)}
            className="w-full md:w-auto bg-quinary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-quaternary transition-all flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiEdit2 size={16} /> Edit Campaign
          </button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-4 md:p-8 space-y-8 md:space-y-10">
          {/* Business Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiBriefcase className="text-quinary" /> Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem icon={FiGlobe} label="Website / Social" value={campaign.businessWebsite} isLink />
              <DetailItem icon={FiPhone} label="Public Contact" value={campaign.contactInfo} />
              <DetailItem icon={FiInfo} label="Business Type" value={campaign.businessType} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <FiFileText className="text-quinary" /> Description
              </div>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                {campaign.businessDescription}
              </p>
            </div>
          </section>

          {/* Strategy Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiTarget className="text-quinary" /> Campaign Strategy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem icon={FiTarget} label="Goal" value={campaign.marketingGoal} />
              <DetailItem icon={FiTarget} label="Target Audience" value={campaign.marketingTarget} />
              <DetailItem icon={FiMapPin} label="Target Location" value={campaign.targetLocation} />
              <DetailItem icon={FiMousePointer} label="Call to Action" value={campaign.cta} />
            </div>
          </section>

          {/* Logistics Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiCalendar className="text-quinary" /> Schedule & Budget
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <DetailItem icon={FiCalendar} label="Start Date" value={new Date(campaign.preferredStartDate).toLocaleDateString()} />
              <DetailItem icon={FiClock} label="Duration" value={`${campaign.adsDuration} Days`} />
              <DetailItem icon={FaNairaSign} label="Budget" value={`₦${parseFloat(campaign.budget).toLocaleString()}`} />
              <DetailItem icon={FiGlobe} label="Platform" value={campaign.platformType === 'social_media' ? campaign.socialPlatforms?.join(', ') : 'Our Platform'} />
            </div>
          </section>

          {/* Materials & Contact Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
                <FiLink className="text-quinary" /> Ads Materials
              </h3>
              <DetailItem icon={FiLink} label="TransferNow Link" value={campaign.transferLink} isLink />
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
                <FiBell className="text-quinary" /> Updates Channel
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {campaign.contactPreference === 'whatsapp' ? <FaWhatsapp className="text-quinary" /> : <FiBell className="text-quinary" />}
                  {campaign.contactPreference?.replace('_', ' ')}
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {campaign.contactPreferenceDetail || 'In-App Notifications'}
                </p>
              </div>
            </div>
          </section>

          {/* Additional Details */}
          {campaign.additionalDetails && (
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
                <FiInfo className="text-quinary" /> Additional Notes
              </h3>
              <p className="text-sm text-gray-600 italic bg-quinary/5 p-5 rounded-2xl border border-quinary/10">
                "{campaign.additionalDetails}"
              </p>
            </section>
          )}

          {/* Compliance Info */}
          <div className="pt-6 flex flex-wrap items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <FiShield className="text-quinary" /> Consent Accepted
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <FiClock className="text-quinary" /> {new Date(campaign.acceptedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default ViewCampaign;
