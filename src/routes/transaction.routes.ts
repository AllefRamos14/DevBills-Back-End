import { type FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { getHistoricalTransaction } from "../controllers/transactions/getHistoricalTransaction.controller";


const transactionRoutes = async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", authmiddleware);


    fastify.route({
        method: "POST",
        url: "/",
        handler: createTransaction,
    });

    fastify.route({
        method: "GET",
        url: "/",
        handler: getTransactions,
    });


    fastify.route({
        method: "GET",
        url: "/summary",


        handler: getTransactionsSummary,
    });


    fastify.route({
        method: "GET",
        url: "/historical",


        handler: getHistoricalTransaction,
    });


    fastify.route({
        method: "DELETE",
        url: "/:id",

        handler: deleteTransaction,
    });




};
export default transactionRoutes;
