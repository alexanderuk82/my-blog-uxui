import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// Create context for tabs state
const TabsContext = createContext(null);

// Main Tabs component
const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  // Use controlled or uncontrolled state
  const [selectedTab, setSelectedTab] = useState(defaultValue || '');
  
  // Determine current value (controlled or uncontrolled)
  const currentValue = value !== undefined ? value : selectedTab;
  
  // Handle tab change
  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setSelectedTab(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleTabChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component
const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsList.displayName = "TabsList";

// TabsTrigger component
const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { value: selectedValue, onChange } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

// TabsContent component
const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { value: selectedValue } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  if (!isActive) return null;
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
