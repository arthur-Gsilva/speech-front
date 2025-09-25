import { FaUser } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export const Header = () => {

    const router = useRouter()

    return(
        <header className="flex w-full justify-between py-3 px-20">
            <div className="flex items-center gap-6 flex-1">
                <img src="./globo-logo.png" alt="Logo da globo" className="w-[180px] h-auto"/>

                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVuRqSplVt6KmxIRMQ_XfDe101Vuj8aycyJg&s" 
                    alt="Logo do porto digital" 
                    className="w-[180px] h-auto"
                />

                <div className="text-center text-gray-400 flex items-center">
                    
                    <h3 className="text-left">
                        Arthur Silva <br />
                        Lucas Santiago
                    </h3>
                </div>
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