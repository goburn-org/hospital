export const Rupees = ({ amount }: { amount: number }) => {
  const formatRupees = (value: number) => {
    if (isNaN(value)) return 'Invalid amount';

    // Round to 2 decimal places
    const roundedValue = Number(value).toFixed(2);

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = roundedValue.split('.');

    // Format the integer part with Indian numbering system
    const formattedInteger = integerPart.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
    if (decimalPart === '00') {
      return formattedInteger;
    }

    return `${formattedInteger}.${decimalPart}`;
  };

  return (
    <span className="">
      <p className="text-sm text-gray-500 inline"> &#8377;</p>{' '}
      {formatRupees(amount)}
    </span>
  );
};
