type Props = {
    title: string,
    label: string
}

export const HeaderZone = ({ title, label }: Props) => {
    return(
        <div className="flex justify-between items-center border-b border-b-gray-200 pb-3 mb-2">
            <h5 className="text-[#2D3748] text-xl font-bold">{title}</h5>
            <p className="text-[#6C757D] pr-8">{label}</p>
        </div>
    )
}