import React, { useState } from 'react';

export type IconPickerOption = {
  id: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
};

type IconPickerProps = {
  onIconSelect: (icon: IconPickerOption) => void;
  icons: IconPickerOption[];
  label?: string; // Optional label for the picker
  error?: string; // Optional error message
};

type OptionProps = {
  id: string;
  Icon: IconPickerOption['Icon'];
  checked: boolean;
  onChange: () => void;
};

const Option: React.FC<OptionProps> = ({ id, Icon, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      id={id}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <div
      className={`p-2 border-2 rounded-md ${
        checked ? 'border-blue-500 ' : 'border-gray-300'
      }`}
    >
      <Icon className="h-6 w-6 text-gray-500" />
    </div>
  </label>
);

export const IconPicker: React.FC<IconPickerProps> = ({
  onIconSelect,
  icons,
  label = 'Select an Icon',
  error,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = (icon: IconPickerOption) => {
    setSelectedIcon(icon.id);
    onIconSelect(icon);
  };

  return (
    <fieldset className="flex flex-col gap-4 w-full">
      {/* Label and Error */}
      <div className="flex flex-col gap-1">
        <legend className="text-gray-800 font-semibold">{label}</legend>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Icon Options */}
      <div className="flex flex-wrap gap-4">
        {icons.map((icon) => (
          <Option
            key={icon.id}
            id={icon.id}
            Icon={icon.Icon}
            checked={selectedIcon === icon.id}
            onChange={() => handleIconClick(icon)}
          />
        ))}
      </div>
    </fieldset>
  );
};
