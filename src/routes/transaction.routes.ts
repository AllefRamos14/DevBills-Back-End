import { type FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { getHistoricalTransaction } from "../controllers/transactions/getHistoricalTransaction.controller";


const transactionRoutes = async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", authmiddleware);

    // Criação
    fastify.route({
        method: "POST",
        url: "/",
        handler: createTransaction,
    });
    // Buscar com filtros
    fastify.route({
        method: "GET",
        url: "/",
        handler: getTransactions, // só isso
    });

    // Buscando Resumo
    fastify.route({
        method: "GET",
        url: "/summary",


        handler: getTransactionsSummary,
    });
    // Historical de transações

    fastify.route({
        method: "GET",
        url: "/historical",


        handler: getHistoricalTransaction,
    });

    // Deleta
    fastify.route({
        method: "DELETE",
        url: "/:id",

        handler: deleteTransaction,
    });




};
export default transactionRoutes;
