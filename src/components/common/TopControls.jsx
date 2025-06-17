import React from "react";
  
const TopControls = ({ page, setPage }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 mb-4 gap-4 hidden sm:flex">
    <div className="flex items-center gap-2 text-sm text-tertiary">
      <span>showing 1 - 20 results</span>
    </div>
    {/* Pagination */}
    <div className="flex items-center gap-2">
      {[1, 2, 3, 8, 9, 10].map((n, i) =>
        n === 8 ? (
          <span key={n} className="mx-1 text-tertiary">...</span>
        ) : (
          <button
            key={n}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition
              ${page === n
                ? "bg-quaternary-light text-quinary"
                : "bg-background text-text-secondary border border-bgLayout hover:bg-quinary hover:text-white"}
            `}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        )
      )}
    </div>
    {/* Items per page */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-tertiary">items per page</span>
      <select className="ring-1 ring-border-grey rounded-sm px-3 py-1 bg-white text-text-primary focus:outline-none">
        <option>10</option>
        <option>20</option>
        <option>50</option>
      </select>
    </div>
  </div>
);

export default TopControls;
