import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

import type { User } from "@prisma/client";

interface UserResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const router = useRouter();
  const path = router.pathname;
  const { data, error } = useSWR<UserResponse>(path === '/enter' ? null : "/api/users/me", url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data && !data.ok) {
      router.push("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLodaing: !data && !error };
}
