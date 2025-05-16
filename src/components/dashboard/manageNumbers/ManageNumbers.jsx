import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const numbers = [
  { id: 1, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 2, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false },
  { id: 3, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 4, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false },
  { id: 5, number: "(5555) 123 - 4567", expiration: "1h 9m 10s", isActive: true },
  { id: 6, number: "(5555) 123 - 4567", expiration: "1m 30s", isActive: false },
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
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">Manage Numbers</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg border border-gray-200 px-3 py-2 items-center">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-[#FF6B00] hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-6 py-2 flex items-center gap-2 transition-colors">
            + Buy Number
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-4">
        {["Active", "Inactive"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab
                ? "border-b-2 border-[#015C67] text-[#015C67]"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="py-2 px-2">Number</th>
              <th className="py-2 px-2">Expiration</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNumbers.map((n) => (
              <tr key={n.id} className="border-b last:border-b-0">
                <td className="py-3 px-2 font-medium text-text-primary">{n.number}</td>
                <td className={`py-3 px-2 font-semibold ${n.isActive ? "text-green-600" : "text-red-500"}`}>
                  {n.expiration}
                </td>
                <td className="py-3 px-2">
                  <button className="bg-[#FFF4ED] text-[#FF6B00] font-semibold rounded-full px-5 py-1 flex items-center gap-1">
                    View <span className="text-xs">&#8594;</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredNumbers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-8">
                  No numbers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNumbers;
