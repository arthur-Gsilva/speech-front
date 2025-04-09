import { FaUser } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export const Header = () => {
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

                <div>
                    <FaBell />
                </div>
            </div>
        </header>
    )
}