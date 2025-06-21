import React from "react";
import { Button } from "./Button"; // Assuming a reusable Button component exists

const SectionHeader = ({ title, buttonText, onButtonClick, children }) => (
  <div className="flex flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-1 mt-2">
    <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-primary">
      <span className="">{title}</span>
    </h2>
    <div>
      {children || (buttonText && onButtonClick) ? (
        <>
          {children ? (
            children
          ) : (
            <Button
              variant="primary"
              onClick={onButtonClick}
              className="bg-primary hover:bg-quaternary text-white font-medium px-3 py-1 sm:px-3 sm:py-2 rounded-full transition text-sm sm:text-base"
            >
              {buttonText}
            </Button>
          )}
        </>
      ) : null}
    </div>
  </div>
);

export default SectionHeader; 