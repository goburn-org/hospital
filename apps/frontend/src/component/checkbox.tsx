export const Radio = ({
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
  <label className="flex items-center space-x-1 cursor-pointer">
    <input type="radio" id={id} checked={checked} onChange={onChange} />
    <span className="text-gray-700">{label}</span>
  </label>
);
interface Option {
  label: string;
  value: string;
}

export const RadioGroup = <T extends Option>({
  options,
  selectedValue,
  onChange,
  label,
  error,
}: {
  options: T[];
  selectedValue: string;
  onChange: (value: T['value']) => void;
  label: string;
  error?: string;
}) => (
  <fieldset className="flex flex-wrap items-start gap-2 w-full flex-col">
    <div className="flex gap-1">
      <legend className="text-gray-800 font-semibold mb-2">{label} </legend>
      {error ? <p className="text-base text-red-500">{error}</p> : null}
    </div>

    <div className="flex gap-2">
      {options.map((option) => (
        <Radio
          key={option.value}
          id={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          onChange={() => {
            onChange(option.value);
          }}
        />
      ))}
    </div>
  </fieldset>
);
