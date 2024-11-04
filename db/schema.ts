import {
    pgTable,
    text,
    timestamp,
    primaryKey,

} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Resync history table
export const resyncHistoryTable = pgTable('resync_history', {
    id: text('id').primaryKey(),
    lastResyncDate: timestamp('last_resync_date').notNull().defaultNow(),
});

// Categories table (Root2)
export const categoriesTable = pgTable('categories', {
    id: text('id').primaryKey(), // Using category name as ID
    category: text('category').notNull().unique(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Level 1 data (Daum)
export const dataLevel1Table = pgTable('data_level_1', {
    id: text('id').primaryKey(), // Using combination of category + description
    categoryId: text('category_id').references(() => categoriesTable.id, { onDelete: 'cascade' }).notNull(),
    category: text('category'),
    description: text('description').notNull(),
    question: text('question'),
    remediation: text('remediation'),
    references: text('references').array().default([]),
    tags: text('tags').array().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Level 2 data (Daum2)
export const dataLevel2Table = pgTable('data_level_2', {
    id: text('id').primaryKey(), // Using meaningful ID from content
    parentId: text('parent_id').references(() => dataLevel1Table.id, { onDelete: 'cascade' }).notNull(),
    category: text('category'),
    description: text('description').notNull(),
    question: text('question'),
    remediation: text('remediation'),
    references: text('references').array().default([]),
    tags: text('tags').array().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Level 3 data (Daum3)
export const dataLevel3Table = pgTable('data_level_3', {
    id: text('id').primaryKey(), // Using the provided ID
    parentId: text('parent_id').references(() => dataLevel2Table.id, { onDelete: 'cascade' }).notNull(),
    description: text('description').notNull(),
    question: text('question').notNull(),
    remediation: text('remediation').notNull(),
    references: text('references').array().default([]),
    tags: text('tags').array().notNull().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Relations
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
    dataLevel1: many(dataLevel1Table),
}));

export const dataLevel1Relations = relations(dataLevel1Table, ({ one, many }) => ({
    category: one(categoriesTable, {
        fields: [dataLevel1Table.categoryId],
        references: [categoriesTable.id],
    }),
    dataLevel2: many(dataLevel2Table),
}));

export const dataLevel2Relations = relations(dataLevel2Table, ({ one, many }) => ({
    parent: one(dataLevel1Table, {
        fields: [dataLevel2Table.parentId],
        references: [dataLevel1Table.id],
    }),
    dataLevel3: many(dataLevel3Table),
}));

export const dataLevel3Relations = relations(dataLevel3Table, ({ one }) => ({
    parent: one(dataLevel2Table, {
        fields: [dataLevel3Table.parentId],
        references: [dataLevel2Table.id],
    }),
}));

// Type definitions for insert and select operations
export type ResyncHistory = typeof resyncHistoryTable.$inferSelect;
export type InsertResyncHistory = typeof resyncHistoryTable.$inferInsert;

export type Category = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;

export type DataLevel1 = typeof dataLevel1Table.$inferSelect;
export type InsertDataLevel1 = typeof dataLevel1Table.$inferInsert;

export type DataLevel2 = typeof dataLevel2Table.$inferSelect;
export type InsertDataLevel2 = typeof dataLevel2Table.$inferInsert;

export type DataLevel3 = typeof dataLevel3Table.$inferSelect;
export type InsertDataLevel3 = typeof dataLevel3Table.$inferInsert;



