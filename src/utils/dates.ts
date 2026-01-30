import { format } from 'date-fns';

export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'EEEE, MMMM d');
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d');
};
