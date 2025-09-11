import React, { useState } from "react";

import useDebounce from "../../hooks/useDebounce";
export default function SearchAgents({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const debouncedValue = useDebounce(searchTerm, 500);
  // Only call onChange when debouncedValue changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]); // Remove onChange from dependencies
  return (
    <div className="form-groups">
      <label>Search By</label>
      <input
        type="text"
        className="input"
        placeholder="Agent Name, Agent ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
