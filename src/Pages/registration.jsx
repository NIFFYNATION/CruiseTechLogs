import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MdEmail, MdPerson, MdPhone, MdLocationOn } from 'react-icons/md'
import { IoMdMale } from 'react-icons/io'
import { FaCity } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import PhoneInput, { getCountries, getCountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Select from 'react-select'
import CountrySelect from '../components/CountrySelect'

const Registration = () => {
  const [step, setStep] = useState(1)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Sidebar - Progress */}
      <div className="w-full lg:w-1/3 lg:max-w-xs bg-background p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-12">
          <img src="/light_logo.png" alt="CruiseTech" className="h-6 sm:h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-6 lg:mb-8">Create Account</h2>

        {/* Progress Steps */}
        <div className="flex justify-between lg:block lg:space-y-8">
          {/* Personal Details Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <HiIdentification className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${step === 1 ? 'text-primary' : 'text-gray-600'}`}>Personal Details</p>
            </div>
          </div>

          {/* Vertical Line - Hidden on mobile, shown on desktop */}
          <div className="w-0.5 h-12 bg-gray-200 ml-5 hidden lg:block"></div>

          {/* Horizontal Line - Shown on mobile, hidden on desktop */}
          <div className="flex-1 h-0.5 bg-gray-200 mx-2 lg:hidden"></div>

          {/* Email Verification Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <span className="text-base sm:text-lg">2</span>
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${step === 2 ? 'text-primary' : 'text-gray-600'}`}>Email Verification</p>
            </div>
          </div>

          {/* Vertical/Horizontal Lines */}
          <div className="w-0.5 h-12 bg-gray-200 ml-5 hidden lg:block"></div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2 lg:hidden"></div>

          {/* Set Account Password Step */}
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step === 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <span className="text-base sm:text-lg">3</span>
            </div>
            <div className="ml-2 sm:ml-4 hidden sm:block">
              <p className={`font-medium text-sm sm:text-base ${step === 3 ? 'text-primary' : 'text-gray-600'}`}>Set Account Password</p>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 lg:mt-auto lg:pt-8 text-sm text-center lg:text-left">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold mb-6">Your Personal Details</h3>
              <div className="space-y-6">
                {/* Personal Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="gender"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary appearance-none"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Residential Address Section */}
                <h3 className="text-xl font-semibold mb-6 pt-4">Your Residential Address</h3>
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                        value={formData.streetAddress}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="streetAddressOptional"
                        placeholder="Street Address (Optional)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                        value={formData.postCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative">
                      <CountrySelect
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <h3 className="text-xl font-semibold mb-6 pt-4">Contact Details</h3>
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
                        buttonClass="w-full h-[46px] border border-gray-200 rounded-md"
                        enableSearch={true}
                        searchClass="p-2 border border-gray-200 rounded"
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
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
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
                      value={formData.additionalEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Add Email Verification and Password Setup steps here */}
        </div>
      </div>
    </div>
  )
}

export default Registration
