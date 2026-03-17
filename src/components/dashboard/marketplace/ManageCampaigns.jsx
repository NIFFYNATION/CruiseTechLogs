import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiCalendar, FiClock, FiCheckCircle, 
  FiAlertCircle, FiEdit2, FiMoreVertical, FiArrowRight, FiX, FiBriefcase,
  FiTarget, FiMapPin, FiGlobe, FiMousePointer, FiPlus
} from 'react-icons/fi';
import { FaNairaSign } from 'react-icons/fa6';
import { fetchMyCampaigns } from '../../../services/userService';
import Toast from '../../common/Toast';
import { useNavigate } from 'react-router-dom';

const ManageCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [filters, setFilters] = useState({
    s: '',
    status: '',
    platform: '',
    budget_min: '',
    budget_max: '',
    start_date_from: '',
    start_date_to: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async (currentFilters = filters) => {
    setLoading(true);
    const activeFilters = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, v]) => v !== '')
    );
    const res = await fetchMyCampaigns(activeFilters);
    if (res.success) {
      setCampaigns(res.campaigns);
    } else {
      setToast({ show: true, message: res.message, type: 'error' });
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadCampaigns();
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      s: '',
      status: '',
      platform: '',
      budget_min: '',
      budget_max: '',
      start_date_from: '',
      start_date_to: ''
    };
    setFilters(defaultFilters);
    loadCampaigns(defaultFilters);
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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Campaigns</h1>
          <p className="text-gray-500">Manage and track your marketing advertisement bookings.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/marketplace')}
          className="bg-quinary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-quaternary transition-all flex items-center justify-center gap-2"
        >
          <FiPlus /> New Campaign
        </button>
      </div>

      {/* Search and Quick Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            name="s"
            value={filters.s}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && loadCampaigns()}
            placeholder="Search campaigns by name, goal or target..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-quinary/20 outline-none transition-all bg-gray-50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all ${showFilters ? 'bg-quinary text-white border-quinary' : 'bg-white text-gray-600 border-gray-200 hover:border-quinary/50'}`}
          >
            <FiFilter /> Filters
          </button>
          <button 
            onClick={() => loadCampaigns()}
            className="p-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all"
          >
            <FiClock />
          </button>
        </div>
      </div>

      {/* Advanced Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 overflow-hidden"
          >
            <form onSubmit={applyFilters} className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select 
                  name="status"
                  value={filters.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                >
                  <option value="">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
                <select 
                  name="platform"
                  value={filters.platform}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                >
                  <option value="">All Platforms</option>
                  <option value="social_media">Social Media</option>
                  <option value="our_platform">Our Platform</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Min Budget (₦)</label>
                <input 
                  type="number"
                  name="budget_min"
                  value={filters.budget_min}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Max Budget (₦)</label>
                <input 
                  type="number"
                  name="budget_max"
                  value={filters.budget_max}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date From</label>
                <input 
                  type="date"
                  name="start_date_from"
                  value={filters.start_date_from}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date To</label>
                <input 
                  type="date"
                  name="start_date_to"
                  value={filters.start_date_to}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-quinary"
                />
              </div>
              <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
                <button 
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-lg font-bold text-white bg-quinary hover:bg-quaternary transition-all shadow-md shadow-quinary/20"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-64"></div>
          ))
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <motion.div 
              layout
              key={campaign.campaignID}
              onClick={() => navigate(`/dashboard/campaign/${campaign.campaignID}`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{campaign.campaignID}</span>
                    <h3 className="text-lg font-bold text-gray-800">{campaign.businessName}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusColor(campaign.status)}`}>
                    {campaign.status?.replace('_', ' ')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaNairaSign className="text-quinary" />
                    <span className="font-bold">₦{parseFloat(campaign.budget).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-quinary" />
                    <span>{campaign.adsDuration} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="text-quinary" />
                    <span>Starts: {new Date(campaign.preferredStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiTarget className="text-quinary" />
                    <span className="truncate">{campaign.platformType === 'social_media' ? campaign.socialPlatforms?.join(', ') : 'Our Platform'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Created: {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {canEdit(campaign.status) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/campaign/${campaign.campaignID}/edit`);
                        }}
                        className="p-2 rounded-lg bg-gray-50 text-quinary hover:bg-quinary hover:text-white transition-all"
                        title="Edit Campaign"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                    <button 
                      className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
            <div className="p-6 bg-gray-50 rounded-full mb-4">
              <FiTarget className="text-4xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No campaigns found</h3>
            <p className="mb-6">You haven't created any marketing campaigns yet.</p>
            <button 
              onClick={() => navigate('/dashboard/marketplace')}
              className="bg-quinary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-quaternary transition-all"
            >
              Start Your First Campaign
            </button>
          </div>
        )}
      </div>

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

export default ManageCampaigns;
