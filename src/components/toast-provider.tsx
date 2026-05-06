"use client";
import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

type AppContextType = {
  toast: ToastState;
  setToast: (toast: ToastState) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside provider");
  return ctx;
};

export const MyGlobalAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState>(null);

  return <AppContext.Provider value={{ toast, setToast }}>{children}</AppContext.Provider>;
};
