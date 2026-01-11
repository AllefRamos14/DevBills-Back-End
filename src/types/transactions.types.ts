import type { TransactionType } from "@prisma/client";
import { CategorySummary } from "./category.types";

export interface TransactionFilter {
    userId?: string,
    date?: {
        gte: Date;
        lte: Date;
    };
    type?: TransactionType;
    categoryId?: string;
}

export interface TransactionSummary {
    totalExpenses: number,
    totalIncomes: number,
    balance: number,
    expensesByCategory: CategorySummary[];
}

// gte → greater than or equal → maior ou igual
// lte → less than or equal → menor ou igual