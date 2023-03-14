import { useState } from "react";

const useMutation = (
  url: string
): [
  (data?: any) => void,
  { loading: boolean; data: undefined | any; error: undefined | any }
] => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);

  const mutation = (data: any) => {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((respose) => respose.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return [mutation, { loading, data, error }];
};

export default useMutation;
