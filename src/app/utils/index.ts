
export const isNumber = /^[\+\-]?\d*\.?\d+$/;

export const convNum2Amount = (num: number) => {
  const sign = num > 0 ? '+' : '-';
  const absNum = Math.abs(num);
  const value = Math.round(absNum * 100) / 100;
  return `${sign}${value}`;
};
