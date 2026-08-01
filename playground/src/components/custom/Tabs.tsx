import React, { useState, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0].id);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    const maxIndex = tabs.length - 1;

    if (e.key === 'ArrowRight') {
      newIndex = index === maxIndex ? 0 : index + 1;
    } else if (e.key === 'ArrowLeft') {
      newIndex = index === 0 ? maxIndex : index - 1;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = maxIndex;
    } else {
      return;
    }

    e.preventDefault();
    const newTabId = tabs[newIndex].id;
    setActiveTabId(newTabId);

    // Focus the new tab
    if (tabListRef.current) {
      const newTabButton = tabListRef.current.querySelector(
        `[id="tab-${newTabId}"]`
      ) as HTMLButtonElement;
      if (newTabButton) {
        newTabButton.focus();
      }
    }
  };

  return (
    <div className="w-full max-w-md border rounded shadow-sm">
      <div 
        ref={tabListRef}
        role="tablist" 
        aria-label="Example Tabs"
        className="flex border-b"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
                isActive 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isActive}
            tabIndex={0}
            className="p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
