import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";
import { FiInfo } from "react-icons/fi";

const BuyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get state passed from navigation
  const { platform, category, product } = location.state || {};

  const [quantity, setQuantity] = React.useState(0);
  const [cart, setCart] = React.useState([]);

  // Fallbacks if user navigates directly
  if (!platform || !category || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-500 mb-4">Missing account details.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/,/g, "")),
    0
  );

  return (

     <>
     {/* Product Summary */}
      <div className="bg-white rounded-xl shadow p-6 mb-6  border-b-[#FFDE59] border-b-2">
          <img src={platform.icon} alt={platform.label} className="w-10 h-10" />
        <div className="flex items-start gap-4 py-2">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-base text-primary">{product.title}</h3>
              <span className="font-semibold text-primary text-lg">₦ {product.price}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
              <span className="text-xs text-text-secondary  py-2">
                Login Format – <span className="text-primary font-semibold">ID | Password | 2fa key | Mail | Mail password</span>
              </span>
              <span className="text-xs text-text-secondary mt-1 sm:mt-0 ">
                Platform - <span className="text-primary font-semibold">{platform.label}</span>
              </span>
            </div>
            <Button
              variant="textDanger"
              size="sm"
              className="mt-2 px-0 text-quinary"
              onClick={() => alert("Show important instructions")}
              style={{padding: "0px"}}
            >
              See Important Instructions
            </Button>
          </div>
        </div>
      </div>

    <div className="bg-background shadow-xl px-0 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg min-h-screen">
     

      {/* Cart/Quantity Section */}
      <div className="bg-white p-6 mb-6 border-b border-bgLayout">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center w-45 md:w-56 h-9 md:h-11 border border-primary rounded-lg overflow-hidden">
            <button
              className="flex-1 h-full flex items-center justify-center text-xl text-primary hover:bg-primary/10 transition"
              onClick={() => {
                if (cart.length > 0) {
                  setCart(prev => prev.slice(0, -1));
                }
              }}
              aria-label="Decrease"
              type="button"
              style={{ borderRight: '1.5px solid #0B4B5A' }}
              disabled={cart.length === 0}
            >
              –
            </button>
            <div className="flex-1 h-full flex items-center justify-center text-2xl text-primary font-semibold"
              style={{ borderRight: '1.5px solid #0B4B5A' }}
            >
              {cart.length}
            </div>
            <button
              className="flex-1 h-full flex items-center justify-center text-2xl text-primary hover:bg-primary/10 transition"
              onClick={() => {
                // Add a new account (simulate, or use real data)
                setCart(prev => [
                  ...prev,
                  {
                    id: Date.now() + Math.random(),
                    platform,
                    accountId: "6156861375259",
                    price: product.price,
                  }
                ]);
              }}
              aria-label="Increase"
              type="button"
            >
              +
            </button>
          </div>
          <span className="text-quinary font-semibold text-xs md:text-base">277 Accounts Available</span>
        </div>
          <p className="font-semibold text-primary hidden sm:block">Total – ₦{total.toLocaleString()}</p>
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
              onClick={() => alert("Buy Account")}
            >
              Buy Account
            </Button>
          </div>
          {cart.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#FAFAFA] rounded-xl py-3 px-8 hidden sm:flex"
                >
                  <div className="flex items-center gap-2">
                    <img src={item.platform.icon} alt={item.platform.label} className="w-6 h-6" />
                    <span className="font-medium text-text-primary">{item.platform.label}</span>
                  </div>
                  <span className="text-text-primary">{item.accountId}</span>
                  <span className="text-primary font-semibold">₦{item.price}</span>
                  <button className="w-9 h-9 hidden sm:flex items-center justify-center rounded-lg bg-primary hover:bg-quinary transition">
                    <img src="/icons/eye-bold.svg" alt="View" className="w-5 h-5 invert-0" />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-quinary transition"
                    onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                  >
                    <span className="text-white text-xl font-bold">–</span>
                  </button>
                </div>
                
              ))}
          </div>
          )}
         </div>
      </div>

      {/* MOBILE CART (shown only on mobile) */}
      <div className="block sm:hidden bg-white p-4 mb-6 border-b border-bgLayout rounded-xl">
        {cart.length === 0 ? (
          <h3 className="text-sm mt-1 text-primary text-center">No Accounts Added</h3>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#FAFAFA] rounded-xl px-2 py-3 gap-2"
                >
                  <div className="flex items-center gap-2 ">
                    <img src={item.platform.icon} alt={item.platform.label} className="w-6 h-6" />
                    <span className="font-medium text-text-primary ">{item.platform.label}</span>
                  </div>
                  <span className="text-text-primary ml-2">{item.accountId}</span>
                  <span className="text-primary font-semibold">₦{item.price}</span>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-quinary transition"
                    onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                  >
                    <span className="text-white text-xl font-bold">–</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
              <p className="text-base font-semibold mb-2">
                Total – <span className="text-primary font-bold">
                  ₦{cart.reduce(
                    (sum, item) => sum + Number(String(item.price).replace(/,/g, "")),
                    0
                  ).toLocaleString()}
                </span>
              </p>
              <Button
                variant="orange"
                size="md"
                className="w-full max-w-xs"
                onClick={() => alert("Buy Account")}
              >
                Buy Account
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Search and Table */}
      <div className="bg-white p-2">
        {/* Search Bar */}
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search by username or previous link"
              className="w-full border border-border-grey rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <img
              src="/icons/search.svg"
              alt="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-tertiary border-b border-border-grey">
                <th className="py-3 px-0 sm:px-6 font-semibold">Platform</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">Account ID</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">Price</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">View</th>
                <th className="py-3 px-0 sm:px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-border-grey">
                  <td className="py-6 px-0 sm:px-6 flex items-center gap-2">
                    <img src={platform.icon} alt={platform.label} className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="font-medium text-text-primary">{platform.label}</span>
                  </td>
                  <td className="py-4 px-0 sm:px-6 text-text-primary">6156861375259</td>
                  <td className="py-4 px-0 sm:px-6 text-primary font-semibold">₦{product.price}</td>
                  <td className="py-4 px-0 sm:px-6">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary hover:bg-quinary transition">
                      <img src="/icons/eye-bold.svg" alt="View" className="w-5 h-5 invert-0" />
                    </button>
                  </td>
                  <td className="py-4 ">
                    <Button
                      variant="orange"
                      size="sm"
                      shape="rounded"
                      className="px-0 md:px-5 rounded-lg md:rounded-full"
                      onClick={() => {
                        setCart(prev => [
                          ...prev,
                          {
                            id: Date.now() + Math.random(),
                            platform,
                            accountId: "6156861375259",
                            price: product.price,
                          }
                        ]);
                      }}
                    >
                      <img src="/icons/cart.svg" alt="Add to Cart" className="w-4 h-4 mr-0 sm:mr-2" />
                     <span className="hidden sm:block">Add to Cart</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
     
     </>
  );
};

export default BuyAccountPage;
