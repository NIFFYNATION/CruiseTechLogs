import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-quinary">Forgot Password?</h2>
        <p className="mb-6 text-text-secondary">Enter your email to receive a password reset code.</p>
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
      </div>
    </div>
  );
};

export default ForgotPassword;
