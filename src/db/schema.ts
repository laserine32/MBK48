import { pgTable, timestamp, text, integer, foreignKey, serial, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm";

export const purchase = pgTable("Purchase", {
  id: text().primaryKey().notNull(),
  date: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  total: integer().default(0).notNull(),
});

export const packInUse = pgTable(
  "PackInUse",
  {
    id: serial().primaryKey().notNull(),
    packId: text().notNull(),
    timeStart: timestamp("time_start", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    timeEnd: timestamp("time_end", { precision: 3, mode: "string" }).notNull(),
    flag: boolean().default(true).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.packId],
      foreignColumns: [packs.id],
      name: "PackInUse_packId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);

export const production = pgTable(
  "Production",
  {
    id: serial().primaryKey().notNull(),
    packId: text().notNull(),
    date: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.packId],
      foreignColumns: [packs.id],
      name: "Production_packId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);

export const items = pgTable("Items", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  unit: text().notNull(),
  price: integer().notNull(),
  flag: boolean().default(true).notNull(),
});

export const packs = pgTable("Packs", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  totalContent: integer("total_content").notNull(),
  flag: boolean().default(true).notNull(),
});

export const purchaseDetail = pgTable(
  "PurchaseDetail",
  {
    itemId: text().notNull(),
    purchaseId: text().notNull(),
    qty: integer().notNull(),
    cost: integer().notNull(),
    total: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [items.id],
      name: "PurchaseDetail_itemId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.purchaseId],
      foreignColumns: [purchase.id],
      name: "PurchaseDetail_purchaseId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    primaryKey({ columns: [table.itemId, table.purchaseId], name: "PurchaseDetail_pkey" }),
  ]
);

export const packInUseRelations = relations(packInUse, ({ one }) => ({
  pack: one(packs, {
    fields: [packInUse.packId],
    references: [packs.id],
  }),
}));

export const packsRelations = relations(packs, ({ many }) => ({
  packInUses: many(packInUse),
  productions: many(production),
}));

export const productionRelations = relations(production, ({ one }) => ({
  pack: one(packs, {
    fields: [production.packId],
    references: [packs.id],
  }),
}));

export const purchaseDetailRelations = relations(purchaseDetail, ({ one }) => ({
  item: one(items, {
    fields: [purchaseDetail.itemId],
    references: [items.id],
  }),
  purchase: one(purchase, {
    fields: [purchaseDetail.purchaseId],
    references: [purchase.id],
  }),
}));

export const itemsRelations = relations(items, ({ many }) => ({
  purchaseDetails: many(purchaseDetail),
}));

export const purchaseRelations = relations(purchase, ({ many }) => ({
  purchaseDetails: many(purchaseDetail),
}));
