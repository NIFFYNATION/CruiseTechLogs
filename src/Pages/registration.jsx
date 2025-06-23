import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MdEmail, MdPerson, MdPhone, MdLocationOn } from 'react-icons/md'
import { IoMdMale } from 'react-icons/io'
import { FaCity, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import PhoneInput, { getCountries, getCountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CountrySelect from '../components/CountrySelect'
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'



const CustomOption = ({ innerProps, data }) => (
  <div {...innerProps} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${data.value}.svg`}
      alt={data.label}
      className="w-6 h-4 object-cover"
    />
    {data.label}
  </div>
);

const Registration = () => {
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    streetAddress: '',
    streetAddressOptional: '',
    postCode: '',
    city: '',
    country: '',
    phoneNumber: '',
    additionalEmail: ''
  })

  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, step])
    setStep(prev => prev + 1)
  }

  const isStepCompleted = (stepNumber) => completedSteps.includes(stepNumber)

  const validateVerificationCode = (code) => {
    const expectedCode = '12345';
    return code.join('') === expectedCode;
  };

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value !== '' && index < 4) {
        const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
        if (nextInput) nextInput.focus();
      }

      if (index === 4 && value !== '') {
        const isValid = validateVerificationCode(newCode);
        setIsCodeValid(isValid);
        setIsCodeVerified(isValid);
      } else {
        setIsCodeValid(null);
      }
    }
  };

  const handleResendCode = () => {
    console.log('Resending verification code...');
  };

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++; // Length
    if (/[A-Z]/.test(pass)) strength++; // Uppercase
    if (/[a-z]/.test(pass)) strength++; // Lowercase
    if (/[0-9]/.test(pass)) strength++; // Numbers
    if (/[^A-Za-z0-9]/.test(pass)) strength++; // Special characters
    return strength;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Sidebar - Progress */}
      <div className="w-full lg:w-1/3 items-center lg:max-w-xs bg-quaternary-light m-0 sm:m-2 lg:m-6 px-6 py-6 lg:px-8 lg:py-18 ">
        {/* Logo - Make it centered on mobile */}
        <div className="mb-6 lg:mb-12 text-center lg:text-left">
          <img src="/light_logo.png" alt="CruiseTech" className="h-6 sm:h-8 inline-block" />
        </div>

        {/* Title - Center on mobile */}
        <h2 className="text-xl sm:text-2xl font-bold mb-6 lg:mb-8 text-center lg:text-left text-text-primary">Create Account</h2>

        {/* Progress Steps */}
        <div className="flex justify-center lg:justify-start lg:block lg:space-y-8">
          {/* Personal Details Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              step === 1 ? 'bg-quinary text-background' : 
              isStepCompleted(1) ? 'bg-quinary text-background' : 
              'bg-tertiary'
            }`}>
              {isStepCompleted(1) ? (
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span className="text-base sm:text-lg">1</span>
              )}
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${
                step === 1 || isStepCompleted(1) ? 'text-primary' : 'text-text-secondary'
              }`}>Personal Details</p>
            </div>
          </div>

          {/* Vertical Line - Hidden on mobile, shown on desktop */}
          <div className={`w-1.5 h-16 ${
            isStepCompleted(1) ? 'bg-quinary' : 'bg-tertiary'
          } ml-5 hidden lg:block`}></div>

          {/* Horizontal Line - Shown on mobile, hidden on desktop */}
          <div className={`flex-1 self-center h-1.5 ${isStepCompleted(1) ? 'bg-primary' : 'bg-tertiary'} mx-4 sm:mx-6 lg:hidden`}></div>

          {/* Email Verification Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              step === 2 ? 'bg-quinary text-background' : 
              isStepCompleted(2) ? 'bg-quinary text-background' : 
              'bg-tertiary'
            }`}>
              {isStepCompleted(2) ? (
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span className="text-base sm:text-lg">2</span>
              )}
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${
                step === 2 || isStepCompleted(2) ? 'text-primary' : 'text-text-secondary'
              }`}>Email Verification</p>
            </div>
          </div>

          {/* Vertical Line - Hidden on mobile, shown on desktop */}
          <div className={`w-1.5 h-16 ${
            isStepCompleted(2) ? 'bg-quinary' : 'bg-tertiary'
          } ml-5 hidden lg:block`}></div>

          {/* Horizontal Line - Shown on mobile, hidden on desktop */}
          <div className={`flex-1 h-1.5 self-center ${isStepCompleted(2) ? 'bg-quinary' : 'bg-tertiary'} mx-4 sm:mx-6 lg:hidden`}></div>

          {/* Set Account Password Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              step === 3 ? 'bg-quinary text-background' : 
              isStepCompleted(3) ? 'bg-quinary text-background' : 
              'bg-tertiary'
            }`}>
              {isStepCompleted(3) ? (
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span className="text-base sm:text-lg">3</span>
              )}
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${
                step === 3 || isStepCompleted(3) ? 'text-primary' : 'text-text-secondary'
              }`}>Set Account Password</p>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 lg:mt-auto lg:pt-8 text-sm text-center">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-text-secondary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="container-fluid mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        <div className="">
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-text-primary">Your Personal Details</h3>
              <div className="space-y-6">
                {/* Personal Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="gender"
                      className="w-full px-4 py-3 bg-background text-text-primary border border-secondary rounded-md focus:ring-primary focus:border-primary appearance-none"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="" className="text-text-primary">Gender</option>
                      <option value="male" className="text-text-primary">Male</option>
                      <option value="female" className="text-text-primary">Female</option>
                      <option value="other" className="text-text-primary">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Residential Address Section */}
                <h3 className="text-xl font-semibold mb-6 pt-4 text-text-primary">Your Residential Address</h3>
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                        value={formData.streetAddress}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="streetAddressOptional"
                        placeholder="Street Address (Optional)"
                        className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                        value={formData.streetAddressOptional}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Post Code, City, Country remain the same */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="postCode"
                        placeholder="Post Code"
                        className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                        value={formData.postCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <CountrySelect
                        value={formData.country}
                        onChange={(countryValue) => {
                          setFormData(prev => ({
                            ...prev,
                            country: countryValue
                          }))
                        }}
                        placeholder="Select Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <h3 className="text-xl font-semibold mb-6 pt-4 text-text-primary">Contact Details</h3>
                <div className="space-y-6">
                  {/* Phone Number with Country Code */}
                  <div className="flex gap-4">
                    <div className="w-20">
                      <PhoneInput
                        country={'ng'}
                        value={phone}
                        onChange={phone => setPhone(phone)}
                        inputClass="hidden"
                        containerClass="w-full"
                        buttonClass="w-full h-[46px] border border-secondary rounded-md"
                        enableSearch={true}
                        searchClass="p-2 border border-secondary rounded"
                        buttonStyle={{
                          borderRadius: '5px',
                          backgroundColor: 'white',
                          padding: '8px 12px',
                          width: '100%'
                        }}
                        dropdownStyle={{
                          width: '300px'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Additional Email Address */}
                  <div className="relative">
                    <input
                      type="email"
                      name="additionalEmail"
                      placeholder="Additional Email Address"
                      className="w-full px-4 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                      value={formData.additionalEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-background font-medium rounded-full hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="container-fluid px-2 sm:px-10 py-6 sm:py-10">
              <h3 className="text-2xl font-semibold mb-8 text-text-primary">Check your email <br /> for a verification code</h3>
             

              <div className="mb-6">
                <p className="text-sm text-text-primary mb-4">Enter code</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      name={`code-${index}`}
                      value={verificationCode[index]}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      className={`w-12 h-12 text-center text-text-primary border-2 rounded focus:outline-none transition-colors
                        ${isCodeValid === null ? 'border-secondary focus:border-primary' :
                          isCodeValid ? 'border-green-500' : 'border-red-500'}`}
                    />
                  ))}
                  <div className="flex items-center ml-2">
                    {verificationCode.every(digit => digit !== '') && (
                      isCodeValid ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )
                    )}
                  </div>
                </div>
                {isCodeValid === false && (
                  <p className="text-red-500 text-sm mt-2">Invalid verification code. Please try again.</p>
                )}
              </div>

              <div className="text-sm text-text-primary">
                Didn't receive code? Check your spam folder or{' '}
                <button 
                  onClick={handleResendCode}
                  className="text-quinary hover:text-primary-light font-medium hover:underline"
                >
                  Resend Code
                </button>
              </div>

              <div className="mt-16 sm:mt-80 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-secondary text-text-primary font-medium rounded-full hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isCodeValid}
                  className={`px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium
                    ${isCodeValid 
                      ? 'bg-primary text-background hover:bg-primary-light focus:ring-primary' 
                      : 'bg-tertiary text-background/60 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="container-fluid px-2 sm:px-10 py-6 sm:py-10">
              <h3 className="text-2xl font-semibold mb-8 text-text-primary">Creat a password</h3>

              <div className="space-y-6 container">
                {/* Password Input */}
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <AiOutlineLock className="text-text-primary/70 text-xl" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordStrength(checkPasswordStrength(e.target.value));
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-text-primary/70 text-xl" />
                    ) : (
                      <AiOutlineEye className="text-text-primary/70 text-xl" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="flex gap-2 max-w-md">
                  {[1, 2, 3, 4, 5].map((segment) => (
                    <div
                      key={segment}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength >= segment
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>

                {/* Confirm Password Input with responsive check mark placement */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className="relative w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <AiOutlineLock className="text-text-primary/70 text-xl" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-16 sm:pr-10 py-2 sm:py-3 bg-background text-text-primary placeholder-text-secondary/70 border border-secondary rounded-md focus:ring-primary focus:border-primary"
                    />
                    {/* Show check mark inside input on mobile */}
                    <div className="absolute inset-y-0 right-10 sm:hidden flex items-center">
                      {password && confirmPassword && (
                        password === confirmPassword ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-xl" />
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible className="text-text-primary/70 text-xl" />
                      ) : (
                        <AiOutlineEye className="text-text-primary/70 text-xl" />
                      )}
                    </button>
                  </div>
                  {/* Show check mark outside input on larger screens */}
                  <div className="hidden sm:flex flex-shrink-0">
                    {password && confirmPassword && (
                      password === confirmPassword ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )
                    )}
                  </div>
                </div>
                   
                <div className="mt-16 sm:mt-80 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-secondary text-text-primary font-medium rounded-full hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!password || password !== confirmPassword || passwordStrength < 3}
                    className={`px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium
                      ${password && password === confirmPassword && passwordStrength >= 3
                        ? 'bg-primary text-background hover:bg-primary-light focus:ring-primary'
                        : 'bg-tertiary text-background/60 cursor-not-allowed'}`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Registration
