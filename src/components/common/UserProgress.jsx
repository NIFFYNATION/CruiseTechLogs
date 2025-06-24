import React from "react";
import { extractLastNumber } from "../../utils/formatUtils";

const UserProgress = ({ percentage = 0, stageName = '', nextStage = '' }) => {
  const levelNum = extractLastNumber(nextStage) || extractLastNumber(stageName);
  const badgeUrl = levelNum
    ? `/icons/level-badge-${parseInt(levelNum, 10) + 1}.svg`
    : '/icons/level-badge.svg';

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 mt-4">
        <img src={`${badgeUrl} `}className={`inline-block w-8 h-8 bg-[url('${badgeUrl}')] bg-cover`} />
        <span className="text-base font-semibold text-[#A97B2A]">
          {percentage}% to {nextStage || stageName}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default UserProgress;
