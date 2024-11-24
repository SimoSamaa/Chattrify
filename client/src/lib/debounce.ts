const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: T) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced;
};

export default debounce;