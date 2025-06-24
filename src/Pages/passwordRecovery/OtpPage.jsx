import React, { useState } from 'react';
import {Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../../components/common/OtpInput';
import { Button } from '../../components/common/Button';
import Side from '../login/side';
import FormSection from '../../components/common/FormSection';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const forAction = location.state?.for || 'verify';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate OTP check
    setTimeout(() => {
      if (otp.join('') === '12345') {
        setIsError(false);
        if (forAction === 'reset') {
          navigate('/reset-password', { state: { email } });
        } else {
          // handle other flows
        }
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    // Simulate resend
    setIsError(false);
  };

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
    title="Enter Verification Code"
    subtitle=""
  >
    <p className="mt-2 text-sm text-text-secondary">
          We sent a code to <span className="font-medium">{email}</span>
        </p>
      <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            isError={isError}
            inputClassName="focus:ring-quinary focus:border-quinary"
            disabled={isLoading}
          />
          {isError && <p className="text-red-500 text-sm">Invalid code. Please try again.</p>}
          <Button
            type="submit"
            variant="quinary"
            className="w-full"
            disabled={isLoading || otp.some(d => !d)}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Button
            type="button"
            variant="textPrimary"
            onClick={handleResend}
            className="p-0 bg-transparent shadow-none"
          >
            Resend Code
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
<Side  />
</div>
  );
};

export default OtpPage;
