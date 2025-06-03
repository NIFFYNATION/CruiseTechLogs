import React from 'react';
import { FaFacebook, FaInstagram, FaXTwitter, FaLine } from 'react-icons/fa6'
import { SiWechat } from 'react-icons/si'
import { RiKakaoTalkFill } from 'react-icons/ri'

const Side = () => {
    return (
       
            <div className="w-full lg:w-1/2 bg-primary flex flex-col items-center justify-center text-background p-4 sm:p-6 lg:p-8 relative overflow-hidden min-h-[600px] lg:min-h-screen hidden lg:block">
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
    );
};

export default Side;