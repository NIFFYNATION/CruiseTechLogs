import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaTelegram, FaInstagram, FaThumbsUp } from 'react-icons/fa'
import { FaTiktok } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import Marquee from 'react-fast-marquee'
import { Button } from '../components/common/Button'

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full bg-background relative ">
        <div className='container-fluid mx-auto'>

           {/* Teal Background Extension */}
           <div 
            className="absolute top-0 right-0 h-full bg-quinary w-[50%] md:w-[33%]" 
            style={{
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
             
            }}
          ></div>

        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-16 flex justify-between items-center h-16 sm:h-20 relative z-10">

          
          {/* Logo Section */}
          <div className="flex items-center">
          <Link to="/">
            <img 
            src="/images/CruiseTech-2.svg" 
 
              alt="CruiseTech Logo" 
              className="h-8 sm:h-10 md:h-12"
            /></Link>
          </div>

         
          
          {/* Login Button */}
          <div className="relative z-20 ">
            <Button
              variant="primary"
              size="lg"
              className="py-0 group bg-white text-quinary hover:bg-background hover:text-primary"
              to="/login"
              icon={
                <span
                  className="h-5 w-5 items-center flex justify-center bg-quinary group-hover:bg-primary transition-colors duration-200"
                  style={{
                    WebkitMask: `url(/icons/login.svg) center center / contain no-repeat`,
                    mask: `url(/icons/login.svg) center center / contain no-repeat`,
                  }}
                  aria-label="Login Icon"
                />
              }
            >
              Login
            </Button>
          </div>
        </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-">
        <div className="container mx-auto px-4 mt-16 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ">
            {/* Left Column - Text Content */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-xl mx-auto lg:mx-0">
              {/* Whatsapp Join Button */}
              <a     href="https://whatsapp.com/channel/0029Vb9rsBW0LKZKBGTI940l"

                className="inline-flex items-center gap-2 bg-[#D9700A1A] backdrop-blur-sm 
                  px-4 sm:px-6 
                  py-2 sm:py-3 
                  rounded-full text-black hover:bg-background transition-all
                  w-full sm:w-auto justify-center sm:justify-start"
              >
                                  <img className="align-self-start" src="/icons/whatsapp.svg" alt="WhatsApp" />

                <span className="text-sm sm:text-base md:text-lg font-medium text-[#D9700A] whitespace-nowrap">
                  Join our whatsapp for news and update
                </span>
              </a>

              {/* Main Heading */}
              <h1 className="text-text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
                Explore Exclusive Accounts within our{' '}
                <span className="text-[#D9700A] block sm:inline">Marketplace.</span>
              </h1>

              {/* Description Text */}
              <p className="text-text-primary text-base sm:text-lg md:text-xl text-center lg:text-left">
                Discover, Authenticate, and Elevate Your Online Presence with 
                Cruise Tech Marketplace. Your Gateway to Genuine Social 
                Media Accounts.
              </p>

              {/* Get Started Button */}
              <div className="flex justify-center lg:justify-start">
                <Button
                  variant="quinary"
                  size="lg"
                  to="/registration"
                  fullWidth
                  className="sm:w-auto"
                >
                  Get Started Now!
                </Button>
              </div>
            </div>

            {/* Right Column - Image and Floating Icons */}
            <div className="relative h-full mt-8 lg:mt-0">
              {/* Main Image */}
              <div className="relative z-10">
                <img 
                  src="/heroImg.png" 
                  alt="Happy man using phone" 
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-contain mx-auto"
                />
              </div>

              {/* Floating Social Media Icons */}
              <div className="absolute inset-0 z-0">
                {/* Instagram Icon */}
                <div className="absolute top-[5%] left-[22%] bg-[#D9700A] p-2 sm:p-3 rounded-lg transform rotate-12 shadow-lg hidden sm:block">
                  <FaInstagram className="text-background text-xl sm:text-2xl" />
                </div>

                {/* Twitter/X Icon */}
                <div className="absolute top-[15%] right-[24%] bg-red-500 p-2 sm:p-3 rounded-lg transform -rotate-12 shadow-lg hidden sm:block">
                  <FaTwitter className="text-background text-xl sm:text-2xl" />
                </div>

                {/* Facebook Icon */}
                <div className="absolute top-[30%] left-[10%] bg-blue-600 p-2 sm:p-3 rounded-lg transform rotate-12 hidden sm:block">
                  <FaFacebookF className="text-background text-xl sm:text-2xl" />
                </div>

                {/* Thumbs Up Icon */}
                <div className="absolute bottom-[30%] left-[20%] bg-primary p-2 sm:p-3 rounded-lg transform -rotate-12 shadow-lg hidden sm:block">
                  <FaThumbsUp className="text-background text-xl sm:text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
         {/* Features Section */}
      <section className="container mx-auto sm:px-4 lg:px-16 pb-16">
        {/* Orange/Brown Gradient Line */}
        <div className="h-2 rounded-2xl rounded-b-none bg-gradient-to-r from-[#0B4B5A] via-[#D9700A] to-[#D9700A]"></div>
        
        <div className="container bg-background rounded-2xl rounded-t-none mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 ">
            {/* Secure Card */}
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-xl">
              <div className="bg-quinary w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                 <img src="/icons/secure.svg" alt="Secure" className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg text-text-secondary font-bold mb-2">Secure</h3>
              <p className="text-text-primary text-sm leading-relaxed">
                Benefit from secure, seamless transactions with Cruise Techlog's robust payment system for a hassle-free experience.
              </p>
            </div>

            {/* Quality Assurance Card */}
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-xl">
              <div className="bg-quinary w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
               <img src="/icons/assurance.svg" alt="Quality Assurance" className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg text-text-secondary font-bold mb-2">Quality Assurance</h3>
              <p className="text-text-primary text-sm leading-relaxed">
                CruiseTechlogs ensures high-quality accounts with real followers, active engagement, and organic growth, just as we do to maintain authenticity.
              </p>
            </div>

            {/* Authentic Profiles Card */}
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-xl">
              <div className="bg-quinary w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <img src="/icons/authentic-profiles.svg" alt="Authentic Profiles" className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg text-text-secondary font-bold mb-2">Authentic Profiles</h3>
              <p className="text-text-primary text-sm leading-relaxed">
                CruiseTechlogs vets all listed social media accounts for authenticity, ensuring a secure, trustworthy and confident purchase.
              </p>
            </div>

            {/* Engagement Metrics Card */}
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-xl">
              <div className="bg-quinary w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <img src="/icons/engagement-metrics.svg" alt="Engagement Metrics" className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg text-text-secondary font-bold mb-2">Engagement Metrics</h3>
              <p className="text-text-primary text-sm leading-relaxed">
                Gain access to detailed engagement metrics and audience insights, helping you make informed, data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="bg- py-16">
        <div className="container-fluid mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2 text-text-secondary">Platforms</h2>
            <p className="text-text-primary text-lg">We sell account for all your favourite Platforms. Below are some of them</p>
          </div>

          {/* First Row - Left to Right */}
          <div className="mb-8 ">
            <Marquee
              gradient={true}
              gradientColor={[243, 244, 246]} // matches bg-secondary
              speed={40}
            >
              <div className="flex gap-4 text-center">
              <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/google-voice.svg" alt="Google Voice" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Google Voice</span>
                </div>
                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/instagram.svg" alt="Instagram" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Instagram</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <img src="/icons/twitter.svg" alt="Twitter" className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-text-secondary">Twitter</span>
            </div>


                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/tiktok.svg" alt="TikTok" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">TikTok</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/textplus.svg" alt="TextPlus" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">TextPlus</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/windscribe.svg" alt="Windscribe" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Windscribe</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                <div className=" p-2 rounded-lg transform">
                <img src="/icons/facebook.svg" alt="Facebook" className="w-8 h-8 mb-2" />

                </div>

                  <span className="text-sm font-medium text-text-secondary">Facebook</span>
                </div>
              </div>
            </Marquee>
          </div>

          {/* Second Row - Right to Left */}
          <div>
            <Marquee
              gradient={true}
              gradientColor={[243, 244, 246]} // matches bg-secondary
              speed={40}
              direction="right"
            >
              <div className="flex gap-4 text-center">
              <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/tiktok.svg" alt="TikTok" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">TikTok</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/google-voice.svg" alt="Google Voice" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Google Voice</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/nordvpn.svg" alt="NordVPN" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">NordVPN</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/tunnel-bear.svg" alt="Tunnel Bear VPN" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Tunnel Bear VPN</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/outlook.svg" alt="Outlook" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">Outlook</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                  <img src="/icons/cyberghost.svg" alt="CyberGhost VPN" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">CyberGhost VPN</span>
                </div>

                <div className="bg-background p-8 w-40 h-40 rounded-lg shadow-sm flex flex-col items-center justify-center mx-4">
                    <img src="/icons/adguard.svg" alt="AdGuard VPN" className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-text-secondary">AdGuard VPN</span>
                </div>
              </div>
            </Marquee>
          </div>
        </div>
      </section>

      {/* Know Us Better Section */}
      <section className="py-16 bg-quaternary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6 ">
              <h2 className="text-2xl font-bold text-text-secondary">Know us better</h2>
              <p className="text-text-primary">
                At Cruise Tech Marketplace, we understand the value of a strong digital presence. Our platform is designed to empower individuals and businesses to access authentic social media accounts effortlessly.
              </p>
              <Button
                variant="quinary"
                
              >
                Learn More...
              </Button>
            </div>

            {/* Right Column - Features List */}
            <div className="space-y-8">

            <div className='bg-background rounded-[10px]'>
                 {/* Gradient Line */}
                 <div className="h-2  w-full rounded-full rounded-b-none bg-gradient-to-r from-[#0B4B5A] via-[#D9700A] to-[#D9700A] mb-4"></div>
              {/* Wide Selection of Platforms */}
              <div className=' p-6   '>
                <div className="flex items-center gap-6 ">
                  <div className="bg-quinary p-4 rounded-full flex-shrink-0">
                    <img src="/icons/platforms.svg" alt="Platforms" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-text-secondary">Wide Selection of Platforms</h3>
                    <p className="text-text-primary text-sm font-normal">
                    Explore a diverse array of social media platforms including Instagram, TikTok, X(Twitter), YouTube, and more, offering you the flexibility to find the perfect fit for your digital strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

               {/* Responsive Customer Support */}
           <div className='bg-background rounded-[10px]'>
                {/* Gradient Line */}
                <div className="h-2 w-full rounded-full rounded-b-none bg-gradient-to-r from-[#0B4B5A] via-[#D9700A] to-[#D9700A] mb-4"></div>
               <div className='p-6'>
                <div className="flex items-center gap-6">
                  <div className="bg-quinary p-4 rounded-full flex-shrink-0">
                    <img src="/icons/support.svg" alt="Support" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-text-secondary">Responsive Customer Support</h3>
                    <p className="text-text-primary text-sm font-normal">
                    Our dedicated support team is available to assist you with any inquiries, concerns, or technical issues, providing prompt and responsive assistance to ensure your satisfaction.
                    </p>
                  </div>
                </div>
              </div>
           </div>

              {/* Quality Assurance */}
            <div className='bg-background rounded-[10px]'>
                  {/* Gradient Line */}
                  <div className="h-2 w-full rounded-full rounded-b-none bg-gradient-to-r from-[#0B4B5A] via-[#D9700A] to-[#D9700A] mb-4"></div>
              <div className='p-6'>
                <div className="flex items-center gap-6">
                  <div className="bg-quinary p-4 rounded-full flex-shrink-0">
                    <img src="/icons/authentic-profiles.svg" alt="Quality" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 font-normal text-text-secondary">Quality Assurance</h3>
                    <p className="text-text-primary text-sm">
                    CruiseTechlogs upholds strict quality standards, offering only high-quality accounts with genuine followers, active engagement, and organic growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 sm:py-16 bg-">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold mb-2 text-text-secondary">How it Works</h2>
            <p className="text-text-primary text-lg">We sell account for all your favourite Platforms. Below are some of them</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Card 1 - Create Account */}
            <div className="relative w-full max-w-[400px] mx-auto">
              {/* Blue background card - skewed */}
              <div style={{clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 93%)'}} 
                className="bg-quinary mx-3 sm:mx-6 rounded-[20px] absolute w-[90%] sm:w-80 h-full">
              </div>

              {/* White front card */}
              <div style={{
                clipPath: 'polygon(0 0, 90% 6%, 92% 91%, 0 100%)', 
                borderTopRightRadius: '120px',
                borderBottomRightRadius: '120px'
              }} 
                className="relative bg-background rounded-[20px] p-6 sm:p-8 pr-16 sm:pr-20 w-full text-center min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
                <img 
                  src="/create-account.png" 
                  alt="Create Account" 
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-secondary">Create CruiseTechlogs account</h3>
                <p className="text-text-primary text-start text-sm mb-4 sm:mb-6">
                  Create your CruiseTechlogs account to begin exploring our curated selection of social media accounts. Registration is quick, easy, and free.
                </p>
                <button className="bg-quinary self-start w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mt-auto">
                  <img 
                    src="/icons/arrow.svg" 
                    alt="Create Account" 
                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Card 2 - Explore Accounts */}
            <div className="relative w-full max-w-[400px] mx-auto">
              {/* Copy the same structure as Card 1, just change content */}
              <div style={{clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 93%)'}} 
                className="bg-quinary mx-3 sm:mx-6 rounded-[20px] absolute w-[90%] sm:w-80 h-98">
              </div>

              <div style={{clipPath: 'polygon(0 0, 90% 6%, 92% 91%, 0 100%)', 
  borderTopRightRadius: '120px',
  borderBottomRightRadius: '120px'}} 
                className="relative bg-background rounded-[20px] p-6 sm:p-8 pr-16 sm:pr-20 w-full text-center min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
                <img 
                  src="/explore-accounts.png" 
                  alt="Explore Accounts" 
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-secondary">Explore Accounts</h3>
                <p className="text-text-primary text-start text-sm mb-4 sm:mb-6">
                  Browse and buy social media accounts presented in your needs. Filter by platform niches, and guidance to find your perfect match.
                </p>
                <button className="bg-quinary self-start w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mt-auto">
                  <img 
                    src="/icons/arrow.svg" 
                    alt="Create Account" 
                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Card 3 - Review Accounts */}
            <div className="relative w-full max-w-[400px] mx-auto">
              {/* Copy the same structure as Card 1, just change content */}
              <div style={{clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 93%)'}} 
                className="bg-quinary mx-3 sm:mx-6 rounded-[20px] absolute w-[90%] sm:w-80 h-full">
              </div>

              <div style={{clipPath: 'polygon(0 0, 90% 6%, 92% 91%, 0 100%)', 
  borderTopRightRadius: '120px',
  borderBottomRightRadius: '120px'}} 
                className="relative bg-background rounded-[20px] p-6 sm:p-8 pr-16 sm:pr-20 w-full text-center min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
                <img 
                  src="/review-accounts.png" 
                  alt="Review Accounts" 
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-secondary">Review Accounts</h3>
                <p className="text-text-primary text-start text-sm mb-4 sm:mb-6">
                  Get detailed account insights, including engagement rates and follower demographics. Our verification process ensures authenticity and quality.
                </p>
                <button className="bg-quinary  self-start w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mt-auto">
                  <img 
                    src="/icons/arrow.svg" 
                    alt="Create Account" 
                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Card 4 - Purchase Accounts */}
            <div className="relative w-full max-w-[400px] mx-auto">
              {/* Copy the same structure as Card 1, just change content */}
              <div style={{clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 93%)'}} 
                className="bg-quinary mx-3 sm:mx-6 rounded-[20px] absolute w-[90%] sm:w-80 h-full">
              </div>

              <div style={{clipPath: 'polygon(0 0, 90% 6%, 92% 91%, 0 100%)', 
  borderTopRightRadius: '120px',
  borderBottomRightRadius: '120px'}} 
                className="relative bg-background rounded-[20px] p-6 sm:p-8 pr-16 sm:pr-20 w-full text-center min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
                <img 
                  src="/purchase-accounts.png" 
                  alt="Purchase Accounts" 
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-secondary">Purchase Accounts</h3>
                <p className="text-text-primary text-start text-sm mb-4 sm:mb-6">
                  Securely purchase your chosen social media account with our smooth transaction process. Enjoy flexible payment pricing for an easy experience.
                </p>
                <button className="bg-quinary  self-start w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mt-auto">
                  <img 
                    src="/icons/arrow.svg" 
                    alt="Create Account" 
                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Card 5 - Enjoy your Account */}
            <div className="relative w-full max-w-[400px] mx-auto">
              {/* Copy the same structure as Card 1, just change content */}
              <div style={{clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 93%)'}} 
                  className="bg-quinary mx-3 sm:mx-6 rounded-[20px] absolute w-[90%] sm:w-80 h-full">
              </div>

              <div style={{clipPath: 'polygon(0 0, 90% 6%, 92% 91%, 0 100%)', 
                    borderTopRightRadius: '120px',
                    borderBottomRightRadius: '120px'}} 
                className="relative bg-background rounded-[20px] p-6 sm:p-8 pr-16 sm:pr-20 w-full text-center min-h-[350px] sm:min-h-[400px] flex flex-col items-center">
                <img 
                  src="/enjoy-account.png" 
                  alt="Enjoy your Account" 
                  className="w-24 sm:w-32 h-24 sm:h-32 object-contain mx-auto"
                />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-secondary">Enjoy your Account</h3>
                <p className="text-text-primary text-start text-sm mb-4 sm:mb-6">
                  Begin your online presence with your new social media account. Connect with your audience and achieve your marketing goals.
                </p>
                <button className="bg-quinary  self-start w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mt-auto">
                  <img 
                    src="/icons/arrow.svg" 
                    alt="Create Account" 
                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Buy Section */}
      <section className="container mx-auto bg-primary my-18 relative overflow-hidden rounded-[25px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Image */}
            <div className="relative">
              <img 
                src="/happy-man.png" 
                alt="Happy man using phone" 
                className="w-full max-w-3xl mx-auto object-contain"
              />
            </div>

            {/* Right Column - Content */}
            <div className="text-background space-y-6 py-6">
              <h2 className="text-4xl sm:text-5xl font-bold ">Ready to buy?</h2>
              <p className="text-lg sm:text-xl">
                That's why we are here, join us today and start buying your account from our market today.
              </p>
            
              <Button
                  variant="quinary"
                  size="lg"
                  to="/dashboard/buy-numbers"
                  className="w-fit  sm:w-auto"
                >
                  Go to Market
                </Button>
            </div>
          </div>
        </div>

        {/* Background Pattern/Gradient (optional) */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
          }}
        ></div>
      </section>
      </main>

     

      {/* Footer with correct layout */}
      <footer className="w-full py-6">
        <div className="container mx-auto px-4">
          {/* Top section with logo, social icons, and email */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
            {/* Logo */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <Link to="/">
            <img 
            src="/images/CruiseTech-2.svg" 
 
              alt="CruiseTech Logo" 
              className="h-8 sm:h-10 md:h-12"
            /></Link>
            </div>

            {/* Social Media Links */}
            <div className="w-full md:w-1/3  flex justify-center gap-6">
              <a href="#" className="text-quinary transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-quinary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-quinary transition-colors">
                <FaTiktok size={20} />
              </a>
              <a href="#" className="text-quinary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-quinary transition-colors">
                <FaTelegram size={20} />
              </a>
            </div>

            {/* Email Contact */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end items-center gap-2">
              <MdEmail className="text-quinary" size={20} />
              <a href="mailto:cruisetech40@gmail.com" className="text-quinary text-sm md:text-[15px] font-semibold transition-colors">
                cruisetech40@gmail.com
              </a>
            </div>
          </div>

          {/* Bottom section with copyright and links */}
          <div className="text-sm md:text-[15px] text-text-secondary font-semibold flex flex-wrap justify-center gap-x-2 gap-y-1 pt-4 border-t border-t-quinary">
            <span>© 2025 Cruisetechlogs</span>
            <span className="hidden md:inline">|</span>
            <a href="/privacy-policy" className=" transition-colors">Privacy Policy</a>
            <span className="hidden md:inline">|</span>
            <a href="/terms" className="transition-colors">Terms and conditions</a>
            <span className="hidden md:inline">|</span>
            <a href="/api-docs" className="transition-colors">API documentation</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
