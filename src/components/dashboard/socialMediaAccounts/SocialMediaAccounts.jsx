import React, { useState, useEffect, useRef } from "react";
import ProductSection from "../ProductSection";
import { useNavigate } from "react-router-dom";
import { fetchPlatforms, fetchCategories, fetchAccounts, fetchTotalInStock } from "../../../services/socialAccountService";
import PlatformSelect from "./PlatformSelect";
import CategorySelect from "./CategorySelect";
import SectionHeader from "../../common/SectionHeader";
import { FiBox } from "react-icons/fi";

const SocialMediaAccounts = () => {
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const navigate = useNavigate();
  const prevCategoryID = useRef();

  // Fetch categories on mount
  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then((data) => setCategories(data))
      .finally(() => setCategoriesLoading(false));
    setCategoryModalOpen(true);
  }, []);

  // Fetch platforms when a new category is selected
  useEffect(() => {
    if (selectedCategory && selectedCategory.ID !== prevCategoryID.current) {
      setPlatformsLoading(true);
      fetchPlatforms(selectedCategory.ID)
        .then((data) => setPlatforms(data))
        .finally(() => setPlatformsLoading(false));
      prevCategoryID.current = selectedCategory.ID;
    }
  }, [selectedCategory]);

  // Fetch accounts when category or platform changes
  useEffect(() => {
    if (selectedCategory && selectedPlatform) {
      setLoading(true);
      // If platform is selected, pass both; else only category
      fetchAccounts({
        page: 1,
        category: selectedCategory.ID,
        platform: selectedPlatform ? selectedPlatform.platformID : undefined,
      })
        .then((data) => setAccounts(data))
        .finally(() => setLoading(false));
    } else {
      setAccounts([]);
    }
  }, [selectedPlatform, selectedCategory]);

  useEffect(() => {
    if (
      selectedCategory &&
      Array.isArray(platforms)
    ) {
      if (platforms.length === 1) {
        setSelectedPlatform(platforms[0]);
        setPlatformModalOpen(false);
      } else {
        setSelectedPlatform(null); // reset platform if multiple
        setPlatformModalOpen(true); // ensure modal opens for multiple
      }
    }
  }, [platforms, selectedCategory]);

  // Handler to fetch total in stock for an accountID
  const handleGetTotalStock = async (accountID) => {
    return await fetchTotalInStock(accountID);
  };

  return (
    <div className="bg-background px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg min-h-screen">
      <SectionHeader
        title="Social Media Accounts"
        buttonText="View Orders"
        onButtonClick={() => navigate("/dashboard/manage-orders")}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          className="flex-1 border border-border-grey rounded-sm px-4 py-3 text-sm md:text-base font-semibold flex items-center justify-between gap-2 text-left"
          onClick={() => setCategoryModalOpen(true)}
        >
          <span>
            {selectedCategory
              ? selectedCategory.name
              : "Choose Category"}
          </span>
          <img src="/icons/arrow-down.svg" alt="Arrow down" className="w-5 h-5"/>
        </button>

         <button
          className="flex-1 border border-border-grey rounded-sm px-4 py-3 text-sm md:text-base font-semibold flex items-center justify-between gap-2"
          onClick={() => setPlatformModalOpen(true)}
        >
          <span className="flex items-center gap-2">
            {selectedPlatform
              ? <>
                  <img src={selectedPlatform.icon} alt="" className="w-5 h-5" />
                  {selectedPlatform.name}
                </>
              : "Choose Platform"}
          </span>
          <img src="/icons/arrow-down.svg" alt="Arrow down" className="w-5 h-5" />
        </button>
      </div>

      {/* Product Section */}
      {selectedPlatform && selectedCategory && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-text-primary mt-8">
            {selectedPlatform.name} - {selectedCategory.name}
          </h3>
          <ProductSection
            products={accounts}
            loading={loading}
            onBuy={(product) => {
              navigate('/dashboard/accounts/buy', {
                state: {
                  product,
                },
              });
            }}
            onStockClick={() => {}}
            mobileViewMoreLabel={``}
            platform={selectedPlatform}
            onGetTotalStock={handleGetTotalStock}
          />
          {/* If no accounts found, show a helpful message */}
          {!loading && accounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <FiBox className="w-16 h-16 mb-4 text-quinary" />
              <h4 className="text-md font-semibold text-text-secondary mb-2">No accounts with available logins found.</h4>
              <p className="text-sm text-text-grey mb-4 text-center">
                Please choose a different <span className="font-semibold text-quinary">category</span> and <span className="font-semibold text-quinary">platform</span> to see available accounts.
              </p>
              <div className="flex gap-2">
                <button
                  className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition"
                  onClick={() => setCategoryModalOpen(true)}
                >
                  Choose Category
                </button>
                <button
                  className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition"
                  onClick={() => setPlatformModalOpen(true)}
                >
                  Choose Platform
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* If nothing is selected, show a prompt to choose category/platform */}
      {!selectedPlatform || !selectedCategory ? (
        <div className="flex flex-col items-center justify-center py-16">
          <img src="/icons/filter.svg" alt="Choose Filters" className="w-16 h-16 mb-4" />
          <h4 className="text-lg font-semibold text-text-secondary mb-2">Start by choosing a category</h4>
          <p className="text-sm text-text-grey mb-4 text-center">
            Please select a <span className="font-semibold text-quinary">category</span> and <span className="font-semibold text-quinary">platform</span> to view available accounts.
          </p>
          <button
            className="bg-quinary hover:bg-quaternary text-white font-medium px-4 py-2 rounded-full text-sm transition"
            onClick={() => setCategoryModalOpen(true)}
          >
            Choose Category
          </button>
        </div>
      ) : null}

      {/* Platform Modal */}
      <PlatformSelect
        open={platformModalOpen}
        onClose={() => setPlatformModalOpen(false)}
        platforms={platforms}
        onSelect={(platform) => {
          setSelectedPlatform(platform);
          setPlatformModalOpen(false);
        }}
        onSelectCategory={() => { setPlatformModalOpen(false); setCategoryModalOpen(true); }}
        loading={platformsLoading}
      />

      {/* Category Modal */}
      <CategorySelect
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onSelect={(category) => {
          setSelectedCategory(category);
          setCategoryModalOpen(false);
          setPlatformModalOpen(true); // always open
        }}
        loading={categoriesLoading}
      />
    </div>
  );
};

export default SocialMediaAccounts;
