import React, { useState } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function Disclosure({ title, children, defaultExpanded = false }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Create a unique ID for aria-controls
  const contentId = React.useId();

  return (
    <div className="border rounded shadow-sm max-w-md w-full">
      <h3>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex justify-between items-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-left"
        >
          <span>{title}</span>
          <span aria-hidden="true" className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </h3>
      
      {/* 
        Using hidden instead of conditional rendering ensures the content 
        is still in the DOM for search or potential future animations, 
        and is standard for Disclosure pattern if it shouldn't completely unmount.
      */}
      <div 
        id={contentId} 
        hidden={!isExpanded}
        className="p-4 bg-white"
      >
        {children}
      </div>
    </div>
  );
}
