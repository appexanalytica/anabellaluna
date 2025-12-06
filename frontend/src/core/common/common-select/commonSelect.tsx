import React, { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  className?: string;
  styles?: any; 
}

const CommonSelect: React.FC<SelectProps> = ({ options, defaultValue, className }) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

  const customStyles = {
    option: (base: any, state: any) => ({
      ...base,
      color: "#5D6772",
      backgroundColor: state.isSelected ? "#ddd" : "white",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isFocused ? "#03BD9D" : "white",
        color: state.isFocused ? "#fff" : "#03BD9D",
      },
    }),
  };

  const handleChange = (option: Option | null) => {
    setSelectedOption(option || undefined);
  };
  useEffect(() => {
    setSelectedOption(defaultValue || undefined);
  }, [defaultValue])
  
  return (
    <Select
     classNamePrefix="react-select"
      className={className}
      styles={customStyles}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
    />
  );
};

export default CommonSelect;
