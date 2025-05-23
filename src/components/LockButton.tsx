import { useLock } from '@/contexts/LockContext';
import { useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';

export const LockButton = () => {

    const { locked, setLocked } = useLock();
    const [showModal, setShowModal] = useState(false);
    const [pendingLock, setPendingLock] = useState(false);

    const handleClick = () => {
        setPendingLock(!locked);
        setShowModal(true);      
    };

    const confirmAction = () => {
        setLocked(pendingLock);
        setShowModal(false);
    };

    return(
        <div className="w-full flex justify-center items-center my-1">
            <button 
                className={`border-4 border-gray-100 shadow-xl w-28 h-10 rounded-full relative ${locked ? 'bg-red-500' : 'bg-blue-300'} cursor-pointer transition-all duration-500`}
                onClick={handleClick}
            >
                <div 
                    className={`absolute transition-all duration-500 ease-in-out bg-gray-100 rounded-full p-2 ${locked ? 'left-[100%] -translate-x-full' : 'left-0'} top-[-6px] border-3 border-gray-50 shadow-lg`}
                >
                    {locked ? <FaLock className='text-2xl text-red-500'/> : <FaLockOpen className='text-2xl text-blue-300'/>}
                </div>
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h2 className="text-lg font-semibold mb-4">
                            Deseja {pendingLock ? 'travar' : 'destravar'} o sistema?
                        </h2>
                        <div className="flex justify-around">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-white bg-red-500 hover:bg-red-400 rounded cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmAction}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}