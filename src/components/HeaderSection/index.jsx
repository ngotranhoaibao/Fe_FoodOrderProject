
import React from "react";

const HeaderSection = ({ title, description, children }) => {
  return (
    <header className="flex items-center justify-between px-8 py-3">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        {children} 
      </div>
      
    </header>
  );
};

export default HeaderSection;