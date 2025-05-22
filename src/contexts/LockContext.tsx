'use client'

import { createContext, ReactNode, useContext, useState } from 'react';

type LockContextType  = {
    locked: boolean;
    setLocked: (locked: boolean) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
    const [locked, setLocked] = useState<boolean>(true);

    return (
        <LockContext.Provider value={{ locked, setLocked }}>
            {children}
        </LockContext.Provider>
    );
};

export const useLock = (): LockContextType => {
    const context = useContext(LockContext);
    if (!context) {
        throw new Error('useLock must be used within a LockProvider');
    }
    return context;
};
