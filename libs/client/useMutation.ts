import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

function useMutation<T = any>(
  url: string,
  delay: number = 500
): UseMutationResult<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const mutation = (payload: any) => {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((respose) => respose.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return [mutation, { loading, data, error }];
}

export default useMutation;
