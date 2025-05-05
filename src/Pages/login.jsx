import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaInstagram, FaXTwitter, FaLine } from 'react-icons/fa6'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { SiWechat } from 'react-icons/si'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Button, SocialButton, SubmitButton } from '../components/common/Button'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 p-6 sm:p-8 rounded-lg">
          {/* Logo */}
          <div className="flex justify-start">
            <img src="/light_logo.png" alt="CruiseTech" className="h-10 sm:h-12" />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Log in to your Account</h2>
            <p className="mt-2 text-sm text-text-secondary">Welcome back! Select method to log in:</p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={<FcGoogle className="h-5 w-5" />}
              fullWidth
            >
              Google
            </SocialButton>
            <SocialButton
              icon={<FaFacebook className="h-5 w-5 text-blue-600" />}
              fullWidth
            >
              Facebook
            </SocialButton>
          </div>

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
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-secondary bg-background text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-secondary bg-background text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-text-secondary" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-text-secondary" />
                  )}
                </button>
              </div>
            </div>

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

            <div>
              <SubmitButton fullWidth>
                Log In
              </SubmitButton>
            </div>
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm">
            <span className="text-text-secondary">Don't have an account? </span>
            <Link to="/registration" className="font-medium text-primary hover:text-primary-light">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Social Media Connections */}
      <div className="w-full lg:w-1/2 bg-primary flex flex-col items-center justify-center text-background p-4 sm:p-6 lg:p-8 relative overflow-hidden min-h-[600px] lg:min-h-screen">
        {/* <div className="absolute bottom-4 -left-45 w-48 h-48 md:w-100 md:h-100 bg-primary-light rounded-full -translate-y-1/2 translate-x-1/2 opacity-10 "></div> */}

        <div className="absolute 
    bottom-8 sm:bottom-4 
    -left-40 sm:-left-24 md:-left-32 lg:-left-45 
    w-90 h-90  md:w-100 md:h-100 
    bg-primary-light rounded-full 
    -translate-y-1/2 translate-x-1/2 
    opacity-10">
</div>

        {/* Social Media Icons with Connection Lines */}
        <div className="relative w-full max-w-md h-72 sm:h-96 mt-8 lg:mt-0">
          {/* Facebook */}
          <div className="absolute left-0 top-8 hidden sm:block">
            <div className="relative rotate-[30deg]">
              <div className="bg-background/10 p-2 rounded-full">
                <div className="bg-background rounded-full p-2 shadow-lg">
                  <FaFacebook className="w-4 sm:w-6 h-4 sm:h-6 text-[#1877F2]" />
                </div>
              </div>
              <div className="absolute top-1/2 left-full w-24 sm:w-32 h-[2px] p-1 bg-background/10"></div>
            </div>
          </div>

          {/* Instagram */}
          <div className="absolute -left-8 sm:-left-16 top-2/5 hidden sm:block">
            <div className="relative">
              <div className="bg-background/10 p-2 rounded-full">
                <div className="bg-background rounded-full p-2 shadow-lg">
                  <FaInstagram className="w-4 sm:w-6 h-4 sm:h-6 text-[#E4405F]" />
                </div>
                <div className="absolute top-1/2 left-full w-32 sm:w-50 h-[2px] p-1 bg-background/10"></div>
              </div>
            </div>
          </div>

          {/* Twitter/X */}
          <div className="absolute left-0 bottom-8 hidden sm:block">
            <div className="relative rotate-[-30deg]">
              <div className="bg-background/10 p-2 rounded-full">
                <div className="bg-background rounded-full p-2 shadow-lg">
                  <FaXTwitter className="w-4 sm:w-6 h-4 sm:h-6 text-black" />
                </div>
              </div>
              <div className="absolute top-1/2 left-full w-24 sm:w-32 h-[2px] p-1 bg-background/10"></div>
            </div>
          </div>

          {/* Mobile Social Icons - Visible only on small screens */}
          <div className="flex justify-center gap-8 sm:hidden mb-8 ">
            <div className="bg-background/10 p-2 rounded-full">
              <div className="bg-background rounded-full p-2 shadow-lg">
                <FaFacebook className="w-6 h-6 text-[#1877F2]" />
              </div>
            </div>
            <div className="bg-background/10 p-2 rounded-full">
              <div className="bg-background rounded-full p-2 shadow-lg">
                <FaInstagram className="w-6 h-6 text-[#E4405F]" />
              </div>
            </div>
            <div className="bg-background/10 p-2 rounded-full">
              <div className="bg-background rounded-full p-2 shadow-lg">
                <FaXTwitter className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          {/* Mock UI Window */}
          <div className="absolute right-0 lg:right-0 top-3/5 md:top-1/2 transform -translate-y-1/2 bg-background rounded-lg shadow-xl w-64 sm:w-72 mx-auto left-0 lg:left-auto">
            <div className="flex items-center gap-2 p-2 sm:p-3 border-b">
              <div className="flex gap-1.5">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {/* Social Media Account Items */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-background-alt rounded-lg">
                <FaFacebook className="w-5 sm:w-6 h-5 sm:h-6 text-[#1877F2]" />
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded w-3/4"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-background-alt rounded-lg">
                <SiWechat className="w-5 sm:w-6 h-5 sm:h-6 text-[#7BB32E]" />
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded w-2/3"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-background-alt rounded-lg">
                <RiKakaoTalkFill className="w-5 sm:w-6 h-5 sm:h-6 text-[#FAE100]" />
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded w-4/5"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-background-alt rounded-lg">
                <FaLine className="w-5 sm:w-6 h-5 sm:h-6 text-[#00B900]" />
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center max-w-lg mt-16 lg:mt-16 relative z-10 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-background">
            Connect with every application.
          </h2>
          <p className="text-base sm:text-lg text-background/90">
            Discover, Authenticate, and Elevate Your Online Presence with Cruise Tech Marketplace. Your Gateway to Genuine Social Media Accounts.
          </p>
        </div>

        {/* Bottom Dots */}
        <div className="absolute bottom-4 sm:bottom-2 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-background/30"></div>
          <div className="w-2 h-2 rounded-full bg-background"></div>
          <div className="w-2 h-2 rounded-full bg-background/30"></div>
        </div>
      </div>
    </div>
  )
}

export default Login
