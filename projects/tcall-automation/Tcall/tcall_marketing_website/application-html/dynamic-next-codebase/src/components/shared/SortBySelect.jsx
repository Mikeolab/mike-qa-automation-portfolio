import React from "react";
export default function SortBySelect({ value, onChange }) {
  return (
    <div className="form-groups">
      <label>Sort By</label>
      <select
        className="input input--select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}
