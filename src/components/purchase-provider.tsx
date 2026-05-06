"use client";
import { DetailPurchaseInputType } from "@/server/purchase";
import { createContext, useContext, useState } from "react";

type PurchaseContextType = {
  items: DetailPurchaseInputType[];
  addItem: (item: Omit<DetailPurchaseInputType, "total">) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
};

const PurchaseContext = createContext<PurchaseContextType | null>(null);

export const usePurchase = () => {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("usePurchase must be used inside provider");
  return ctx;
};

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<DetailPurchaseInputType[]>([]);

  const addItem = (newItem: Omit<DetailPurchaseInputType, "total">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === newItem.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === newItem.itemId
            ? {
                ...i,
                qty: i.qty + newItem.qty,
                total: (i.qty + newItem.qty) * newItem.price,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          total: newItem.qty * newItem.price,
        },
      ];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const clear = () => setItems([]);

  return <PurchaseContext.Provider value={{ items, addItem, removeItem, clear }}>{children}</PurchaseContext.Provider>;
};
