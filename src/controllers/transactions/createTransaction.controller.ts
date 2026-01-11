import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


const createTransaction = async (
    request: FastifyRequest,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId;

    if (!userId) {
        return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const result = createTransactionSchema.safeParse(request.body);

    if (!result.success) {
        return reply
            .status(400)
            .send({ error: result.error.issues[0]?.message });
    }

    const transaction = result.data;

    try {

        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });

        if (!category) {
            return reply.status(400).send({ error: "Categoria invalida" });

        }

        const parsedDate = new Date(transaction.date);


        const newTransaction = await prisma.transaction.create({
            data: {
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                userId,
                date: parsedDate,
                category: {
                    connect: {
                        id: transaction.categoryId,
                    },
                },
            },
            include: {
                category: true,
            },
        });

        return reply.status(201).send(newTransaction);
    } catch (error) {
        request.log.error(error, "Erro ao criar transação");
        return reply.status(500).send({ error: "Erro interno do servidor" });
    }
};

export default createTransaction;
