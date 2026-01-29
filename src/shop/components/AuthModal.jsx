import React, { useState, useEffect, useRef } from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import CustomModal from '../../components/common/CustomModal';
import InputField from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { MdEmail, MdPerson } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { loginController, signupController, forgetPasswordController, resetPasswordController } from '../../controllers/authController';
import { useUser } from '../../contexts/UserContext';
import { triggerRentalCronjob } from '../../services/rentalService';
import OtpInput from '../../components/common/OtpInput';

const AuthModal = () => {
  const { isOpen, view, setView, closeModal, handleSuccess } = useAuthModal();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot/Reset Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [resetData, setResetData] = useState({ password: '', confirm: '' });
  const [strength, setStrength] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimer = useRef(null);

  // Clear state on open/close
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setLoginData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '', referralCode: '' });
      setForgotEmail('');
      setOtp(['', '', '', '', '']);
      setResetData({ password: '', confirm: '' });
      setStrength(0);
    }
  }, [isOpen]);

  // Password strength checker
  const checkStrength = (pass) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginController(loginData);
      
      const userData = {
        name: (response.data.first_name && response.data.last_name)
          ? `${response.data.first_name} ${response.data.last_name}`
          : (response.data.fullName || 'User'),
        email: response.data.email || '',
        avatar: response.data.profile_image
          ? response.data.profile_image
          : (response.data.avatar || '/icons/female.svg'),
        stage: response.data.stage || { name: 'Level 1' },
        percentage: typeof response.data.percentage === 'number' ? response.data.percentage : 0,
        ...response.data,
      };
      setUser(userData);
      
      if (response.data.userID || response.data.id) {
        triggerRentalCronjob(response.data.userID || response.data.id);
      }
      
      handleSuccess(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await signupController(registerData);
      
      if (response.data && response.data.token && response.data.ID) {
         const userData = {
          name: (response.data.first_name && response.data.last_name)
            ? `${response.data.first_name} ${response.data.last_name}`
            : (response.data.fullName || 'User'),
          email: response.data.email || '',
          avatar: response.data.profile_image
            ? response.data.profile_image
            : (response.data.avatar || '/icons/female.svg'),
          stage: response.data.stage || { name: 'Level 1' },
          percentage: typeof response.data.percentage === 'number' ? response.data.percentage : 0,
          ...response.data,
        };
        setUser(userData);
        handleSuccess(userData);
      } else {
        // Handle case where token is not returned (e.g. OTP required or verification)
        setError("Registration successful! Please login.");
        setView('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await forgetPasswordController(forgotEmail);
      if (response && (response.code === 200 || response.code === 201)) {
        setSuccessMsg('A code has been sent to your email.');
        setTimeout(() => {
          setView('reset-password');
        }, 1500);
      } else {
        setError(response?.message || 'Failed to send code.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (otp.some(d => !d)) {
      setError('Please enter the full code.');
      return;
    }
    if (resetData.password !== resetData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (checkStrength(resetData.password) < 3) {
      setError('Password is too weak.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPasswordController({
        email: forgotEmail,
        code: otp.join(''),
        password: resetData.password,
        confirm_password: resetData.confirm,
      });
      if (response && (response.code === 200 || response.code === 201)) {
        setSuccessMsg('Password reset successful! Please login.');
        setTimeout(() => {
          setView('login');
        }, 1500);
      } else {
        setError(response?.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await forgetPasswordController(forgotEmail);
      if (response && (response.code === 200 || response.code === 201)) {
        setSuccessMsg('A new code has been sent to your email.');
        setResendCooldown(600); // 10 minutes
        if (resendTimer.current) clearInterval(resendTimer.current);
        resendTimer.current = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(resendTimer.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response?.message || 'Failed to resend code.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resendTimer.current) clearInterval(resendTimer.current);
    };
  }, []);

  const getTitle = () => {
    switch(view) {
      case 'login': return "To continue, login or create an account";
      case 'register': return "Create Your Account";
      case 'forgot-password': return "Reset Password";
      case 'reset-password': return "Set New Password";
      default: return "";
    }
  };

  const getDescription = () => {
    switch(view) {
      case 'login': return "Welcome back!";
      case 'register': return "Join us and start your journey today!";
      case 'forgot-password': return "Enter your email to receive a reset code.";
      case 'reset-password': return "Enter the code and your new password.";
      default: return "";
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={closeModal}
      title={getTitle()}
      description={getDescription()}
      showFooter={false}
      className="max-w-md w-full"
    >
      <div className="px-6 pb-6">
      {view === 'login' && (
        <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
          <InputField
            id="login-email"
            name="email"
            type="email"
            placeholder="Email Address"
            className='focus:ring-quinary focus:border-quinary'
            value={loginData.email}
            onChange={handleLoginChange}
            icon={<MdEmail className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
          />
          <InputField
            id="login-password"
            name="password"
            type="password"
            placeholder="Password"
            className='focus:ring-quinary focus:border-quinary'
            value={loginData.password}
            onChange={handleLoginChange}
            icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary" />}
            showToggle
            onToggle={() => setShowLoginPassword(!showLoginPassword)}
            isToggled={showLoginPassword}
            disabled={isLoading}
          />
          <div className="flex justify-end">
             <button
              type="button"
              onClick={() => setView('forgot-password')}
              className="text-sm text-quinary hover:text-primary"
            >
              Forgot Password?
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <Button
            type="submit"
            variant="quinary"
            className={`w-full py-2 rounded-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B00] hover:bg-primary- text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
          <div className="text-center text-sm mt-4">
            <span className="text-text-secondary">Don't have an account? </span>
            <button
              type="button"
              onClick={() => setView('register')}
              className="font-medium text-quinary hover:text-primary"
            >
              Create an account
            </button>
          </div>
        </form>
      )}

      {view === 'register' && (
        <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
          <InputField
            id="register-name"
            name="name"
            type="text"
            placeholder="Full Name"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.name}
            onChange={handleRegisterChange}
            icon={<MdPerson className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
          />
          <InputField
            id="register-email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.email}
            onChange={handleRegisterChange}
            icon={<MdEmail className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
          />
          <InputField
            id="register-phone"
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.phoneNumber}
            onChange={handleRegisterChange}
            icon={<MdPerson className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
          />
          <InputField
            id="register-password"
            name="password"
            type="password"
            placeholder="Password"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.password}
            onChange={handleRegisterChange}
            icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary/10" />}
            showToggle
            onToggle={() => setShowRegisterPassword(!showRegisterPassword)}
            isToggled={showRegisterPassword}
            disabled={isLoading}
          />
          <InputField
            id="register-confirm"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary/10" />}
            showToggle
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            isToggled={showConfirmPassword}
            disabled={isLoading}
          />
           <InputField
            id="register-referral"
            name="referralCode"
            type="text"
            placeholder="Referral Code (Optional)"
            className="focus:ring-quinary focus:border-quinary"
            value={registerData.referralCode}
            onChange={handleRegisterChange}
            icon={<MdPerson className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
            required={false}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            variant="quinary"
            className={`w-full py-2 rounded-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B00] hover:bg-primary- text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sign Up' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm mt-4">
            <span className="text-text-secondary">Already have an account? </span>
            <button
              type="button"
              onClick={() => setView('login')}
              className="font-medium text-quinary hover:text-primary"
            >
              Log in
            </button>
          </div>
        </form>
      )}

      {view === 'forgot-password' && (
        <form className="mt-6 space-y-4" onSubmit={handleForgotSubmit}>
          <InputField
            id="forgot-email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="focus:ring-quinary focus:border-quinary"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            icon={<MdEmail className="h-5 w-5 text-text-secondary/10" />}
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <Button
            type="submit"
            variant="quinary"
            className={`w-full py-2 rounded-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B00] hover:bg-primary- text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Code...' : 'Send Code'}
          </Button>
          <div className="text-center text-sm mt-4">
            <button
              type="button"
              onClick={() => setView('login')}
              className="font-medium text-quinary hover:text-primary"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}

      {view === 'reset-password' && (
        <form className="mt-6 space-y-4" onSubmit={handleResetSubmit}>
          <p className="text-sm text-text-secondary">
            We sent a code to <span className="font-medium">{forgotEmail}</span>
          </p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            isError={!!error && error.toLowerCase().includes('code')}
            inputClassName="focus:ring-quinary focus:border-quinary"
            disabled={isLoading}
          />
          <InputField
            id="new-password"
            name="password"
            type="password"
            placeholder="New Password"
            className="focus:ring-quinary focus:border-quinary"
            value={resetData.password}
            onChange={e => {
              setResetData({ ...resetData, password: e.target.value });
              setStrength(checkStrength(e.target.value));
            }}
            disabled={isLoading}
          />
           <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? 'bg-quinary' : 'bg-secondary'}`} />
            ))}
          </div>
          <InputField
            id="confirm-password"
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            className="focus:ring-quinary focus:border-quinary"
            value={resetData.confirm}
            onChange={e => setResetData({ ...resetData, confirm: e.target.value })}
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <Button
            type="submit"
            variant="quinary"
            className={`w-full py-2 rounded-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B00] hover:bg-primary- text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <div className="mt-4 flex justify-between text-sm">
            <Button
              type="button"
              variant="textPrimary"
              onClick={handleResend}
              className="p-0 bg-transparent shadow-none hover:text-primary"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? 'Resending...' : resendCooldown > 0 ? `Resend Code (${Math.floor(resendCooldown/60)}:${('0'+(resendCooldown%60)).slice(-2)})` : 'Resend Code'}
            </Button>
            <button
              type="button"
              onClick={() => setView('login')}
              className="font-medium text-quinary hover:text-primary"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
      </div>
    </CustomModal>
  );
};

export default AuthModal;
