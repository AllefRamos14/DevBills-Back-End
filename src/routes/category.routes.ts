import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers/category.controller";
import { authmiddleware } from "../middleware/auth.middleware";

const categoryRoutes = async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook("preHandler", authmiddleware);


    fastify.get("/", getCategories);
};

export default categoryRoutes;