"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { User } from "@/types/User";

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        const user = Cookies.get("user_type");
        if (user) {
            router.push("/main");
        }
    }, []);

    const handleSelect = (user: User) => {
        Cookies.set("user_type", user, { expires: 7 }); // Cookie válido por 7 dias
        router.push("/main");
    };

    return (
    <div className="w-full min-h-full flex justify-center items-center mt-12">
        <div className="flex gap-6">
            {["Arthur", "ADMIN", "Lucas"].map((u) => (
                <button
                    key={u}
                    onClick={() => handleSelect(u as User)}
                    className="cursor-pointer bg-blue-300 p-4 rounded-full"
                >
                    {u}
                </button>
            ))}
        </div>
    </div>
    );
};

export default Page;
