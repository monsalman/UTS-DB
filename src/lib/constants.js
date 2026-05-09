export const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea & Non-Coffee' },
  { id: 'food', name: 'Main Course' },
  { id: 'snacks', name: 'Snacks' }
];

export const getJakartaDate = () => {
  const now = new Date();
  const offset = 7 * 60 * 60 * 1000; // 7 hours in ms
  return new Date(now.getTime() + offset);
};
