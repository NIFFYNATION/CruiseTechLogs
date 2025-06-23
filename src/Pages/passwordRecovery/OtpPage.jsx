import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../../components/common/OtpInput';
import { Button } from '../../components/common/Button';

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xl p-8 rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-quinary">Enter Verification Code</h2>
        <p className="mb-6 text-text-secondary">
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
      </div>
    </div>
  );
};

export default OtpPage;
