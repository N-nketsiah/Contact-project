import React from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar({ onSearch, value }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="glass-card p-5">
      <div className="relative">
        <FiSearch className="absolute left-4 top-4 text-slate-400 text-xl" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={value}
          onChange={handleChange}
          className="form-input pl-12 w-full bg-white"
        />
      </div>
    </div>
  );
}

export default SearchBar;
