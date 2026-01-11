import { FastifyReply, FastifyRequest } from "fastify";
import { GetTransactionsSchemaQuery, getTransactionSummarySchema } from "../../schemas/transaction.schema";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import prisma from "../../config/prisma";
import { TransactionType } from "@prisma/client";
import { CategorySummary } from "../../types/category.types";
import { TransactionSummary } from "../../types/transactions.types";
import { roundTwoDecimals } from "../../utils/Number";

dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionsSchemaQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId; // userId => request.userId

    if (!userId) {
        return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const { month, year } = request.query;

    if (!month || !year) {
        return reply.status(400).send({ error: "Mês e ano são obrigatórios" });
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(startDate).endOf("month").toDate();

    // const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    // const endDate = dayjs(startDate).endOf("month").toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                category: true,
            },
        });

        let totalExpenses = 0;
        let totalIncomes = 0;
        const groupedExpenses = new Map<string, CategorySummary>();

        for (const transaction of transactions) {

            if (transaction.type === TransactionType.expense) {

                const existing =
                    groupedExpenses.get(transaction.categoryId) ?? {
                        categoryId: transaction.categoryId,
                        categoryName: transaction.category.name,
                        categoryColor: transaction.category.color,
                        amount: 0,
                        percentage: 0,
                    };

                existing.amount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);

                totalExpenses += transaction.amount;
            } else {
                totalIncomes += transaction.amount;
            }
        }

        const summary: TransactionSummary = {
            totalExpenses: roundTwoDecimals(totalExpenses),
            totalIncomes: roundTwoDecimals(totalIncomes),
            balance: roundTwoDecimals(totalIncomes - totalExpenses),
            expensesByCategory: Array.from(groupedExpenses.values())
                .map((entry) => ({
                    ...entry,

                    percentage:
                        totalExpenses > 0
                            ? roundTwoDecimals((entry.amount / totalExpenses) * 100)
                            : 0,
                }))
                .sort((a, b) => b.amount - a.amount),
        };

        reply.send(summary);

    } catch (error) {
        request.log.error({ err: error }, "Erro ao trazer transações");
        reply.status(500).send({ error: "Erro no servidor" });
    }

};

