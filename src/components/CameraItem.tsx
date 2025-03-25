import { Camera } from "@/types/Camera"
import { BiCameraHome } from "react-icons/bi";

type Props = {
    data: Camera,
    setPlay: (link: string) => void
}

export const CameraItem = ({data, setPlay}: Props) => {
    return(
        <div 
            className="flex items-center gap-4 bg-amber-700 p-2 rounded-md text-white cursor-pointer"
            onClick={() => setPlay(data.url)}
        >
            <div>
                <BiCameraHome className="text-2xl"/>
            </div>

            <div>
                <h3 className="text-2xl">{data.keyword}</h3>
                <h5 className="text-xs text-gray-200">{data.address}</h5>
            </div>
        </div>
    )
}