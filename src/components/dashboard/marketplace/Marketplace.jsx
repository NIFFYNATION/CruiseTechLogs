import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiTarget, FiCalendar, FiLink, FiInfo, FiExternalLink, FiPlus, FiGlobe, FiMapPin, FiMousePointer, FiPhone, FiMail, FiMessageSquare, FiBell, FiCheckSquare, FiSquare, FiFileText, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FaNairaSign } from 'react-icons/fa6';
import Toast from '../../common/Toast';
import { createMarketingCampaign } from '../../../services/userService';

const Marketplace = () => {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: '',
    businessWebsite: '',
    marketingGoal: '',
    marketingTarget: '',
    targetLocation: '',
    cta: '',
    preferredStartDate: '',
    contactInfo: '',
    platformType: '', // 'social_media' or 'our_platform'
    socialPlatforms: [],
    adsDuration: '',
    budget: '',
    additionalDetails: '',
    transferLink: '',
    contactPreference: '', // email, sms, phone, in_app, whatsapp
    contactPreferenceDetail: '', // the actual email/phone
    termsAccepted: false
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ transferLink: '' });

  const contactPreferences = [
    { id: 'email', label: 'Email', icon: <FiMail /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp /> },
    { id: 'in_app', label: 'In-App', icon: <FiBell /> }
  ];

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

  const socialPlatformsList = [
    { name: 'Instagram', icon: '/icons/instagram.svg' },
    { name: 'Facebook', icon: '/icons/facebook.svg' },
    { name: 'TikTok', icon: '/icons/tiktok.svg' }
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
  const transferNowExample = 'https://www.transfernow.net/dl/20260317Ou78/opipnhIM';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'transferLink' && errors.transferLink) {
      setErrors(prev => ({ ...prev, transferLink: '' }));
    }
  };

  const toggleSocialPlatform = (platform) => {
    setFormData(prev => {
      const current = prev.socialPlatforms;
      if (current.includes(platform)) {
        return { ...prev, socialPlatforms: current.filter(p => p !== platform) };
      } else {
        return { ...prev, socialPlatforms: [...current, platform] };
      }
    });
  };

  const handlePreferenceSelect = (prefId) => {
    let detail = '';
    if (prefId === 'email') {
      detail = user?.email || '';
    } else if (prefId === 'whatsapp') {
      detail = user?.phone_number || user?.phone || '';
    }
    
    setFormData(prev => ({ 
      ...prev, 
      contactPreference: prefId,
      contactPreferenceDetail: detail
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const budgetValue = Number(formData.budget);
    if (!Number.isFinite(budgetValue) || budgetValue < MIN_CAMPAIGN_BUDGET) {
      setToast({ show: true, message: `Minimum campaign budget is ₦${MIN_CAMPAIGN_BUDGET.toLocaleString()}.`, type: 'error' });
      return;
    }

    if (budgetValue > (user?.balance || 0)) {
      setToast({ show: true, message: 'Insufficient balance for this budget.', type: 'error' });
      return;
    }

    if (!formData.transferLink) {
      setErrors(prev => ({ ...prev, transferLink: 'Please provide the TransferNow link for ads materials.' }));
      setToast({ show: true, message: 'Please provide the TransferNow link for ads materials.', type: 'error' });
      return;
    }

    if (!transferNowLinkPattern.test(formData.transferLink.trim())) {
      setErrors(prev => ({ ...prev, transferLink: transferNowErrorMessage }));
      setToast({ show: true, message: transferNowErrorMessage, type: 'error' });
      return;
    }

    if (!formData.contactPreference) {
      setToast({ show: true, message: 'Please select a contact preference.', type: 'error' });
      return;
    }

    if (formData.contactPreference !== 'in_app' && !formData.contactPreferenceDetail) {
      setToast({ show: true, message: 'Please provide your contact details.', type: 'error' });
      return;
    }

    if (!formData.termsAccepted) {
      setToast({ show: true, message: 'Please accept the marketing terms and conditions.', type: 'error' });
      return;
    }

    setLoading(true);
    
    const payload = {
      ...formData,
      transferLink: formData.transferLink.trim(),
      acceptedAt: new Date().toISOString()
    };

    const res = await createMarketingCampaign(payload);

    if (res.success) {
      setToast({ show: true, message: 'Advertisement booking submitted successfully!', type: 'success' });
      // Redirect to the campaigns management page
      setTimeout(() => {
        navigate('/dashboard/manage-campaigns');
      }, 2000);
    } else {
      setToast({ show: true, message: res.message || 'Failed to submit campaign.', type: 'error' });
    }
    
    setLoading(false);
  };

  if (userLoading) return null;

  return (
    <div className="p-2 pt-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Marketplace</h1>
          <p className="text-gray-600">Book your advertisement campaign and reach your target audience.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8">
          {/* Business Identity Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FiBriefcase className="text-quinary" /> Business Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Business Website / Social Link</label>
                <input
                  type="url"
                  name="businessWebsite"
                  value={formData.businessWebsite}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Contact Phone / Email (Public)</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Where should customers reach you?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Business Description</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                placeholder="Briefly describe your business..."
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Campaign Strategy Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FiTarget className="text-quinary" /> Campaign Strategy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Campaign Goal</label>
                <select 
                  name="marketingGoal"
                  value={formData.marketingGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select a goal</option>
                  {marketingGoalOptions.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Target Audience</label>
                <input
                  type="text"
                  name="marketingTarget"
                  value={formData.marketingTarget}
                  onChange={handleInputChange}
                  placeholder="e.g. Tech enthusiasts, Age 18-35"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Target Location</label>
                <input
                  type="text"
                  name="targetLocation"
                  value={formData.targetLocation}
                  onChange={handleInputChange}
                  placeholder="e.g. Nigeria, USA, Worldwide"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Call to Action (CTA)</label>
                <select
                  name="cta"
                  value={formData.cta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select CTA</option>
                  {ctaOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preferred Start Date</label>
                <input
                  type="date"
                  name="preferredStartDate"
                  value={formData.preferredStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ads Duration (in days)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="adsDuration"
                    value={formData.adsDuration}
                    onChange={handleInputChange}
                    placeholder="e.g. 7"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                    required
                    min="1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Days</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700">Marketing Platform</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, platformType: 'social_media' }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${
                    formData.platformType === 'social_media' 
                    ? 'border-quinary bg-quinary/5' 
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="font-bold text-gray-800">Option 1: Social Media</span>
                  <span className="text-xs text-gray-500">Promote on Instagram, Facebook, or TikTok.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, platformType: 'our_platform', socialPlatforms: [] }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${
                    formData.platformType === 'our_platform' 
                    ? 'border-quinary bg-quinary/5' 
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="font-bold text-gray-800">Option 2: Our Platform</span>
                  <span className="text-xs text-gray-500">Reach users directly on CruiseTech.</span>
                </button>
              </div>
            </div>

            {formData.platformType === 'social_media' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 overflow-hidden"
              >
                <label className="block text-sm font-semibold text-gray-700">Select Platforms</label>
                <div className="flex flex-wrap gap-3">
                  {socialPlatformsList.map(platform => (
                    <button
                      key={platform.name}
                      type="button"
                      onClick={() => toggleSocialPlatform(platform.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        formData.socialPlatforms.includes(platform.name)
                        ? 'bg-quinary text-white border-quinary'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-quinary/50'
                      }`}
                    >
                      <img src={platform.icon} alt="" className="w-4 h-4 brightness-0 invert" style={{ display: formData.socialPlatforms.includes(platform.name) ? 'block' : 'none' }} />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Campaign Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="50000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                  min="50000"
                  step="1000"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-gray-400">Minimum budget: ₦{MIN_CAMPAIGN_BUDGET.toLocaleString()}.</span>
                <span className={`text-xs font-bold ${parseFloat(formData.budget) > (user?.balance || 0) ? 'text-red-500' : 'text-green-500'}`}>
                  Balance: ₦{(user?.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Additional Details</label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="Any other specific requirements..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Campaign Updates Section (Moved here) */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FiBell className="text-quinary" /> Updates & Communication
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                How would you like to receive performance updates?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {contactPreferences.map(pref => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => handlePreferenceSelect(pref.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${
                      formData.contactPreference === pref.id 
                      ? 'border-quinary bg-quinary/5 text-quinary' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-500'
                    }`}
                  >
                    <span className="text-xl">{pref.icon}</span>
                    <span className="text-[10px] font-bold">{pref.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.contactPreference && formData.contactPreference !== 'in_app' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700 capitalize">
                  {formData.contactPreference.replace('_', ' ')} Details
                </label>
                <input
                  type={formData.contactPreference === 'email' ? 'email' : 'text'}
                  name="contactPreferenceDetail"
                  value={formData.contactPreferenceDetail}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${formData.contactPreference.replace('_', ' ')} details...`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary outline-none transition-all"
                  required
                />
              </motion.div>
            )}
          </div>

          {/* Material Upload Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FiLink className="text-quinary" /> Ads Materials
            </h2>
            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FiLink className="text-quinary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Upload Creative Assets</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Please upload your banners, videos, or creative assets to TransferNow and provide the link below.</p>
                </div>
              </div>
              
              <a 
                href="https://www.transfernow.net/en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-quinary hover:underline"
              >
                Go to TransferNow.com <FiExternalLink />
              </a>

              <input
                type="url"
                name="transferLink"
                value={formData.transferLink}
                onChange={handleInputChange}
                onInvalid={handleTransferLinkInvalid}
                placeholder={transferNowExample}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-white ${errors.transferLink ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-quinary/20 focus:border-quinary'}`}
                required
                pattern="https://www\.transfernow\.net/dl/[A-Za-z0-9]+/[A-Za-z0-9]+"
                title={`Use a TransferNow download link like: ${transferNowExample}`}
                aria-invalid={!!errors.transferLink}
                aria-describedby={errors.transferLink ? 'transferLinkError' : undefined}
              />
              {errors.transferLink && (
                <p id="transferLinkError" className="text-xs font-semibold text-red-600">
                  {errors.transferLink}
                </p>
              )}
            </div>
          </div>

          {/* Terms & Policy Section (Consolidated here) */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FiShield className="text-quinary" /> Terms & Policy
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-h-80 overflow-y-auto space-y-4 text-sm text-gray-600 leading-relaxed custom-scrollbar">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiFileText /> 1. Overview of Marketing Feature
              </h3>
              <p>
                By accessing the Marketplace and utilizing our marketing features, you agree to comply with these Terms and Conditions. Our platform provides tools for businesses to promote their services both within our ecosystem and across external social media platforms.
              </p>

              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiInfo /> 2. Content Guidelines & Materials
              </h3>
              <p>
                You are responsible for all advertising materials provided via TransferNow or any other medium. All content must comply with our community guidelines and the policies of the specific platforms (Instagram, Facebook, TikTok, etc.) where ads are being placed.
              </p>
              <p>
                We reserve the right to reject any advertising material that we deem inappropriate, misleading, or in violation of local laws. Content promoting illegal activities, hate speech, or explicit adult material is strictly prohibited.
              </p>

              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaNairaSign /> 3. Payments and Budgets
              </h3>
              <p>
                Ad campaign budgets must be covered by your available wallet balance. Once a campaign is submitted and approved, the corresponding budget will be deducted. Campaigns are non-refundable once they have been initiated.
              </p>
              <p>
                In case of campaign rejection due to policy violations, the budget may be partially refunded after deducting administrative fees.
              </p>

              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiBell /> 4. Performance & Delivery
              </h3>
              <p>
                While we strive for maximum reach, we do not guarantee specific conversion rates or sales figures. Delivery times may vary based on platform approvals and target audience availability.
              </p>

              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiShield /> 5. Compliance & Audit
              </h3>
              <p>
                We maintain detailed audit trails of all campaign activities, user consents, and communication logs. This data is used for performance tracking and regulatory compliance. By proceeding, you consent to this data collection as per our Privacy Policy.
              </p>

              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiInfo /> 6. Additional Communications
              </h3>
              <p>
                Additional details regarding your campaign performance, optimization tips, and platform updates will be communicated to you as they become available via your selected preference.
              </p>
            </div>

            <div 
              className="flex items-start gap-3 cursor-pointer group select-none"
              onClick={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
            >
              <div className={`mt-0.5 text-xl transition-colors ${formData.termsAccepted ? 'text-quinary' : 'text-gray-300 group-hover:text-gray-400'}`}>
                {formData.termsAccepted ? <FiCheckSquare /> : <FiSquare />}
              </div>
              <p className="text-sm text-gray-600">
                I have read and agree to the Marketing Terms and Conditions. I understand that my selected contact method will be used for future communications regarding my ad campaigns.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-quinary hover:bg-quaternary hover:shadow-quinary/20'
            }`}
          >
            {loading ? 'Submitting Campaign...' : 'Confirm Ad Booking'}
          </button>
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

export default Marketplace;
