"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        Cookies.set("user_type", 'ADMIN', { expires: 7 });
        router.replace("/main")
    }, []);

};

export default Page;
