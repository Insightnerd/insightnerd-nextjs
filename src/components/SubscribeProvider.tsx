"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SubscribeContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SubscribeContext = createContext<SubscribeContextValue>({
  open: false,
  setOpen: () => {},
});

export function useSubscribe() {
  return useContext(SubscribeContext);
}

export function SubscribeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SubscribeContext.Provider value={{ open, setOpen }}>
      {children}
    </SubscribeContext.Provider>
  );
}
