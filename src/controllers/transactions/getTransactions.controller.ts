import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transactions.types";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";

dayjs.extend(utc);

export const getTransactions = async (
    request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
    reply: FastifyReply,
): Promise<void> => {

    const userId = request.userId; // userId => request.userId


    if (!userId) {
        return reply.status(401).send({ error: "Usuário não autenticado" })
    }

    const { month, type, year, categoryId } = request.query;

    const filters: TransactionFilter = { userId };

    if (month && year) {
        const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs.utc(startDate).endOf("month").toDate();
        filters.date = { gte: startDate, lte: endDate };

    }
    if (type) {
        filters.type = type;
    }

    if (categoryId) {
        filters.categoryId = categoryId
    }

    try {
        const transaction = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: {
                        color: true,
                        name: true,
                        type: true
                    },
                }
            }
        });

        reply.send(transaction);
    } catch (error) {
        request.log.error({ err: error }, "Error ao trazer transações");
        reply.status(500).send({ error: "Error do Servidor" });
    }
};