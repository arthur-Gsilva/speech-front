// context/UserContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UserType = "Arthur" | "Lucas" | "ADMIN" | "";

interface UserContextType {
  user: UserType;
  setUser: (user: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>("");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro de UserProvider");
  return context;
};
