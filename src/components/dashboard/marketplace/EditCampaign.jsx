import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiEdit2, FiX, FiBriefcase, FiTarget, FiCalendar, 
  FiDollarSign, FiLink, FiExternalLink, FiBell, FiShield, 
  FiFileText, FiInfo, FiAlertCircle, FiMousePointer, FiGlobe, FiMapPin,
  FiMail, FiMessageSquare, FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { fetchMyCampaigns, updateMarketingCampaign } from '../../../services/userService';
import { useUser } from '../../../contexts/UserContext';
import Toast from '../../common/Toast';

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [errors, setErrors] = useState({ transferLink: '' });

  const businessTypes = [
    'E-commerce',
    'SaaS / Software',
    'Real Estate',
    'Education',
    'Health & Wellness',
    'Entertainment',
    'Food & Beverage',
    'Fashion',
    'Finance',
    'Other'
  ];

  const ctaOptions = [
    'Learn More',
    'Shop Now',
    'Sign Up',
    'Contact Us',
    'Get Offer',
    'Download Now',
    'Visit Website',
    'Other'
  ];

  const marketingGoalOptions = [
    'Brand Awareness',
    'Website Traffic',
    'Lead Generation',
    'Sales / Conversion',
    'Social Media Growth (Followers/Likes)',
    'Video Views',
    'App Installs',
    'Event Promotion',
    'Other'
  ];

  const MIN_CAMPAIGN_BUDGET = 50000;
  const transferNowLinkPattern = /^https:\/\/www\.transfernow\.net\/dl\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;
  const transferNowExample = 'https://www.transfernow.net/dl/20260317H6n2yEUp/zrPpnhIM';
  const transferNowErrorMessage = `TransferNow link must look like: ${transferNowExample}`;

  const getTransferLinkError = (input) => {
    if (input?.validity?.valueMissing) return 'Please provide the TransferNow link for ads materials.';
    if (input?.validity?.patternMismatch) return transferNowErrorMessage;
    return '';
  };

  const handleTransferLinkInvalid = (e) => {
    e.preventDefault();
    const message = getTransferLinkError(e.target);
    setErrors(prev => ({ ...prev, transferLink: message }));
    if (message) setToast({ show: true, message, type: 'error' });
  };

  const contactPreferences = [
    { id: 'email', label: 'Email', icon: <FiMail /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp /> },
    { id: 'in_app', label: 'In-App', icon: <FiBell /> }
  ];

  const socialPlatformsList = [
    { name: 'Instagram', icon: '/icons/instagram.svg' },
    { name: 'Facebook', icon: '/icons/facebook.svg' },
    { name: 'TikTok', icon: '/icons/tiktok.svg' }
  ];

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    const res = await fetchMyCampaigns({ campaignID: id });
    if (res.success && res.campaigns?.length > 0) {
      const campaign = res.campaigns[0];
      // Check if editable
      const status = campaign.status?.toLowerCase();
      if (status !== 'pending_review' && status !== 'in_review') {
        setToast({ show: true, message: 'This campaign cannot be edited in its current status.', type: 'error' });
        setTimeout(() => navigate(`/dashboard/campaign/${id}`), 2000);
        return;
      }
      setEditingCampaign(campaign);
    } else {
      setToast({ show: true, message: res.message || 'Campaign not found.', type: 'error' });
      setTimeout(() => navigate('/dashboard/manage-campaigns'), 2000);
    }
    setLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCampaign(prev => ({ ...prev, [name]: value }));
    if (name === 'transferLink' && errors.transferLink) {
      setErrors(prev => ({ ...prev, transferLink: '' }));
    }
  };

  const handlePreferenceSelect = (prefId) => {
    let detail = '';
    if (prefId === 'email') {
      detail = user?.email || '';
    } else if (prefId === 'whatsapp') {
      detail = user?.phone_number || user?.phone || '';
    }
    
    setEditingCampaign(prev => ({ 
      ...prev, 
      contactPreference: prefId,
      contactPreferenceDetail: detail
    }));
  };

  const toggleSocialPlatform = (platform) => {
    setEditingCampaign(prev => {
      const current = prev.socialPlatforms || [];
      if (current.includes(platform)) {
        return { ...prev, socialPlatforms: current.filter(p => p !== platform) };
      } else {
        return { ...prev, socialPlatforms: [...current, platform] };
      }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const budgetValue = Number(editingCampaign.budget);
    if (!Number.isFinite(budgetValue) || budgetValue < MIN_CAMPAIGN_BUDGET) {
      setToast({ show: true, message: `Minimum campaign budget is ₦${MIN_CAMPAIGN_BUDGET.toLocaleString()}.`, type: 'error' });
      return;
    }

    if (!transferNowLinkPattern.test((editingCampaign.transferLink || '').trim())) {
      setErrors(prev => ({ ...prev, transferLink: transferNowErrorMessage }));
      setToast({ show: true, message: transferNowErrorMessage, type: 'error' });
      return;
    }

    setUpdateLoading(true);
    const res = await updateMarketingCampaign(editingCampaign);
    if (res.success) {
      setToast({ show: true, message: 'Campaign updated successfully!', type: 'success' });
      setTimeout(() => navigate(`/dashboard/campaign/${id}`), 2000);
    } else {
      setToast({ show: true, message: res.message, type: 'error' });
    }
    setUpdateLoading(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quinary"></div>
      </div>
    );
  }

  if (!editingCampaign) return null;

  return (
    <div className="p-2 pt-6 md:p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(`/dashboard/campaign/${id}`)}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-600 border border-gray-200"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Edit Campaign</h1>
          <p className="text-gray-500 text-sm">Update details for #{editingCampaign.campaignID}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <form onSubmit={handleUpdate} className="p-4 md:p-8 space-y-10">
          {/* Section 1: Identity */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiBriefcase className="text-quinary" /> Business Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Name</label>
                <input 
                  type="text"
                  name="businessName"
                  value={editingCampaign.businessName}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Website / Social Link</label>
                <input 
                  type="url"
                  name="businessWebsite"
                  value={editingCampaign.businessWebsite}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</label>
                <input 
                  type="text"
                  name="contactInfo"
                  value={editingCampaign.contactInfo}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Type</label>
                <select 
                  name="businessType"
                  value={editingCampaign.businessType}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50 appearance-none"
                  required
                >
                  {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea 
                name="businessDescription"
                value={editingCampaign.businessDescription}
                onChange={handleEditChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50 resize-none"
                required
              />
            </div>
          </div>

          {/* Section 2: Strategy */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiTarget className="text-quinary" /> Campaign Strategy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Goal</label>
                <select 
                  name="marketingGoal"
                  value={editingCampaign.marketingGoal}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50 appearance-none"
                  required
                >
                  <option value="">Select a goal</option>
                  {marketingGoalOptions.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Audience</label>
                <input 
                  type="text"
                  name="marketingTarget"
                  value={editingCampaign.marketingTarget}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Location</label>
                <input 
                  type="text"
                  name="targetLocation"
                  value={editingCampaign.targetLocation}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call to Action</label>
                <select 
                  name="cta"
                  value={editingCampaign.cta}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50 appearance-none"
                  required
                >
                  {ctaOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Logistics */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiCalendar className="text-quinary" /> Schedule & Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                <input 
                  type="date"
                  name="preferredStartDate"
                  value={editingCampaign.preferredStartDate}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (Days)</label>
                <input 
                  type="number"
                  name="adsDuration"
                  value={editingCampaign.adsDuration}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                  <input 
                    type="number"
                    name="budget"
                    value={editingCampaign.budget}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                    required
                    min="50000"
                    step="1000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setEditingCampaign({...editingCampaign, platformType: 'social_media'})}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${editingCampaign.platformType === 'social_media' ? 'border-quinary bg-quinary/5 text-quinary' : 'border-gray-100 text-gray-400'}`}
                  >
                    Social Media
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingCampaign({...editingCampaign, platformType: 'our_platform', socialPlatforms: []})}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${editingCampaign.platformType === 'our_platform' ? 'border-quinary bg-quinary/5 text-quinary' : 'border-gray-100 text-gray-400'}`}
                  >
                    Our Platform
                  </button>
                </div>
              </div>
            </div>

            {editingCampaign.platformType === 'social_media' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {socialPlatformsList.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => toggleSocialPlatform(p.name)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${editingCampaign.socialPlatforms?.includes(p.name) ? 'bg-quinary text-white border-quinary' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Materials & Communication */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-100">
              <FiLink className="text-quinary" /> Materials & Updates
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TransferNow Link (Ads Materials)</label>
                  <a 
                    href="https://www.transfernow.net/en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-quinary hover:underline flex items-center gap-1"
                  >
                    Go to TransferNow <FiExternalLink size={10} />
                  </a>
                </div>
                <input 
                  type="url"
                  name="transferLink"
                  value={editingCampaign.transferLink}
                  onChange={handleEditChange}
                  onInvalid={handleTransferLinkInvalid}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-gray-50/50 ${errors.transferLink ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary'}`}
                  placeholder={transferNowExample}
                  required
                  pattern="https://www\.transfernow\.net/dl/[A-Za-z0-9]+/[A-Za-z0-9]+"
                  title={`Use a TransferNow download link like: ${transferNowExample}`}
                  aria-invalid={!!errors.transferLink}
                  aria-describedby={errors.transferLink ? 'editTransferLinkError' : undefined}
                />
                {errors.transferLink && (
                  <p id="editTransferLinkError" className="text-xs font-semibold text-red-600">
                    {errors.transferLink}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Communication Preference</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {contactPreferences.map(pref => (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => handlePreferenceSelect(pref.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${
                        editingCampaign.contactPreference === pref.id 
                        ? 'border-quinary bg-quinary/5 text-quinary' 
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-lg">{pref.icon}</span>
                      <span className="text-[9px] font-bold uppercase">{pref.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {editingCampaign.contactPreference && editingCampaign.contactPreference !== 'in_app' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider capitalize">
                    {editingCampaign.contactPreference.replace('_', ' ')} Detail
                  </label>
                  <input 
                    type="text"
                    name="contactPreferenceDetail"
                    value={editingCampaign.contactPreferenceDetail}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Details</label>
                <textarea 
                  name="additionalDetails"
                  value={editingCampaign.additionalDetails}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all bg-gray-50/50 resize-none"
                  placeholder="Any other specific instructions..."
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4 items-start">
            <FiAlertCircle className="text-yellow-600 mt-1 shrink-0" size={20} />
            <p className="text-sm text-yellow-700 leading-relaxed font-medium">
              Note: Changes will be reviewed by our team. Campaigns can only be updated while they are in "Pending Review" or "In Review" status.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => navigate(`/dashboard/campaign/${id}`)}
              className="px-10 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={updateLoading}
              className="px-10 py-4 rounded-2xl font-bold text-white bg-quinary hover:bg-quaternary shadow-xl shadow-quinary/20 transition-all flex items-center gap-2"
            >
              {updateLoading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
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

export default EditCampaign;
