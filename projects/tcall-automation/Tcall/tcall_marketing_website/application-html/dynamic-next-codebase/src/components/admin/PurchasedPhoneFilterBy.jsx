import React from "react";
export default function PurchasedPhoneFilterBy({ value, onChange }) {
  return (
    <div className="input-groups">
      <label>Filter By</label>
      <select
        className="input-field input-field--select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>
    </div>
  );
}
