import React, { useState } from "react";

import useDebounce from "../../hooks/useDebounce";
export default function PurchasedPhoneSearchInput({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const debouncedValue = useDebounce(searchTerm, 500);
  // Only call onChange when debouncedValue changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]); // Remove onChange from dependencies
  return (
    <div className="input-groups">
      <label>Search By Number</label>
      <input
        type="text"
        className="input-field"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
