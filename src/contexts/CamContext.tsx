// contexts/CameraContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type CameraContextType = {
    activeCamera: string | null;
    setActiveCamera: (cameraUrl: string | null) => void;
};

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
    const [activeCamera, setActiveCamera] = useState<string | null>(null);

    return (
        <CameraContext.Provider value={{ activeCamera, setActiveCamera }}>
            {children}
        </CameraContext.Provider>
    );
};

export const useActiveCamera = () => {
    const context = useContext(CameraContext);
    
    if (!context) {
        throw new Error('useActiveCamera precisa estar dentro de um CameraProvider');
    }
    return context;
};
