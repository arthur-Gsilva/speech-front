"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const Page = () => {
    const { setUser } = useUser();
    const router = useRouter();

    const handleSelect = (user: "Arthur" | "Lucas" | "ADMIN") => {
        setUser(user);
        router.push("/main");
    };

    return (
    <div className="w-full min-h-full flex justify-center items-center mt-12">
        <div className="flex gap-6">
            {["Arthur", "ADMIN", "Lucas"].map((u) => (
                <button
                    key={u}
                    onClick={() => handleSelect(u as "Arthur" | "Lucas" | "ADMIN")}
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
