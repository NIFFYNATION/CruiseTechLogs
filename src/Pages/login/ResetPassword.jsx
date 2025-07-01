import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import Side from '../login/side';
import FormSection from '../../components/common/FormSection';
import OtpInput from '../../components/common/OtpInput';
import { resetPasswordController, forgetPasswordController } from '../../controllers/authController';

const ResetPassword = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (otp.some(d => !d)) {
      setError('Please enter the full code.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (checkStrength(password) < 3) {
      setError('Password is too weak.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPasswordController({
        email,
        code: otp.join(''),
        password,
        confirm_password: confirm,
      });
      if (response && (response.code === 200 || response.code === 201)) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      } else {
        setError(response?.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await forgetPasswordController(email);
      if (response && (response.code === 200 || response.code === 201)) {
        setSuccess('A new code has been sent to your email.');
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

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (resendTimer.current) clearInterval(resendTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-red-500/2 to-orange-500/5 py-8 px-4 sm:px-6 lg:px-8 h-screen md:h-auto">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="/images/CruiseTech-2.svg"
              alt="CruiseTech Logo"
              className="h-12"
              style={{ maxWidth: 160 }}
            />
          </Link>
        </div>
        <FormSection
          title="Reset Password"
          subtitle="Enter the code sent to your email and set a new password."
        >
          <p className="mt-2 text-sm text-text-secondary">
            We sent a code to <span className="font-medium">{email}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <OtpInput
              value={otp}
              onChange={setOtp}
              isError={!!error && error.toLowerCase().includes('code')}
              inputClassName="focus:ring-quinary focus:border-quinary"
              disabled={isLoading}
            />
            <InputField
              id="new-password"
              name="new-password"
              type="password"
              placeholder="New Password"
              className="focus:ring-quinary focus:border-quinary"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
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
              name="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="focus:ring-quinary focus:border-quinary"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button
              type="submit"
              className="w-full"
              variant="quinaryLight"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <Button
              type="button"
              variant="textPrimary"
              onClick={handleResend}
              className="p-0 bg-transparent shadow-none"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? 'Resending...' : resendCooldown > 0 ? `Resend Code (${Math.floor(resendCooldown/60)}:${('0'+(resendCooldown%60)).slice(-2)})` : 'Resend Code'}
            </Button>
            <Button
              type="button"
              variant="textPrimary"
              onClick={() => navigate(-1)}
              className="p-0 bg-transparent shadow-none"
            >
              Back
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
          </div>
        </FormSection>
      </div>
      {/* Right Section */}
      <Side />
    </div>
  );
};

export default ResetPassword;
