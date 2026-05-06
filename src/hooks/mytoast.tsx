"use client";
import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { useApp } from "@/components/toast-provider";

export const MyToast = () => {
  const { toast, setToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    sonnerToast[toast.type](toast.message, { position: "top-center" });
    // reset setelah tampil
    setToast(null);
  }, [toast, setToast]);

  return null;
};
