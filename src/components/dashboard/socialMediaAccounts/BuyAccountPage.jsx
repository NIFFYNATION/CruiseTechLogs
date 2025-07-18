import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../common/Button";
import { FiInfo, FiCopy, FiCheckCircle, FiXCircle } from "react-icons/fi";
import ReviewOrderModal from "./ReviewOrderModal";
import CartItem from "./CartItem";
import CartQuantityControl from "./CartQuantityControl";
import {
  fetchAccountDetails,
  buyAccount,
  createAccountLoginsFetcher,
} from "../../../services/socialAccountService";
// import PageSpinner from "../PageSpinner";
import { money_format } from "../../../utils/formatUtils";
import Toast from "../../common/Toast";
import { SkeletonTableRow, SkeletonBuyAccountCard } from "../../common/Skeletons";
import { useUser } from '../../../contexts/UserContext';
import CleanText from "../../common/helper";

const BuyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: urlAccountID } = useParams(); // <-- get ID from URL

  // Get state passed from navigation
  const { platform, category, product } = location.state || {};

  const defaultProduct = {
    title: "Random FB|100–300friends (3 months +)",
    price: "1,200",
  };
  // Use product from state or default, but will update with API response if available
  const [usedProduct, setUsedProduct] = useState(product || defaultProduct);
  const [usedPlatform, setUsedPlatform] = useState(
    platform || { name: "Facebook", icon: "/icons/facebook.svg" }
  );
  const [usedCategory, setUsedCategory] = useState(
    category || { name: "RANDOM COUNTRIES FB" }
  );

  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // --- Loading states ---
  const [detailsLoading, setDetailsLoading] = useState(!!urlAccountID);
  const [loginsLoading, setLoginsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // ADD
  const [hasMoreLogins, setHasMoreLogins] = useState(true); // ADD
  const loginsTableRef = useRef(null); // ADD
  const loginsFetcherRef = useRef(null); // ADD

  // --- Logins state ---
  const [logins, setLogins] = useState([]);

  // --- Search state ---
  const [searchTerm, setSearchTerm] = useState("");
  const [pastedLinks, setPastedLinks] = useState([]);
  const [matchedLogins, setMatchedLogins] = useState([]);
  const [notFoundLinks, setNotFoundLinks] = useState([]);

  // State for description expand/collapse
  const [descExpanded, setDescExpanded] = useState(false);

  // --- Memos for description handling ---
  const { fullDescriptionHtml, plainDescription, isLongDescription } = useMemo(() => {
    if (!usedProduct.description) {
      return { fullDescriptionHtml: "", plainDescription: "", isLongDescription: false };
    }
    // Decode HTML entities
    const decodedHtml = (usedProduct.description || "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Strip HTML tags to get plain text
    const plainText = decodedHtml.replace(/<[^>]*>/g, "").trim();

    return {
      fullDescriptionHtml: decodedHtml,
      plainDescription: plainText,
      isLongDescription: plainText.length > 120,
    };
  }, [usedProduct.description]);

  const availableLogins = useMemo(() => {
    const cartLoginIds = new Set(cart.map((item) => item.accountId));
    return logins.filter((login) => !cartLoginIds.has(login.accountId || login.ID));
  }, [logins, cart]);

  // Handle paste event in search input
  const handleSearchPaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && pasted.includes('\n')) {
      const links = pasted.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      setPastedLinks(links);
      // We'll also set the searchTerm to the pasted value
      setSearchTerm(pasted);
    }
  };

  // Match pasted links to available logins
  useEffect(() => {
    if (pastedLinks.length === 0) {
      setMatchedLogins([]);
      setNotFoundLinks([]);
      return;
    }
    // Use availableLogins (not in cart)
    const found = [];
    const notFound = [];
    pastedLinks.forEach(link => {
      const match = availableLogins.find(l => l.preview_link === link);
      if (match) {
        found.push(match);
      } else {
        notFound.push(link);
      }
    });
    setMatchedLogins(found);
    setNotFoundLinks(notFound);
  }, [pastedLinks, availableLogins]);

  const filteredLogins = useMemo(() => {
    if (!searchTerm) {
      return availableLogins;
    }
    // If user pasted links, only show matched logins
    if (pastedLinks.length > 0) {
      return matchedLogins;
    }
    const searchTerms = searchTerm
      .split(/[\n,]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (searchTerms.length === 0) {
      return availableLogins;
    }
    return availableLogins.filter((login) => {
      const username = (login.username || "").toLowerCase();
      const link = (login.preview_link || "").toLowerCase();
      return searchTerms.some((term) => username.includes(term) || link.includes(term));
    });
  }, [availableLogins, searchTerm, pastedLinks, matchedLogins]);

  const shortDescriptionText = isLongDescription
    ? plainDescription.slice(0, 300) + "..."
    : plainDescription;

  const { user } = useUser();

  // Calculate discount based on user stage and order quantity
  const calculateDiscount = useMemo(() => {
    if (!user?.stage) return { discountAmount: 0, discountPercent: 0, isEligible: false };
    
    const { discount, discount_type, no_order } = user.stage;
    const discountValue = Number(discount) || 0;
    const requiredQuantity = Number(no_order) || 0;
    
    // Determine order quantity (quantity takes priority over cart.length if quantity > 0)
    const orderQuantity = quantity > 0 ? quantity : cart.length;
    
    // Check if user qualifies for discount
    const isEligible = orderQuantity >= requiredQuantity;
    
    if (!isEligible) {
      return { discountAmount: 0, discountPercent: 0, isEligible: false };
    }
    
    // Calculate total before discount
    const totalBeforeDiscount = cart.length > 0
      ? cart.reduce((sum, item) => sum + (Number(String(item.amount || item.price || 0).replace(/,/g, "")) || 0), 0)
      : quantity > 0
      ? quantity * (Number(String(usedProduct.amount || usedProduct.price || 0).replace(/,/g, "")) || 0)
      : 0;
    
    let discountAmount = 0;
    let discountPercent = 0;
    
    if (discount_type === "percentage") {
      discountPercent = discountValue;
      discountAmount = Math.round(totalBeforeDiscount * (discountValue / 100));
    } else if (discount_type === "fixed") {
      discountAmount = discountValue;
      discountPercent = totalBeforeDiscount > 0 ? Math.round((discountValue / totalBeforeDiscount) * 100) : 0;
    }
    
    return { discountAmount, discountPercent, isEligible: true };
  }, [user?.stage, quantity, cart, usedProduct.amount, usedProduct.price]);

  // Calculate final total with discount applied
  const totalBeforeDiscount = cart.length > 0
    ? cart.reduce((sum, item) => sum + (Number(String(item.amount || item.price || 0).replace(/,/g, "")) || 0), 0)
    : quantity > 0
    ? quantity * (Number(String(usedProduct.amount || usedProduct.price || 0).replace(/,/g, "")) || 0)
    : 0;

  const finalTotal = totalBeforeDiscount - calculateDiscount.discountAmount;

  // Get base price for individual items (no discount applied to individual prices)
  const basePrice = Number(String(usedProduct.amount || usedProduct.price || 0).replace(/,/g, '')) || 0;

  // Always fetch latest account details on mount or when urlAccountID or product changes
  useEffect(() => {
    let accountIdToFetch = urlAccountID || product?.ID || product?.accountID;
    if (!accountIdToFetch) return;
    setDetailsLoading(true);
    fetchAccountDetails(accountIdToFetch)
      .then((data) => {
        if (data) {
          setUsedProduct((prev) => ({
            ...prev,
            ...data,
            price: data.amount ?? prev.price,
            title: data.title ?? prev.title,
            stock: data.total ?? prev.stock,
            description: data.description ?? prev.description,
          }));
          if (data.platform) {
            setUsedPlatform(data.platform);
          }
          if (data.category) {
            setUsedCategory(data.category);
          }
        }
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  }, [urlAccountID, product]);

  // Fetch logins in paginated batches on mount (or when product changes)
  useEffect(() => {
    let cancelled = false;
    const accountID = urlAccountID || usedProduct?.ID || usedProduct?.accountID;
    if (!accountID) return;
    setLoginsLoading(true);
    setLoadingMore(false);
    setLogins([]);
    setHasMoreLogins(true);
    // Create new fetcher instance
    const fetcher = createAccountLoginsFetcher(accountID);
    loginsFetcherRef.current = fetcher;
    fetcher.subscribe(({ logins: newLogins, hasMore, loading }) => {
      if (!cancelled) {
        setLogins(newLogins);
        setHasMoreLogins(hasMore);
        setLoginsLoading(loading && newLogins.length === 0);
        setLoadingMore(loading && newLogins.length > 0);
      }
    });
    fetcher.fetchInitial();
    return () => {
      cancelled = true;
    };
  }, [urlAccountID, usedProduct]);

  // Infinite scroll for logins table
  useEffect(() => {
    const el = loginsTableRef.current;
    if (!el) return;
    function handleScroll() {
      if (loginsLoading || loadingMore || !hasMoreLogins) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
        // Near bottom
        loginsFetcherRef.current && loginsFetcherRef.current.fetchMore();
      }
    }
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loginsLoading, loadingMore, hasMoreLogins]);

  const total = cart.reduce(
    (sum, item) => sum + (Number(String(item.price || 0).replace(/,/g, "")) || 0),
    0
  );

  const onClearCart = () => {
    setCart([]);
  };

  const onIncrement = () => {
    setCart(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        platform: usedPlatform,
        accountId: urlAccountID || usedProduct.ID || "6156861375259",
        price: usedProduct.amount,
      }
    ]);
  };

  const onDecrement = () => {
    if (cart.length > 0) setCart(prev => prev.slice(0, -1));
  };

  // Handler for manual quantity change: only update quantity, do not auto-select logins
  const handleManualQuantityChange = (val) => {
    setQuantity(val);
  };

  const handleCopyCart = () => {
    if (cart.length === 0) return;
    const links = cart.map((item) => item.preview_link).join("\n");
    navigator.clipboard
      .writeText(links)
      .then(() => {
        // Using toast instead of alert
        setToast({ show: true, message: "Copied to clipboard!", type: "success" });
      })
      .catch((err) => {
        console.error("Failed to copy cart links: ", err);
        setToast({ show: true, message: "Failed to copy cart links.", type: "error" });
      });
  };

  const handleBuy = async () => {
    setIsOrdering(true);

    const accountID = urlAccountID || usedProduct?.ID || usedProduct?.accountID;
    if (!accountID) {
      setToast({ show: true, message: "Error: Could not determine the account ID.", type: 'error' });
      setIsOrdering(false);
      return;
    }

    let payload = {};
    if (cart.length > 0) {
      const loginIds = cart.map((item) => item.accountId).join(",");
      payload = { choices: loginIds };
    } else if (quantity > 0) {
      payload = { qty: quantity };
    } else {
      setToast({ show: true, message: "Your cart is empty.", type: 'error' });
      setIsOrdering(false);
      return;
    }

    const result = await buyAccount(accountID, payload);

    setIsOrdering(false);

    if (result.success && result.data?.ID) {
      setReviewOpen(false);
      navigate(
        `/dashboard/accounts/order/${result.data.ID}`,
        {
          state: { order: result.data },
        }
      );
    } else {
      setToast({ show: true, message: `Order failed: ${result.message}`, type: 'error' });
    }
  };

  // Add all matched logins to cart
  const handleAddAllMatchedToCart = () => {
    if (matchedLogins.length === 0) return;
    setCart(prev => [
      ...prev,
      ...matchedLogins.map(login => ({
        id: Date.now() + Math.random(),
        platform: usedPlatform,
        accountId: login.accountId || login.ID,
        price: basePrice,
        item: usedProduct,
        username: login.username ?? undefined,
        preview_link: login.preview_link,
      }))
    ]);
    setPastedLinks([]);
    setMatchedLogins([]);
    setNotFoundLinks([]);
    setSearchTerm("");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setPastedLinks([]);
      setMatchedLogins([]);
      setNotFoundLinks([]);
    }
  };

  const pageIsLoading = detailsLoading;

  if (pageIsLoading) {
    return (
      <div className="p-6">
        <SkeletonBuyAccountCard className="mb-6" />
      </div>
    );
  }

  return (
     <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    {/* Product Summary */}
    <div className="bg-white rounded-xl shadow p-6 mb-6  border-b-[#FFDE59] border-b-2">
      <img src={usedPlatform.icon} alt={usedPlatform.name} className="w-10 h-10" />
      <div className="flex items-start gap-4 py-2">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-base text-primary">{usedProduct.title}</h3>
            <span className="font-semibold text-primary text-lg">{money_format(basePrice)}{calculateDiscount.isEligible && calculateDiscount.discountPercent > 0 && <span className="ml-2 text-green-600 text-xs font-bold">-{calculateDiscount.discountPercent}%</span>}</span>
          </div>
          <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between mt-1">
            <span className="text-xs text-text-secondary py-2">
              {plainDescription && (
                <span>
                  {isLongDescription && !descExpanded ? (
                    <span>  <CleanText rawText={shortDescriptionText} /></span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: fullDescriptionHtml }} />
                  )}
                  {isLongDescription && !descExpanded && (
                    <button
                      className="ml-2 text-quinary underline cursor-pointer"
                      onClick={() => setDescExpanded(true)}
                      type="button"
                      style={{ fontSize: "12px" }}
                    >
                      See More
                    </button>
                  )}
                  {isLongDescription && descExpanded && (
                    <button
                      className="ml-2 text-quinary underline cursor-pointer"
                      onClick={() => setDescExpanded(false)}
                      type="button"
                      style={{ fontSize: "12px" }}
                    >
                      See Less
                    </button>
                  )}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between mt-1">
            <span className="text-xs text-text-secondary mt-1 sm:mt-0 ">
              Platform - <span className="text-primary font-semibold">{usedPlatform.name}</span>
            </span>
            
          </div>
        </div>
      </div>
    </div>

    <div className="bg-background shadow-xl px-0 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg min-h-screen">
    {user?.stage && !calculateDiscount.isEligible && (
              <span className="ms-6 block w-full sm:inline text-xs text-orange-600 font-medium mt-2 sm:mt-0">
                Add {Math.max(0, (Number(user.stage.no_order) || 0) - (quantity > 0 ? quantity : cart.length))} more for {user.stage.discount || 0}{user.stage.discount_type === "percentage" ? "%" : ""} discount
              </span>
            )}
      {/* Cart/Quantity Section */}
      <div className="bg-white p-6 py-0 border-b border-bgLayout">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
          <div className="flex items-center gap-">
            {/* Only show CartQuantityControl if cart is empty */}
            {cart.length === 0 && (
              <CartQuantityControl
                quantity={quantity}
                onIncrement={() => setQuantity((q) => Math.min(q + 1, usedProduct.stock))}
                onDecrement={() => setQuantity((q) => Math.max(q - 1, 0))}
                onClearCart={() => setQuantity(0)}
                available={usedProduct.stock}
                showAvailable={true}
                onChange={handleManualQuantityChange}
              />
            )}
          </div>
          <p className="font-semibold text-primary hidden sm:block">
            Total: <span></span> 
            {money_format(finalTotal)}
            {calculateDiscount.isEligible && calculateDiscount.discountAmount > 0 && (
              <span className="ml-2 text-green-600 text-xs font-bold">
                (Save {money_format(calculateDiscount.discountAmount)})
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full hidden sm:flex ">
            {cart.length === 0 ? (
              <h3 className="text-sm mt-1 text-primary">No Accounts Added</h3>
            ) : (
              <span className="font-semibold text-primary">Accounts Added</span>
            )}
            <Button
              variant="orange"
              size="md"
              className="mt-0 "
              onClick={() => setReviewOpen(true)}
            >
              Buy Account
            </Button>
          </div>
          {cart.length > 0 && (
            <>
              <div className="flex flex-col gap-4 w-full">
                {cart.map((item, idx) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                    onView={() => {/* handle view logic if needed */}}
                  />
                ))}
              </div>
              {/* Clear Cart Button - only when cart has items */}
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                  onClick={handleCopyCart}
                  style={{
                    minWidth: "auto",
                    fontSize: "13px",
                  }}
                >
                  <FiCopy className="w-4 h-4" />
                  Copy Cart
                </Button>
                <Button
                  variant="orange"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                  onClick={onClearCart}
                  style={{
                    minWidth: "auto",
                    fontSize: "13px",
                  }}
                >
                  <img src="/icons/trash.svg" alt="Clear Cart" className="w-4 h-4" />
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE CART (shown only on mobile) */}
      <div className="block sm:hidden bg-white p-4 mb-6 border-b border-bgLayout rounded-xl">
        {cart.length === 0 && quantity === 0 ? (
          <h3 className="text-sm mt-1 text-primary text-center">No Accounts Added</h3>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {/* ...existing code for cart items if needed... */}
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-base font-semibold mb-2">
                Total –{" "}
                <span className="text-primary font-bold">
                  {money_format(finalTotal)}
                </span>
                {calculateDiscount.isEligible && calculateDiscount.discountAmount > 0 && (
                  <span className="ml-2 text-green-600 text-xs font-bold">
                    (Save {money_format(calculateDiscount.discountAmount)})
                  </span>
                )}
              </p>
              <div className="flex w-full flex-col gap-2">
                <Button
                  variant="orange"
                  size="md"
                  className="w-full"
                  onClick={() => setReviewOpen(true)}
                  disabled={cart.length === 0 && quantity === 0}
                >
                  Buy Account
                </Button>
                {/* <div className="flex w-full justify-between gap-2 d-none">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2 px-2 py-1 text-xs"
                    onClick={handleCopyCart}
                    style={{ minWidth: "auto", fontSize: "12px" }}
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="orange"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2 px-2 py-1 text-xs"
                    onClick={onClearCart}
                    style={{
                      minWidth: "auto",
                      fontSize: "12px",
                    }}
                  >
                    <img src="/icons/trash.svg" alt="Clear Cart" className="w-4 h-4" />
                    Clear Cart
                  </Button>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Logins Table --- */}
      <div className="bg-white p-2 mt-6">
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search by username or preview link"
              className="w-full border border-border-grey rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={handleSearchChange}
              onPaste={handleSearchPaste}
            />
            <img
              src="/icons/search.svg"
              alt="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary"
            />
          </div>
        </div>

        {/* If user pasted links, show improved summary and add-all button */}
        {pastedLinks.length > 0 && (
          <div className="mb-4 border border-yellow-300 rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-white/80 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <FiCheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-700 text-base">
                {matchedLogins.length} login{matchedLogins.length !== 1 ? 's' : ''} found
              </span>
              <FiXCircle className="w-5 h-5 text-red-400 ml-4" />
              <span className="font-semibold text-red-500 text-base">
                {notFoundLinks.length} not found
              </span>
            </div>
            {notFoundLinks.length > 0 && (
              <div className="text-xs text-danger mb-2 flex items-start gap-2">
                <span className="font-bold">Not found:</span>
                <ul className="list-disc ml-4">
                  {notFoundLinks.map((link, i) => (
                    <li key={i} className="break-all text-red-600">{link}</li>
                  ))}
                </ul>
              </div>
            )}
            {matchedLogins.length > 0 && (
              <button
                className="mt-2 bg-gradient-to-r from-quinary to-quaternary text-white font-bold rounded-full px-6 py-2 text-sm shadow-lg hover:from-quaternary hover:to-quinary transition-colors focus:outline-none focus:ring-2 focus:ring-quinary focus:ring-offset-2"
                onClick={handleAddAllMatchedToCart}
              >
                <img src="/icons/cart.svg" alt="Add" className="inline-block w-4 h-4 mr-2 align-middle" />
                Add all found logins to cart
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div
          className="overflow-x-auto overflow-y-auto thin-scrollbar"
          style={{ maxHeight: '60vh', minHeight: '120px', height: 'auto', maxWidth: '100%',
            // Use 500px on desktop, 60vh on mobile
            ...(window.innerWidth >= 768 ? { maxHeight: '500px' } : { maxHeight: '65vh' })
          }}
          ref={loginsTableRef}
        >
          <table className="min-w-full text-sm">
            <thead>
              <tr className="sticky top-0 z-10 bg-white">
                <th className="py-3 px-0 sm:px-6 font-semibold">Platform</th>
                {/* <th className="py-3 px-0 sm:px-6 font-semibold">Account ID</th> */}
                <th className="py-3 px-0 sm:px-6 font-semibold">Price</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">View</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loginsLoading ? (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonTableRow key={i} cols={4} />
                  ))}
                </>
              ) : logins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-tertiary">No logins found.</td>
                </tr>
              ) : (
                filteredLogins.map((login, i) => (
                  <tr key={login.ID || i} className="border-b border-border-grey">
                    <td className="py-4 px-2 sm:px-6 flex items-center gap-2">
                      <img src={usedPlatform.icon} alt={usedPlatform.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-medium text-text-primary text-xs sm:text-base">{login.username ?? usedPlatform.name}</span>
                    </td>
                    {/* <td className="py-4 px-2 sm:px-6 text-text-primary text-xs sm:text-base truncate max-w-[80px] sm:max-w-none">
                      {login.accountId || login.ID}
                    </td> */}
                    <td className="text-primary font-semibold text-xs sm:text-base whitespace-nowrap">
                      {money_format(basePrice)}
                    </td>
                    <td className="">
                      <a
                        href={login.preview_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-primary hover:bg-quinary transition"
                      >
                        <img src="/icons/eye-bold.svg" alt="View" className="w-4 h-4 sm:w-5 sm:h-5 invert-0" />
                      </a>
                    </td>
                    <td className="">
                      <Button
                        variant="orange"
                        size="sm"
                        shape="rounded"
                        className="px-2 sm:px-5 rounded-lg md:rounded-full flex items-center justify-center"
                        onClick={() => {
                          setCart(prev => [
                            ...prev,
                            {
                              id: Date.now() + Math.random(),
                              platform: usedPlatform,
                              accountId: login.accountId || login.ID,
                              price: basePrice,
                              item: usedProduct,
                              username: login.username ?? undefined,
                              preview_link: login.preview_link,
                            }
                          ]);
                        }}
                      >
                        <img src="/icons/cart.svg" alt="Add to Cart" className="w-4 h-4 mr-0 sm:mr-2" />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              {loadingMore && (
                <tr><td colSpan={5} className="text-center py-4 text-quinary">Loading more...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <ReviewOrderModal
      open={reviewOpen}
      cart={cart}
      quantity={quantity}
      product={usedProduct}
      onClose={() => setReviewOpen(false)}
      onBuy={handleBuy}
      onRemove={(idx) => setCart((prev) => prev.filter((_, i) => i !== idx))}
      onClearCart={() => setCart([])}
      onIncrement={() => {
        if (availableLogins.length > 0) {
          const loginToAdd = availableLogins[0];
          setCart((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              platform: usedPlatform,
              accountId: loginToAdd.accountId || loginToAdd.ID,
              price: basePrice,
              item: usedProduct,
              username: loginToAdd.username ?? undefined,
              preview_link: loginToAdd.preview_link,
            },
          ]);
        }
      }}
      onDecrement={() => {
        if (cart.length > 0) {
          setCart((prev) => prev.slice(0, -1));
        }
      }}
      isProcessing={isOrdering}
      discountPercent={calculateDiscount.discountPercent}
      discountedPrice={basePrice}
      discountAmount={calculateDiscount.discountAmount}
      isEligibleForDiscount={calculateDiscount.isEligible}
      finalTotal={finalTotal}
    />
     </>
  );
};

export default BuyAccountPage;
