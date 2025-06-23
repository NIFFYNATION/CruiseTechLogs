import React from "react";

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl shadow p-4 animate-pulse ${className}`}>
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded-full w-24"></div>
    </div>
  </div>
);

export const SkeletonTableRow = ({ cols = 4 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

export const SkeletonBalanceCard = ({ isSimple = false }) => (
  <div
    className={`rounded-[20px] relative overflow-hidden h-[calc(100%-0px)] ${isSimple ? "p-4 min-h-[120px]" : "p-8 min-h-[180px]"} animate-pulse`}
    style={{
      background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
      backgroundSize: "cover",
    }}
  >
    <div className={`flex flex-col justify-between items-start md:items-center h-full ${isSimple ? "p-4" : "p-8"}`}>
      <div className="text-center w-full">
        <div className={`bg-white/40 h-5 rounded w-1/2 mx-auto mb-4 mt-0 md:mt-4 ${isSimple ? "md:mb-2" : "md:mb-6"}`}></div>
        <div className="bg-white/60 h-10 rounded w-2/3 mx-auto mb-2"></div>
      </div>
      {!isSimple && (
        <div className="flex gap-3 justify-center w-full mt-4">
          <div className="h-12 w-32 bg-white/60 rounded-full"></div>
          <div className="h-12 w-32 bg-white/60 rounded-full"></div>
        </div>
      )}
    </div>
  </div>
);

export const SkeletonNumberCard = () => (
  <div className="flex items-center rounded-xl shadow-sm px-4 py-4 mb-0 border-b-1 border-[#FFDE59] relative bg-gradient-to-tl from-rose-50/50 to-white-50 animate-pulse">
    <div className="w-6 h-6 rounded bg-gray-200 mr-4" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
    </div>
    <div className="ml-2">
      <div className="w-5 h-5 bg-gray-200 rounded-full" />
    </div>
  </div>
);

export const SkeletonBuyAccountCard = () => (
  <div className="bg-white rounded-xl shadow p-4 animate-pulse flex flex-col justify-between min-h-[120px] sm:min-h-[200px] cursor-pointer bg-gradient-to-tl from-rose-50/50 to-white-50 border-b-2 border-[#FEBB4F]">
    {/* Mobile Layout */}
    <div className="flex sm:hidden">
      <div className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
      <div className="flex-1 flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 mt-1"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-gray-200 rounded w-1/4 mr-4"></div>
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
    {/* Desktop Layout */}
    <div className="hidden sm:flex flex-col justify-between min-h-[200px]">
      <div className="flex md:flex-col gap-3">
        <div className="flex md:flex-col gap-1">
          <div className="w-12 h-12 rounded-full bg-gray-200 mt-1 mb-2" />
          <div className="flex md:flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between mt-1">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
      </div>
    </div>
  </div>
); 