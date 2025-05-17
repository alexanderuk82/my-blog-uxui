export const formatPrice = (price: number, currency: string = 'GBP'): string => {
  // Asegurarnos de que el precio es un número
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Usar el formato británico para GBP
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(numericPrice);
};
