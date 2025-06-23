import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { Button } from '../../components/common/Button';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const checkStrength = (pass) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (strength < 3) {
      setError('Password is too weak.');
      return;
    }
    setDone(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-quinary">Reset Password</h2>
        <p className="mb-6 text-text-secondary">Set a new password for <span className="font-medium">{email}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="new-password"
            name="new-password"
            type="password"
            placeholder="New Password"
            className='focus:ring-quinary focus:border-quinary'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
            }}
            disabled={done}
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
            className='focus:ring-quinary focus:border-quinary'
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={done}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button disabled={done} 
                  type='submit'
                  className="w-full "
                  variant="quinaryLight" >
             {done ? 'Password Reset!' : 'Reset Password'}

          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-primary hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
