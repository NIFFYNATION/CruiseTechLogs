import React, { useState, useEffect } from 'react';
import { FaCopy, FaShare, FaQrcode, FaUsers, FaChartLine } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useUser } from '../../contexts/UserContext';
import { fetchReferralStats, fetchReferrals, fetchReferralSettings, transferReferralBalance } from '../../services/referralService';

const ReferralPage = () => {
  const { user, loading } = useUser();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [referralBalance, setReferralBalance] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Referral settings from API
  const [referralSettings, setReferralSettings] = useState({
    min_deposit: 20000,
    earnings_percent: 0.5,
    min_withdraw_to_balance: 5000
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  
  // Use settings from API or fallback to defaults
  const MIN_TRANSFER_AMOUNT = referralSettings.min_withdraw_to_balance;
  const EARNINGS_PERCENT = referralSettings.earnings_percent;
  const MIN_DEPOSIT_REQUIREMENT = referralSettings.min_deposit;

  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    referralBalance: 0
  });

  const [dateFilter, setDateFilter] = useState('all');
  const [filteredReferrals, setFilteredReferrals] = useState([]);

  useEffect(() => {
    // Get referral code from UserContext
    if (user && user.referral_code) {
      setReferralCode(user.referral_code);
    }
  }, [user]);

  useEffect(() => {
    if (referralCode) {
      // Generate referral link
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/signup/${referralCode}`);
      
      // Fetch referral data and settings
      fetchReferralData();
      fetchSettings();
    }
     }, [referralCode]);

  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true);
      setSettingsError(null);
      const response = await fetchReferralSettings();
      if (response.code === 200 && response.data) {
        setReferralSettings({
          min_deposit: parseFloat(response.data.min_deposit || 20000),
          earnings_percent: parseFloat(response.data.earnings_percent || 0.5),
          min_withdraw_to_balance: parseFloat(response.data.min_withdraw_to_balance || 5000)
        });
      }
    } catch (error) {
       console.error('Error fetching referral settings:', error);
       setSettingsError('Failed to load referral settings. Using default values.');
       // Keep default values on error
     } finally {
       setIsLoadingSettings(false);
     }
   };

  const fetchReferralData = async () => {
    try {
      // Fetch referral stats
      const statsResponse = await fetchReferralStats();
      if (statsResponse.code === 200 && statsResponse.data) {
        const statsData = {
          totalReferrals: statsResponse.data.total_referrals || 0,
          totalEarnings: parseFloat(statsResponse.data.total_amount || 0),
          referralBalance: parseFloat(statsResponse.data.referral_balance || 0)
        };
        setStats(statsData);
        setTotalEarnings(statsData.totalEarnings);
        setReferralBalance(statsData.referralBalance);
      }

      // Fetch referrals list
      const referralsResponse = await fetchReferrals(0, 100);
      if (referralsResponse.code === 200 && referralsResponse.data && referralsResponse.data.referrals) {
        const formattedReferrals = referralsResponse.data.referrals.map(referral => ({
          id: referral.ID,
          email: `${referral.first_name} ${referral.last_name}`,
          joinDate: referral.date,
          deposits: 0, // This might need another API endpoint
          earnings: parseFloat(referral.amount_earned || 0),
          status: 'Active'
        }));
        setReferrals(formattedReferrals);
        setFilteredReferrals(formattedReferrals);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      // Fallback to empty data on error
      setStats({ totalReferrals: 0, totalEarnings: 0, referralBalance: 0 });
      setTotalEarnings(0);
      setReferralBalance(0);
      setReferrals([]);
      setFilteredReferrals([]);
    }
  };

  const handleTransfer = async () => {
    if (referralBalance < MIN_TRANSFER_AMOUNT || isTransferring) {
      return;
    }

    setIsTransferring(true);
    try {
      const response = await transferReferralBalance();
      
      if (response.code === 200 && response.status === "success") {
        // Success case
        alert(response.message || `Successfully transferred ₦${referralBalance.toFixed(2)} to your main balance!`);
        setReferralBalance(0);
        setStats(prev => ({ ...prev, referralBalance: 0 }));
      } else {
        // API returned an error
        alert(response.message || 'Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Error transferring funds:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  // Filter referrals based on date
  const filterReferralsByDate = (referrals, filter) => {
    if (filter === 'all') return referrals;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (filter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        return referrals.filter(ref => new Date(ref.date) >= filterDate);
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        return referrals.filter(ref => new Date(ref.date) >= filterDate);
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        return referrals.filter(ref => new Date(ref.date) >= filterDate);
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        return referrals.filter(ref => new Date(ref.date) >= filterDate);
      default:
        return referrals;
    }
  };

  // Update filtered referrals when date filter changes
   useEffect(() => {
     const filtered = filterReferralsByDate(referrals, dateFilter);
     setFilteredReferrals(filtered);
   }, [referrals, dateFilter]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join CruiseTechLogs',
        text: `Use my referral code: ${referralCode}`,
        url: referralLink
      });
    } else {
      copyToClipboard(referralLink, 'Referral link');
    }
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-text-grey">Loading referral data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Referral Program</h1>
          {isLoadingSettings ? (
            <p className="text-text-grey">Loading referral settings...</p>
          ) : (
            <p className="text-text-grey">Earn {EARNINGS_PERCENT}% on every deposit made by your referrals</p>
          )}
          {settingsError && (
            <p className="text-warning text-sm mt-1">{settingsError}</p>
          )}
        </div>

        {/* Stats Overview */}
        {stats.totalReferrals > 0 && (
        <>
          {/* Combined Card for Mobile */}
          <div className="md:hidden mb-6">
            <div className="group bg-background/90 backdrop-blur-xl rounded-[18px] border border-primary/20 shadow-[0_8px_32px_rgba(11,75,90,0.12)] p-4 relative overflow-hidden hover:shadow-[0_12px_40px_rgba(11,75,90,0.18)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-primary">Referral Overview</h3>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Combined Referrals & Lifetime Earnings */}
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/10">
                        <FaUsers className="text-primary text-sm" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-text-grey mb-1">Referrals</p>
                    <p className="text-lg font-bold text-text-primary mb-1">{stats.totalReferrals}</p>
                    <div className="flex items-center justify-center space-x-1">
                      <FaChartLine className="text-warning text-xs" />
                      <p className="text-xs font-medium text-warning">₦{totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Available Balance with Transfer */}
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-success/10 rounded-lg border border-success/10">
                        <span className="text-success text-sm font-bold">₦</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-text-grey mb-1">Available Balance</p>
                    <p className="text-lg font-bold text-success mb-2">₦{referralBalance.toFixed(2)}</p>
                    <button
                      onClick={() => handleTransfer()}
                      disabled={referralBalance < MIN_TRANSFER_AMOUNT || isTransferring}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        referralBalance >= MIN_TRANSFER_AMOUNT && !isTransferring
                          ? 'bg-success text-white hover:bg-success/90 hover:scale-105'
                          : 'bg-text-grey/20 text-text-grey cursor-not-allowed'
                      }`}
                    >
                      {isTransferring ? 'Transferring...' : 'Transfer'}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="h-1 w-8 bg-primary rounded-full"></div>
                    <span className="text-xs text-primary font-medium">Active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                      <div className="h-1 w-8 bg-success rounded-full"></div>
                      <span className="text-xs text-success font-medium">+{EARNINGS_PERCENT}%</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Separate Cards for Desktop */}
          <div className="hidden md:grid grid-cols-2 gap-6 mb-8">
            {/* Combined Referrals & Lifetime Earnings Card */}
            <div className="group bg-background/90 backdrop-blur-xl rounded-[18px] border border-primary/20 shadow-[0_8px_32px_rgba(11,75,90,0.12)] p-6 relative overflow-hidden hover:shadow-[0_12px_40px_rgba(11,75,90,0.18)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-xl border border-primary/10 group-hover:bg-primary/15 transition-all duration-300">
                    <FaUsers className="text-primary text-xl group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-grey mb-1 group-hover:text-text-primary/80 transition-colors duration-300">Total Referrals</p>
                  <p className="text-3xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300 mb-3">{stats.totalReferrals}</p>
                  
                  {/* Lifetime Earnings Section */}
                  <div className="border-t border-border-grey/20 pt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-2 bg-warning/10 rounded-lg border border-warning/10">
                        <FaChartLine className="text-warning text-sm" />
                      </div>
                      <p className="text-sm font-medium text-text-grey">Lifetime Earnings</p>
                    </div>
                    <p className="text-xl font-bold text-warning">₦{totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Available Balance Card with Transfer */}
            <div className="group bg-background/90 backdrop-blur-xl rounded-[18px] border border-success/20 shadow-[0_8px_32px_rgba(34,197,94,0.12)] p-6 relative overflow-hidden hover:shadow-[0_12px_40px_rgba(34,197,94,0.18)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-success/10 rounded-xl border border-success/10 group-hover:bg-success/15 transition-all duration-300">
                    <span className="text-success text-xl font-bold group-hover:scale-110 transition-transform duration-300">₦</span>
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-grey mb-1 group-hover:text-text-primary/80 transition-colors duration-300">Available Balance</p>
                  <p className="text-3xl font-bold text-success group-hover:scale-105 transition-transform duration-300 mb-4">₦{referralBalance.toFixed(2)}</p>
                  
                  {/* Transfer Button */}
                  <button
                    onClick={() => handleTransfer()}
                    disabled={referralBalance < MIN_TRANSFER_AMOUNT || isTransferring}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      referralBalance >= MIN_TRANSFER_AMOUNT && !isTransferring
                        ? 'bg-success text-white hover:bg-success/90 hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-text-grey/20 text-text-grey cursor-not-allowed'
                    }`}
                  >
                    {isTransferring ? 'Transferring...' : `Transfer to Main Balance`}
                  </button>
                  
                  {referralBalance < MIN_TRANSFER_AMOUNT && (
                    <p className="text-xs text-text-grey mt-2 text-center">
                      Minimum transfer: ₦{MIN_TRANSFER_AMOUNT.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Referral Sharing Section */}
          <div className="bg-background rounded-2xl p-3 md:p-8 relative overflow-hidden h-full">
            <div className="relative z-10 h-full flex flex-col">
            
            
              {/* Referral Code & Link Combined */}
              <div className="mb-6 flex-1">
                <div className="rounded-[20px] relative overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FFB347] p-4 md:p-6 shadow-lg" style={{
                  background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
                  backgroundSize: "cover",
                }}>
                  {/* <h3 className="text-lg md:text-xl font-bold text-white text-center mb-4">Your Referral Details</h3> */}
                  
                  {/* Referral Code */}
                   <div className="space-y-2 mb-4">
                     <label className="block text-sm font-medium text-white/70 uppercase tracking-wide">Referral Code</label>
                     <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex items-center justify-between">
                       <span className="text-lg md:text-xl font-mono font-bold text-[#1A1A1A] break-all flex-1">{referralCode}</span>
                       <button
                         onClick={() => copyToClipboard(referralCode, 'Referral code')}
                         className="ml-2 p-2 bg-white hover:bg-white/90 text-[#1A1A1A] rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                         title="Copy Code"
                       >
                         <FaCopy className="text-sm" />
                       </button>
                     </div>
                   </div>

                   {/* Divider */}
                   <div className="border-t border-white/20 mb-4"></div>

                   {/* Referral Link */}
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-white/70 uppercase tracking-wide">Referral Link</label>
                     <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-[#1A1A1A] break-all font-medium flex-1 mr-2">{referralLink}</span>
                         <button
                           onClick={() => copyToClipboard(referralLink, 'Referral link')}
                           className="p-2 bg-white hover:bg-white/90 text-[#1A1A1A] rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                           title="Copy Link"
                         >
                           <FaCopy className="text-sm" />
                         </button>
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* QR Code - Compact Design */}
              <div className="mb-6">
                <div className="text-center">
                  <div className="inline-block relative group">
                    {/* QR Code Container with White Background */}
                    <div className="relative bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <p className="text-sm font-medium text-[#1A1A1A]/70 mb-3 uppercase tracking-wide text-center">Scan QR Code</p>
                      {/* QR Code with custom styling */}
                      <div className="relative bg-white p-3 rounded-xl shadow-inner border border-[#1A1A1A]/5">
                        <QRCodeSVG 
                          value={referralLink} 
                          size={window.innerWidth < 768 ? 100 : 120} 
                          bgColor="#ffffff"
                          fgColor="#FF6B00"
                          level="M"
                        />
                      </div>
                      <p className="text-xs text-[#1A1A1A]/60 mt-3">Scan to join</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={shareReferral}
                  className="bg-white hover:bg-white/90 text-[#1A1A1A] px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group mx-auto w-full sm:w-auto"
                >
                  <FaShare className="text-sm group-hover:scale-110 transition-transform" />
                  <span>Share Referral</span>
                </button>
              </div>


            </div>
          </div>

          {/* Referral Rules Section */}
          <div className="bg-background/80 backdrop-blur-md rounded-[15px] border-b-primary border-b-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-4 md:mb-6">Referral Rules</h2>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs md:text-sm font-bold">1</span>
                </div>
                <div>
                    <h3 className="font-medium text-text-primary text-sm md:text-base">Minimum Deposit Requirement</h3>
                    <p className="text-text-grey text-xs md:text-sm">Your referrals must deposit at least ₦{MIN_DEPOSIT_REQUIREMENT.toLocaleString()} for you to earn commission</p>
                  </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-success text-xs md:text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm md:text-base">Earnings Rate</h3>
                  <p className="text-text-grey text-xs md:text-sm">Earn {EARNINGS_PERCENT}% on all subsequent deposits made by your referred users.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-quaternary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-quaternary text-xs md:text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm md:text-base">Referral Balance</h3>
                  <p className="text-text-grey text-xs md:text-sm">Earnings are credited to your separate referral balance, not your main account balance.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-warning text-xs md:text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm md:text-base">Transfer Requirements</h3>
                  <p className="text-text-grey text-xs md:text-sm">Minimum transfer amount is ₦{MIN_TRANSFER_AMOUNT.toLocaleString()} to move funds to your main balance.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                 <div className="w-5 h-5 md:w-6 md:h-6 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                   <span className="text-error text-xs md:text-sm font-bold">5</span>
                 </div>
                 <div>
                   <h3 className="font-medium text-text-primary text-sm md:text-base">Usage Restriction</h3>
                   <p className="text-text-grey text-xs md:text-sm">Referral earnings can only be used for website purchases and services.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-xs md:text-sm text-warning">
                <strong>Important:</strong> We do not support fraud and are not responsible for bought product misuse.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Tracking Dashboard */}
        {stats.totalReferrals > 0 && (
        <div className="mt-8 bg-background/80 backdrop-blur-md rounded-[15px] border-b-primary border-b-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="p-4 md:p-6 border-b border-border-grey">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-text-primary">Referral Tracking</h2>
                <p className="text-text-grey text-xs md:text-sm mt-1">Monitor your referrals and earnings</p>
              </div>
              
              {/* Date Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-text-grey">Filter by:</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 bg-background border border-border-grey rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">User</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider hidden sm:table-cell">Join Date</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider hidden lg:table-cell">Total Deposits</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Earnings</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-background/50 divide-y divide-border-grey">
                {filteredReferrals.length > 0 ? (
                  filteredReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-background-alt/50">
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="text-xs md:text-sm font-medium text-text-primary truncate">{referral.email}</div>
                        <div className="text-xs text-text-grey sm:hidden">{new Date(referral.joinDate).toLocaleDateString()}</div>
                        <div className="text-xs text-text-grey lg:hidden">₦{referral.deposits.toLocaleString()}</div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-xs md:text-sm text-text-grey">{new Date(referral.joinDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-xs md:text-sm font-medium text-text-primary">₦{referral.deposits.toLocaleString()}</div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="text-xs md:text-sm font-medium text-success">₦{referral.earnings.toFixed(2)}</div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 md:px-6 py-6 md:py-8 text-center text-text-grey">
                      <div className="flex flex-col items-center">
                        <FaUsers className="text-2xl md:text-4xl text-text-grey/50 mb-2" />
                        <p className="text-sm md:text-base">No referrals yet</p>
                        <p className="text-xs md:text-sm">Start sharing your referral code to see results here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;