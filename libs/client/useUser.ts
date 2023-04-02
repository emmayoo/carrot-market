import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const router = useRouter();
  const path = router.pathname;
  const { data, error } = useSWR(path === '/enter' ? null : "/api/users/me", url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data && !data.ok) {
      router.push("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLodaing: !data && !error };
}
