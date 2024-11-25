export const Checkbox = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center space-x-3 cursor-pointer">
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
    <span className="text-gray-700">{label}</span>
  </label>
);

export const CheckboxGroup = ({
  options,
  selectedValues,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (value: string[]) => void;
}) => (
  <div className="space-y-2 flex flex-wrap items-start gap-2">
    {options.map((option) => (
      <Checkbox
        key={option.value}
        id={option.value}
        label={option.label}
        checked={selectedValues.includes(option.value)}
        onChange={() => {
          if (selectedValues.includes(option.value)) {
            onChange(selectedValues.filter((v) => v !== option.value));
          } else {
            onChange([...selectedValues, option.value]);
          }
        }}
      />
    ))}
  </div>
);
