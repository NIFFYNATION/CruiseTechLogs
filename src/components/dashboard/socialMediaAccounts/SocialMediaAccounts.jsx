import React, { useState } from "react";
import ProductCard from "../ProductCard";
import ProductSection from "../ProductSection";
import SelectionModal from "./SelectionModal";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const platforms = [
  { label: "Facebook", value: "facebook", icon: "/icons/facebook.svg" },
  { label: "Instagram", value: "instagram", icon: "/icons/instagram.svg" },
  { label: "TikTok", value: "tiktok", icon: "/icons/tiktok.svg" },
  { label: "Twitter", value: "twitter", icon: "/icons/twitter.svg" },
  { label: "Google", value: "google", icon: "/icons/google.svg" },
  { label: "VPN", value: "vpn", icon: "/icons/nordvpn.svg" },
  { label: "Texting Apps", value: "texting", icon: "/icons/textplus.svg" },
  // Add more as needed
];

const categories = [
  { label: "RANDOM COUNTRIES FB", value: "random_fb" },
  { label: "USA FACEBOOK", value: "usa_fb" },
  { label: "EUROPE FACEBOOK", value: "europe_fb" },
  { label: "ASIA COUNTRIES", value: "asia" },
  { label: "OTHER COUNTRIES FB", value: "other_fb" },
  { label: "COUNTRIES FB (0-50 FRIENDS)", value: "fb_0_50" },
  { label: "FACEBOOK DATING", value: "fb_dating" },
  // Add more as needed
];

const productData = [
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "random_fb",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "random_fb",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "random_fb",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "random_fb",
  },
];

const SocialMediaAccounts = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter logic (DRY)
  const filteredProducts = productData.filter(
    (p) =>
      (!selectedPlatform || p.platform === selectedPlatform.value) &&
      (!selectedCategory || p.category === selectedCategory.value)
  );

  // Group products by platform
  const platformsToShow = selectedPlatform
    ? platforms.filter((p) => p.value === selectedPlatform.value)
    : platforms;

  return (
    <div className="bg-background px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Social Media Accounts</h2>
        <button className="bg-quinary hover:bg-quaternary text-white font-medium px-6 py-2 rounded-full text-sm transition">
          View Orders
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          className="flex-1 border border-border-grey rounded-sm px-4 py-3 text-sm md:text-base font-semibold flex items-center justify-between gap-2"
          onClick={() => setPlatformModalOpen(true)}
        >
          <span className="flex items-center gap-2">
            {selectedPlatform
              ? <>
                  <img src={selectedPlatform.icon} alt="" className="w-5 h-5" />
                  {selectedPlatform.label}
                </>
              : "Choose Platform"}
          </span>
          <img src="/icons/arrow-down.svg" alt="Arrow down" className="w-5 h-5" />
            </button>
        <button
          className="flex-1 border border-border-grey rounded-sm px-4 py-3 text-sm md:text-base font-semibold flex items-center justify-between gap-2 text-left"
          onClick={() => setCategoryModalOpen(true)}
        >
          <span>
            {selectedCategory
              ? selectedCategory.label
              : "Choose Category"}
          </span>
          <img src="/icons/arrow-down.svg" alt="Arrow down" className="w-5 h-5"/>
        </button>
      </div>

      {/* Product Sections for each platform */}
      {platformsToShow.map((platform) => {
        const productsForPlatform = filteredProducts.filter(
          (p) => p.platform === platform.value
        );
        if (productsForPlatform.length === 0) return null;
        return (
          <div key={platform.value} className="mb-8">
            <h3 className="text-base font-semibold text-text-primary mt-8">
              Random Countries {platform.label}
            </h3>
            <ProductSection
              products={productsForPlatform}
              onBuy={(product) => {
                navigate('/dashboard/social-media-accounts/buy', {
                  state: {
                    product,
                  },
                });
              }}
              onStockClick={() => {}}
              mobileViewMoreLabel={`View More ${platform.label}`}
            />
          </div>
        );
      })}

      {/* Platform Modal */}
      <SelectionModal
        open={platformModalOpen}
        onClose={() => setPlatformModalOpen(false)}
        onSelect={setSelectedPlatform}
        title="Choose Social Media Platform"
        options={platforms}
        showIcon={true}
      />

      {/* Category Modal */}
      <SelectionModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelect={setSelectedCategory}
        title="Choose Category"
        options={categories}
        showIcon={false}
      />
    </div>
  );
};

export default SocialMediaAccounts;
