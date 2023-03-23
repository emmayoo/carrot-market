import { useEffect, useState } from "react";

const useDebounce = () => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const debounce = (cb: any, delay: number = 500) => {
    clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      cb();
    }, delay);

    setTimeoutId(() => newTimeoutId);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return { debounce };
};

export default useDebounce;
