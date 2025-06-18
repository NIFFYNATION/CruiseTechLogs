import React, { useState } from "react";
import { FiSearch, FiCopy, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import TopControls from "../../common/TopControls";
import ReusableModal from "../../common/ReusableModal";
import CreateApiKeyModal from "./CreateApiKeyModal";
import "./ApiPage.css";

const mockApiKeys = [
  {
    id: 1,
    key: "960fdde8bb5edce6df4d6b6ff61254d0d24d66c5150f7f8c9e4a33",
    date: "2025-03-10",
  },
  {
    id: 2,
    key: "960fdde8bb5edce6df4d6b6ff61254d0d24d66c5150f7f8c9e4a33",
    date: "2025-03-10",
  },
  {
    id: 3,
    key: "960fdde8bb5edce6df4d6b6ff61254d0d24d66c5150f7f8c9e4a33",
    date: "2025-03-10",
  },
];

const ApiPage = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    // Optionally show a toast
  };

  const handleDelete = (id) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    setSelected((prev) => prev.filter((sid) => sid !== id));
    // Optionally show a toast
  };

  // Filtered keys
  const filteredKeys = apiKeys.filter((k) =>
    k.key.toLowerCase().includes(search.toLowerCase())
  );

  // Handle modal submit
  const handleGenerateApiKey = (password) => {
    setModalOpen(false);
    // TODO: Call your API to generate the key with the password
    // Optionally show a toast or update state
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Your API Key</h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="bg-quaternary w-fit text-white font-semibold rounded-full px-6 py-3 shadow hover:bg-quaternary/90 transition flex items-center"
            onClick={() => setModalOpen(true)}
          >
            <img className='w-5 h-5 mr-2 ' src="/icons/add-bold.svg" alt="" />
            <span className="text-sm">Create API Key</span>
          </motion.button>
        </div>
        <p className="text-text-secondary text-sm">
          Note that you can only see your API Key once. But you can always generate a new key.<br />
          <span className="text-quaternary font-medium cursor-pointer hover:underline">Click here</span> to view API documentation
        </p>
      </div>

      {/* Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create API Key"
      >
        <CreateApiKeyModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleGenerateApiKey}
        />
      </ReusableModal>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-8">
        {/* Search & Controls */}
        <div className="mb-4">
        <div className="relative w-full py-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-grey" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full font-semibold border border-border-grey rounded-sm pl-10 pr-4 py-2.5 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        <TopControls page={page} setPage={setPage} />

        </div>

        {/* Table */}
        <div className="max-w-[320px] sm:max-w-[650px] lg:max-w-full w-full overflow-x-auto">
          <table className="min-w-[900px] overflow-x-auto w-full text-left">
            <thead>
              <tr className="border-b border-secondary">
                <th className="py-3 px-2 w-10">
                  <input
                    type="checkbox"
                    className="custom-checkbox "
                    checked={selected.length === filteredKeys.length && filteredKeys.length > 0}
                    onChange={() =>
                      setSelected(
                        selected.length === filteredKeys.length
                          ? []
                          : filteredKeys.map((k) => k.id)
                      )
                    }
                  />
                </th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">API Keys</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Date Generated</th>
                <th className="py-3 px-2 text-sm font-semibold text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((k) => (
                <tr key={k.id} className="border-b border-secondary hover:bg-secondary-light hover:cursor-pointer transition">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                    className="custom-checkbox"

                      checked={selected.includes(k.id)}
                      onChange={() => handleSelect(k.id)}
                    />
                  </td>
                  <td className="py-3 px-2  text-[15px] truncate">{k.key}</td>
                  <td className="py-3 px-2 text-[15px] text-primary font-semibold">
                    {dayjs(k.date).format("DD MMM, YYYY")}
                  </td>
                  <td className="py-3 px-2 flex gap-3">
                    <button
                      onClick={() => handleCopy(k.key)}
                      className="p-2 rounded hover:bg-secondary transition"
                      title="Copy"
                    >
                      <FiCopy className="text-success" />
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="p-2 rounded hover:bg-secondary transition"
                      title="Delete"
                    >
                      <FiTrash2 className="text-quaternary" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredKeys.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-tertiary">No API keys found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
