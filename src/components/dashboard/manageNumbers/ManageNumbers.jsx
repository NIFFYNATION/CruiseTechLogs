import React, { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { AiFillEye } from 'react-icons/ai'
import { Link } from "react-router";


const numbers = [
  { id: 1, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 2, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false, expirationDate: "12/04/2025" },
  { id: 3, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 4, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false, expirationDate: "12/04/2025" },
  { id: 5, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 6, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false, expirationDate: "12/04/2025" },
];

const ManageNumbers = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");

  const filteredNumbers = numbers.filter(
    (n) =>
      (activeTab === "Active" ? n.isActive : !n.isActive) &&
      n.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* ----------- MOBILE ONLY ----------- */}
      <div className="block md:hidden px-2">
        {/* Header */}
        <div className="flex justify-center bg-quaternary-light gap-2 rounded-full mb-8 p-2 mt-8 items-center">
        <img src="/icons/bell.png" alt="bell" className="" />
          <p className="text-text-secondary text-sm font-medium">You have 2 messages! <span className="text-quinary text-base font-medium"><Link >click to view</Link></span></p>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mt-2">Manage Numbers</h2>
        <p className="text-text-secondary text-sm mb-4">
          Get phone number to receive OTP for short term or long term use.
        </p>
        {/* Buy Number Button */}
        <button className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-6 py-2 flex items-center gap-2 mb-4 transition-colors">
          + Buy Number
        </button>
        {/* Search */}
        <div className="flex bg-background rounded-lg border-none px-3 py-2 mb-4 items-center">
          <FaSearch className="text-text-grey mr-2" />
          <input
            type="text"
            placeholder="Search numbers or service type"
            className="outline-none bg-transparent text-sm text-text-secondary w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Tabs */}
        <div className="flex gap-8 border-b border-text-grey mb-4">
          {["Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 text-base font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-grey"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Table */}
        <div className="bg-background rounded-2xl shadow p-2">
          <table className="w-full">
            <thead>
              <tr className="text-left text-text-secondary text-xs">
                <th className="py-2 px-2">Number</th>
                <th className="py-2 px-2">Expiration</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNumbers.map((n) => (
                <tr key={n.id} className="border-b last:border-b-0 border-text-grey">
                  <td className="py-3 px-2 font-medium text-text-primary text-sm">{n.number}</td>
                  <td className="py-3 px-2 font-semibold text-sm">
                    {activeTab === "Active" ? (
                      <span className={n.expiration.includes("h") ? "text-success" : "text-danger"}>
                        {n.expiration}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-danger font-semibold rounded-full px-2 py-1 text-xs">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <button className="bg-quaternary-light text-quinary font-semibold rounded-full px-2 py-1 flex items-center gap-1 text-sm">
                      View <AiFillEye className="text-quinary text-base" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredNumbers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-grey py-8">
                    No numbers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ----------- DESKTOP/TABLET ONLY ----------- */}
      <div className="hidden md:block">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-text-primary">Manage Numbers</h2>
          <div className="flex items-center gap-4">
           
            {activeTab === "Active" && <button className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-6 py-2 flex items-center gap-2 transition-colors">
              + Buy Number
            </button>}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-between gap-8 border-b border-text-grey mb-10
        ">
        <div className="flex gap-8">
          {["Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              className={`text-lg font-medium ${
                activeTab === tab
                  ? "border-b-3 border-primary  text-primary"
                  : "text-text-grey"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
           
        </div>
        <div className="flex bg-background rounded-lg border border-text-grey px-3 py-2 mb-4 items-center">
              <FaSearch className="text-text-grey  mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none bg-transparent text-sm text-text-grey"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
        </div>
        
        {/* Table */}
        <div className="bg-background rounded-2xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className=" text-left text-text-grey text-sm">
                <th className="py-2 px-2">Number</th>
                {activeTab === "Inactive" && <th className="py-2 px-2">Status</th>}
                <th className="py-2 px-2">{activeTab === "Active" ? "Expiration" : "Expiration"}</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNumbers.map((n) => (
                <tr key={n.id} className="border-b text-start last:border-b-0 border-text-grey">
                  <td className="py-3 px-2 font-medium text-text-primary">{n.number}</td>
                  {activeTab === "Inactive" && (
                    <td className="py-3 px-2">
                      <span className="bg-red-100 text-danger font-semibold rounded-full px-4 py-1 text-sm">
                        Inactive
                      </span>
                    </td>
                  )}
                  <td className={`py-3 px-2 font-semibold ${
                    activeTab === "Active"
                      ? n.expiration.includes("h") ? "text-success" : "text-danger"
                      : "text-text-grey"
                  }`}>
                    {activeTab === "Active"
                      ? n.expiration
                      : n.expirationDate}
                  </td>
                  <td className="py-3 px-2">
                    {activeTab === "Active" ? (
                      <button className="bg-[#FFF4ED] text-[#FF6B00] font-semibold rounded-full px-3 py-1 flex items-center gap-1">
                        View <span className="text-xs"><AiFillEye className="text-quinary" /></span>
                      </button>
                    ) : (
                      <button className="p-2 rounded-full hover:bg-red-50 transition">
                        <FaTrash className="text-danger" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredNumbers.length === 0 && (
                <tr>
                  <td colSpan={activeTab === "Active" ? 3 : 4} className="text-center text-grey py-8">
                    No numbers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageNumbers;
