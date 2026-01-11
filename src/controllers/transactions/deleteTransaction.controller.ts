import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import { DeleteTransactionSchema } from "../../schemas/transaction.schema";

export const deleteTransaction = async (
    request: FastifyRequest<{ Params: DeleteTransactionSchema }>,
    reply: FastifyReply
): Promise<void> => {
    const userId = request.userId;

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }

    const { id } = request.params;

    try {
        const result = await prisma.transaction.deleteMany({
            where: {
                id,
                userId: userId

            },
        });



        if (result.count === 0) {
            reply.status(404).send({
                error: "Transação não encontrada ou não pertence ao usuário",
            });
            return;
        }

        reply.status(200).send({
            message: "Transação deletada com sucesso",
        });
    } catch (error) {
        request.log.error(error, "Erro ao deletar transação");
        reply.status(500).send({ error: "Erro interno no servidor" });
    }
};
