import React, { useState } from "react";

import useDebounce from "../../hooks/useDebounce";

export default function SearchInput({
  value,
  onChange,
  name,
  title,
  type = "text",
  className = "input-field",
}) {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const debouncedValue = useDebounce(searchTerm, 500);
  // Only call onChange when debouncedValue changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(name, debouncedValue);
    }
  }, [debouncedValue]); // Remove onChange from dependencies
  return (
    <div className="input-groups">
      <label>Search By {title}</label>
      <input
        name={name}
        type={type}
        className={className}
        placeholder={title}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
