import React, { useState } from "react";
import ProductCard from "../ProductCard";
import ProductSection from "../ProductSection";

const platforms = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Twitter", value: "twitter" },
  // Add more as needed
];

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Aged", value: "aged" },
  { label: "Fresh", value: "fresh" },
  // Add more as needed
];

const productData = [
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "aged",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "aged",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "aged",
  },
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
    platform: "facebook",
    category: "aged",
  },
  // ...add more products as needed
];

const SocialMediaAccounts = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter logic (DRY)
  const filteredProducts = productData.filter(
    (p) =>
      (!selectedPlatform || p.platform === selectedPlatform) &&
      (!selectedCategory || p.category === selectedCategory)
  );

  // Group products by platform
  const platformsToShow = selectedPlatform
    ? platforms.filter((p) => p.value === selectedPlatform)
    : platforms;

  return (
    <div className="bg-background px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Social Media Accounts</h2>
        <button className="bg-quinary hover:bg-quaternary text-white font-medium px-6 py-2 rounded-full text-sm transition">
          View Orders
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          className="flex-1 border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm md:text-base"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="">Choose Platform</option>
          {platforms.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <select
          className="flex-1 border border-[#E5E7EB] rounded-sm px-4 py-3 text-sm md:text-base"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Choose Category</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Product Sections for each platform */}
      {platformsToShow.map((platform) => {
        const productsForPlatform = filteredProducts.filter(
          (p) => p.platform === platform.value
        );
        if (productsForPlatform.length === 0) return null;
        return (
          <div key={platform.value} className="mb-8">
            <ProductSection
              title={`${platform.label} Accounts`}
              products={productsForPlatform}
              onBuy={() => {}}
              onStockClick={() => {}}
              showViewAll={true}
              viewAllLabel={`View All ${platform.label}`}
              mobileViewMoreLabel={`View More ${platform.label}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SocialMediaAccounts;
