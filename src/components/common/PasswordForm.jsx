import React, { useState } from 'react';
import InputField from './InputField';
import { Button } from './Button';
import FormSection from './FormSection';

const validate = (values) => {
  const errors = {};
  if (!values.current_password) errors.current_password = 'Current password is required';
  if (!values.password) errors.password = 'New password is required';
  if (!values.confirm_password) errors.confirm_password = 'Confirm password is required';
  if (values.password && values.confirm_password && values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  return errors;
};

const PasswordForm = ({ onSubmit, loading }) => {
  const [values, setValues] = useState({ current_password: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <FormSection title="Change Password" subtitle="To change your password please confirm here">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 font-medium">Current Password</label>
          <InputField
            name="current_password"
            type={showCurrent ? 'text' : 'password'}
            value={values.current_password}
            onChange={handleChange}
            className="py-3 px-4 bg-bgLayout"
            placeholder="Current Password"
            showToggle={true}
            isToggled={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
          />
          {errors.current_password && <div className="text-danger text-xs mt-1">{errors.current_password}</div>}
        </div>
        <div>
          <label className="block mb-2 font-medium">New Password</label>
          <InputField
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            className="py-3 px-4 bg-bgLayout"
            placeholder="New Password"
            showToggle={true}
            isToggled={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          {errors.password && <div className="text-danger text-xs mt-1">{errors.password}</div>}
        </div>
        <div>
          <label className="block mb-2 font-medium">Confirm Password</label>
          <InputField
            name="confirm_password"
            type={showConfirm ? 'text' : 'password'}
            value={values.confirm_password}
            onChange={handleChange}
            className="py-3 px-4 bg-bgLayout"
            placeholder="Confirm Password"
            showToggle={true}
            isToggled={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
          {errors.confirm_password && <div className="text-danger text-xs mt-1">{errors.confirm_password}</div>}
        </div>
        <Button
          type="submit"
          variant="quinary"
          size="lg"
          shape="rounded"
          className="mt-6"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Change Password'}
        </Button>
      </form>
    </FormSection>
  );
};

export default PasswordForm; 