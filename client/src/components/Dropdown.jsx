import React, { useState } from "react";

const Dropdown = ({ options, onChange }) => {
 const [selected, setSelected] = useState("");

 const handleSelectChange = (event) => {
   const newValue = event.target.value;
   setSelected(newValue);
   if (onChange) {
     onChange(newValue);
   }
 };

  return (
    <div className="w-full">
      <select
        className="bg-gray-200 rounded-xl h-[3rem] w-full p-3 shadow-lg duration-[5000s]"
      >
       <option value="" disabled>
          Select a page
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
