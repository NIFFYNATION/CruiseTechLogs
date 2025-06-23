import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdPerson } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import InputField from '../../components/common/InputField';
import FormSection from '../../components/common/FormSection';
import Side from '../login/side';
import { signupController } from '../../controllers/authController'; // Import auth controller
import { Button } from '../../components/common/Button';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading animation
    try {
      const response = await signupController(formData); // Delegate logic to controller
      setSuccessMessage(response.message);
      localStorage.setItem('authToken', response.data.token.token); // Store token
      console.log('Signup successful:', response);
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background py-8 px-4 sm:px-6 lg:px-8 h-screen md:h-auto">
        <FormSection
          title="Create Your Account"
          subtitle="Join us and start your journey today!"
        >
          {/* Signup Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
            className='focus:ring-quinary focus:border-quinary'

              value={formData.name}
              onChange={handleChange}
              icon={<MdPerson className="h-5 w-5 text-text-secondary" />}
            />
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
            className='focus:ring-quinary focus:border-quinary'

              value={formData.email}
              onChange={handleChange}
              icon={<MdEmail className="h-5 w-5 text-text-secondary" />}
            />
            <InputField
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
            className='focus:ring-quinary focus:border-quinary'

              value={formData.phoneNumber}
              onChange={handleChange}
              icon={<MdPerson className="h-5 w-5 text-text-secondary" />}
            />
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            className='focus:ring-quinary focus:border-quinary'

              value={formData.password}
              onChange={handleChange}
              icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary" />}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              isToggled={showPassword}
            />
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            className='focus:ring-quinary focus:border-quinary'

              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<RiLockPasswordLine className="h-5 w-5 text-text-secondary" />}
              showToggle
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              isToggled={showConfirmPassword}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>} {/* Display success */}
            <Button
              type="submit"
              variant='quinary'
              className="w-full bg-primary rounded-md"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Submitting...' : 'Sign Up'} {/* Show loading text */}
            </Button>
            
          </form>

          {/* Login link */}
          <div className="text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link to="/login" className="font-medium text-quinary hover:text-primary">
              Log in
            </Link>
          </div>
        </FormSection>
      </div>

      {/* Right Section */}
      <Side />
    </div>
  );
};

export default Signup;