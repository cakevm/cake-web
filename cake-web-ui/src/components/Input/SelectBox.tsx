import React, { useState } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

interface SelectBoxProps {
  labelTitle: string;
  labelDescription?: string;
  defaultValue?: string;
  containerStyle?: string;
  placeholder?: string;
  labelStyle?: string;
  options: { value: string; name: string }[];
  updateType: string;
  updateFormValue: ({ updateType, value }: { updateType: string; value: string }) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
                                               labelTitle,
                                               labelDescription,
                                               defaultValue,
                                               containerStyle,
                                               placeholder,
                                               labelStyle,
                                               options,
                                               updateType,
                                               updateFormValue,
                                             }) => {
  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue: string) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
      <div className={`inline-block ${containerStyle}`}>
        <label className={`label ${labelStyle}`}>
          <div className="label-text">
            {labelTitle}
            {labelDescription && (
                <div className="tooltip tooltip-right" data-tip={labelDescription}>
                  <InformationCircleIcon className="size-4" />
                </div>
            )}
          </div>
        </label>

        <select
            className="select select-bordered w-full"
            value={value}
            onChange={(e) => updateValue(e.target.value)}
        >
          <option disabled value="PLACEHOLDER">
            {placeholder}
          </option>
          {options.map((o, k) => (
              <option value={o.value} key={k}>
                {o.name}
              </option>
          ))}
        </select>
      </div>
  );
}

export default SelectBox;