import { useState, useRef } from "react";

export const useDebounce = (milliSeconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState<any>();
  let handler = useRef<NodeJS.Timeout>();

  const debounceRequest = (request: () => Promise<Response>) => {
    clearTimeout(handler.current);

    handler.current = setTimeout(async () => {
      const res = await request();
      if (res) setDebouncedValue(await res.json());
    }, milliSeconds);
  };

  return [debouncedValue, debounceRequest] as const;
};
