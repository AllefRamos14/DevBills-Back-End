import admin from "firebase-admin";
import { FastifyReply, FastifyRequest } from "fastify";
import { initializeGlobalCategories } from "../services/globalCategories.service";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}
// ✅ cache em memória por usuário
const initializedUsers = new Set<string>();


export const authmiddleware = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {

    // ✅ Ignora preflight CORS
    if (request.method === "OPTIONS") {
        return;
    }


    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return reply
            .code(401)
            .send({ error: "🚨 Token de autorização não fornecido" })

    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decodedtoken = await admin.auth().verifyIdToken(token);
        const userId = decodedtoken.uid;
        request.userId = decodedtoken.uid;

        // ✅ inicializa categorias apenas 1x por usuário (em memória)
        if (!initializedUsers.has(userId)) {
            await initializeGlobalCategories(userId);
            initializedUsers.add(userId);
        }


        return;
    } catch (err) {
        request.log.error("Erro ao verificar token", err);
        return reply
            .code(401)
            .send({ error: "Token invalido ou expirado" });

    }

};