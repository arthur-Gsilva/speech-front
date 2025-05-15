import { FaUser } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export const Header = () => {

    const router = useRouter()

    return(
        <header className="flex w-full justify-between py-3 px-20">
            <div>
                <img src="./globo-logo.png" alt="Logo da globo" className="w-[180px] h-auto"/>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                    <FaUser />
                    Login
                </div>

                <div>
                    <FaGear />
                </div>

                <div className="cursor-pointer" onClick={() => {
                    Cookies.remove("user_type");
                    router.replace("/");
                }}>
                    <IoExit />
                </div>
            </div>
        </header>
    )
}