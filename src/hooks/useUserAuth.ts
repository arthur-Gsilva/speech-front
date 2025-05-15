// app/main/hooks/useUserAuth.ts
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/types/User";

export const useUserAuth = () => {
  const [user, setUser] = useState<null | User>(null);
  const router = useRouter();

  useEffect(() => {
    const userType = Cookies.get("user_type");
    if (!userType) {
      router.replace("/");
    } else {
      setUser(userType as User);
    }
  }, []);

  return { user };
};
