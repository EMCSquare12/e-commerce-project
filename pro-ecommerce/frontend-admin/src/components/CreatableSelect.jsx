import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CreatableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase()),
  );

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block mb-1.5 text-sm font-bold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full py-2.5 pl-4 pr-10 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={placeholder}
          autoComplete="off"
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 focus:outline-none hover:text-gray-600"
        >
          {/* Added rotation animation */}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown List */}
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 animate-in fade-in zoom-in-95">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 text-sm text-gray-700 transition-colors border-b cursor-pointer hover:bg-gray-50 hover:text-blue-600 border-gray-50 last:border-0 active:bg-gray-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreatableSelect;
