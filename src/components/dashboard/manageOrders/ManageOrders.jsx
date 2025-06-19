import React, { useState } from "react";
import TopControls from "../../common/TopControls";
import { Button } from "../../common/Button";


const ORDERS = [
  {
    id: "order-67e7f4b299c6d",
    name: "Random FB||00- 300friends (3 months +)",
    price: "2,500",
    qty: 1,
    icon: "/icons/facebook.svg",
    viewIcon: "/icons/eye-bold.svg",
    link: "#"
  },
  {
    id: "order-67e7f4b299c6d",
    name: "Random FB||00- 300friends (3 months +)",
    price: "2,500",
    qty: 1,
    icon: "/icons/facebook.svg",
    viewIcon: "/icons/eye-bold.svg",
    link: "#"
  },
  {
    id: "order-67e7f4b299c6d",
    name: "Random FB||00- 300friends (3 months +)",
    price: "2,500",
    qty: 1,
    icon: "/icons/facebook.svg",
    viewIcon: "/icons/eye-bold.svg",
    link: "#"
  },
];

const ManageOrders = () => {
  const [search, setSearch] = useState("");

  // Filtered orders (add real search logic as needed)
  const filteredOrders = ORDERS.filter(
    o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase())
  );
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Your Orders</h1>
       <Button variant="quaternary" size="lg" className="w-fit" to="/dashboard/social-media-accounts/buy">
        Buy New Account
       </Button>
      </div>
      <div className="bg-background rounded-2xl shadow p-4 md:p-8 mx-auto">
           {/* Search Bar */}
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search with account id or order id"
              className="w-full border border-border-grey rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <img
              src="/icons/search.svg"
              alt="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary"
            />
          </div>
        </div>
        {/* Top Controls */}
        <TopControls page={page} setPage={setPage} />
        {/* Table */}
        <div className="max-w-[320px] sm:max-w-[650px] lg:max-w-full w-full overflow-x-auto">
          <table className="min-w-[900px] overflow-x-auto w-full text-left">
            <thead>
              <tr className="border-b border-secondary">
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Order ID</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Name</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Price</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Qty.</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr key={idx} className="border-b border-secondary hover:bg-secondary-light transition">
                  <td className="py-4 px-2 text-[15px]">{order.id}</td>
                  <td className="py-4 px-2 flex items-center gap-2">
                    <img src={order.icon} alt="icon" className="w-6 h-6" />
                    <span className="font-semibold text-primary hover:underline cursor-pointer">
                      {order.name}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-quaternary font-semibold text-[15px]">₦ {order.price}</td>
                  <td className="py-4 px-2 text-[15px]">{order.qty}</td>
                  <td className="py-4 px-2">
  <button className="bg-quaternary rounded-lg p-2 hover:bg-quaternary/90 transition">
    <img src={order.viewIcon} alt="View" className="w-5 h-5" />
  </button>
</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-tertiary">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
