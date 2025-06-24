import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import FormSection from '../../components/common/FormSection';
import Side from '../login/side';

import { Button } from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Simulate API call
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setSent(true);
    // In real app, send email and handle errors
    setTimeout(() => {
      navigate('/otp', { state: { email, for: 'reset' } });
    }, 1200);
  };

  return (

<div className="min-h-screen flex flex-col lg:flex-row">
{/* Left Section */}

<div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-red-500/2 to-orange-500/5 py-8 px-4 sm:px-6 lg:px-8 h-screen md:h-auto">
  <div className="flex justify-center mb-6">
      <img
        src="/images/CruiseTech-2.svg"
        alt="CruiseTech Logo"
        className="h-12"
        style={{ maxWidth: 160 }}
      />
    </div>
  <FormSection
    title="Forgot Password?"
    subtitle="Enter your email to receive a password reset code."
  >
     <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            className='focus:ring-quinary focus:border-quinary'

            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={sent}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
         
          <Button disabled={sent} 
                  className="w-full "
                  type='submit'
                  variant="quinaryLight" >
                         {sent ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>
        
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

export default ForgotPassword;
