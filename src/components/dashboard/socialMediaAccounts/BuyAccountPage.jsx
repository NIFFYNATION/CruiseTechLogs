import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";
import { FiInfo } from "react-icons/fi";
import ReviewOrderModal from "./ReviewOrderModal";
import CartItem from "./CartItem";
import CartQuantityControl from "./CartQuantityControl";

const BuyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get state passed from navigation
  const { platform, category, product } = location.state || {};

  const defaultProduct = {
    title: "Random FB|100–300friends (3 months +)",
    price: "1,200",
  };
  const usedProduct = product || defaultProduct;
  const usedPlatform = platform || { label: "Facebook", icon: "/icons/facebook.svg" };
  const usedCategory = category || { label: "RANDOM COUNTRIES FB" };

  const [quantity, setQuantity] = React.useState(0);
  const [cart, setCart] = React.useState([]);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/,/g, "")),
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
        platform,
        accountId: "6156861375259",
        price: usedProduct.price,
      }
    ]);
  };

  const onDecrement = () => {
    if (cart.length > 0) setCart(prev => prev.slice(0, -1));
  };

  return (
     <>
     {/* Product Summary */}
      <div className="bg-white rounded-xl shadow p-6 mb-6  border-b-[#FFDE59] border-b-2">
          <img src={usedPlatform.icon} alt={usedPlatform.label} className="w-10 h-10" />
        <div className="flex items-start gap-4 py-2">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-base text-primary">{usedProduct.title}</h3>
              <span className="font-semibold text-primary text-lg">₦ {usedProduct.price}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
              <span className="text-xs text-text-secondary  py-2">
                Login Format – <span className="text-primary font-semibold">ID | Password | 2fa key | Mail | Mail password</span>
              </span>
              <span className="text-xs text-text-secondary mt-1 sm:mt-0 ">
                Platform - <span className="text-primary font-semibold">{usedPlatform.label}</span>
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
       
        <div className="flex items-center gap-">
        <CartQuantityControl
          quantity={cart.length}
          onIncrement={() => {
            setCart(prev => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                platform,
                accountId: "6156861375259",
                price: usedProduct.price,
              }
            ]);
          }}
          onDecrement={() => {
            if (cart.length > 0) setCart(prev => prev.slice(0, -1));
          }}
          onClearCart={onClearCart}
          available={277}
          showAvailable={true}
        />
       
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
              onClick={() => setReviewOpen(true)}
            >
              Buy Account
            </Button>
          </div>
          {cart.length > 0 && (
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
              
            </div>
            <div className="flex flex-col items-center justify-center">
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
                onClick={() => setReviewOpen(true)}
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
                  <td className="py-4 px-2 sm:px-6 flex items-center gap-2">
                    <img src={usedPlatform.icon} alt={usedPlatform.label} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-medium text-text-primary text-xs sm:text-base">{usedPlatform.label}</span>
                  </td>
                  <td className="py-4 px-2 sm:px-6 text-text-primary text-xs sm:text-base truncate max-w-[80px] sm:max-w-none">
                    6156861375259
                  </td>
                  <td className="py-4 px-2 sm:px-6 text-primary font-semibold text-xs sm:text-base whitespace-nowrap">
                    ₦{usedProduct.price}
                  </td>
                  <td className="py-4 px-2 sm:px-6">
                    <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-primary hover:bg-quinary transition">
                      <img src="/icons/eye-bold.svg" alt="View" className="w-4 h-4 sm:w-5 sm:h-5 invert-0" />
                    </button>
                  </td>
                  <td className="py-4 px-2 sm:px-6">
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
                            platform,
                            accountId: "6156861375259",
                            price: usedProduct.price,
                          }
                        ]);
                      }}
                    >
                      <img src="/icons/cart.svg" alt="Add to Cart" className="w-4 h-4 mr-0 sm:mr-2" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
     
     <ReviewOrderModal
       open={reviewOpen}
       cart={cart}
       onClose={() => setReviewOpen(false)}
       onBuy={() => {
         setReviewOpen(false);
         // Simulate order details (replace with real data as needed)
         navigate('/dashboard/social-media-accounts/order-confirmed', {
           state: {
             order: {
               orderId: "67e7f4b299c6d",
               accountId: "66f3f8841ad8a",
               accountType: usedProduct.title,
               price: usedProduct.price,
               loginId: "135716",
               loginDetails:
                 "61573765657031|29Qgz51Xfq|LNNVVMBQDLMLTLXQSMLYKASWOMXFO3SO|c_user=61573765657031;xs=16:jbYrGYx_O3LA9Q:2:1741297043:-1:-1;fr=085P1O1lLrL6Tbbhm.AWW8OJLNlnTXq27ncAbPG5o9-vevYuRYQFqrRA.BnyhWY..AAA.0.0.BnyhWY.AWX1DpwjTcc;datr=khXKZyKqn35-mSbJoQGwz0HB;|EAAAAUaZA8jlABO9afd9A8WQAp9XIMnX3HpxYlt7mchi8Y7RONEBv7SIWoZCkT78Mc8hAqs6YEt8NUwgK5DLkvTeDNOgjMV2KV2baxuMzGOij09GXzEXAJfH5PZBYokfZBJMQZBlcphZCFeTeBZB55gaDbIanxnBy50DLhBK4Lt9H1f10XOvEqEj8GXmXGxlX6IfnrqOEhOdtAZDZD|rdmbr4gxcvph@jxpomup.com|",
             },
           },
         });
       }}
       onRemove={idx => setCart(prev => prev.filter((_, i) => i !== idx))}
       onClearCart={() => setCart([])}
       onIncrement={onIncrement}
       onDecrement={onDecrement}
     />
     </>
  );
};

export default BuyAccountPage;
