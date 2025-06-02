import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import InputField from '../../components/common/InputField';
import FormSection from '../../components/common/FormSection';
import SocialButtons from '../../components/common/SocialButtons';
import Side from './side';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
        <FormSection
          title="Log in to your Account"
          subtitle="Welcome back! Select method to log in:"
        >
          {/* Social Login Buttons */}
          <SocialButtons
            buttons={[
              { icon: <FcGoogle className="h-5 w-5" />, label: 'Google' },
              { icon: <FaFacebook className="h-5 w-5 text-blue-600" />, label: 'Facebook' },
            ]}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-text-secondary">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              icon={<MdEmail className="h-5 w-5 text-text-secondary" />}
            />
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary" />}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              isToggled={showPassword}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-secondary rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-primary">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-light">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-background py-2 rounded-md hover:bg-primary-light transition-colors"
            >
              Log In
            </button>
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm">
            <span className="text-text-secondary">Don't have an account? </span>
            <Link to="/registration" className="font-medium text-primary hover:text-primary-light">
              Create an account
            </Link>
          </div>
        </FormSection>
      </div>

      {/* Right Section */}
      <Side />
    </div>
  );
};

export default Login;
