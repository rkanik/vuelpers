export const getPercentage = (number: number, percentage: number) => {
  return (number / 100) * percentage;
};
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
