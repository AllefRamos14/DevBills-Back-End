import { FastifyReply, FastifyRequest } from "fastify";
import { GetHistoricalTransactionQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import prisma from "../../config/prisma";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export const getHistoricalTransaction = async (
    request: FastifyRequest<{ Querystring: GetHistoricalTransactionQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId;

    if (!userId) {
        reply.status(401).send({ error: "Usúario nao autenticado" });
        return;
    }

    const { month, year, months = 6 } = request.query;

    const baseDate = new Date(year, month - 1, 1)


    const startDate = dayjs.utc(baseDate).subtract(months - 1, "month").startOf("month").toDate();

    const endDate = dayjs.utc(baseDate).endOf("month").toDate();

    try {
        const transaction = await prisma.transaction.findMany({
            where: {
                userId: userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                amount: true,
                type: true,
                date: true,
            },
        });

        const montlyData = Array.from({ length: months }, (_, i) => {
            const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");

            return {
                name: date.format("MMM/YYYY"),
                income: 0,
                expenses: 0,
            };
        });

        transaction.forEach((transaction) => {
            const monthkey = dayjs.utc(transaction.date).format("MMM/YYYY");
            const monthData = montlyData.find((m) => m.name === monthkey)

            if (monthData) {
                if (transaction.type === "income") {
                    monthData.income += transaction.amount
                } else {
                    monthData.expenses += transaction.amount;
                }
            }
        })
        reply.send({ history: montlyData });
    } catch (erro) {
        request.log.error({ err: erro }, "Erro ao buscar histórico mensal");
        reply.status(500).send({ error: "Erro no servidor" });
    }
};