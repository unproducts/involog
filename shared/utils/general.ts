export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year!, month! - 1, day);

  // Check if the parsed date components match the input
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
};

export const extractDate = (dateString: string): Date => {
  if (!isValidDate(dateString)) throw new Error('Invalid dateString');
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year!, month! - 1, day);
};
