export const addZero = (number: string | number): string => {
  try {
    const int = parseInt(number.toString(), 10);
    if (isNaN(int)) {
      return number.toString();
    }
    return int > 9 ? `${int}` : `0${int}`;
  } catch (error) {
    return number.toString();
  }
};
