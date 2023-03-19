import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";

export default function useUser() {
  const [user, setUSer] = useState();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          return router.push("/enter");
        }
        setUSer(data.profile);
      });
  }, [router]);

  return user;
}
