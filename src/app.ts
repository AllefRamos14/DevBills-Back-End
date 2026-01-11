import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./routes";
import { env } from "./config/env";
import cors from "@fastify/cors";


const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === "dev" ? "info" : "error",
    }
});

// 🔥 LINHA OBRIGATÓRIA
app.decorateRequest("userId", undefined);

app.register(cors, {
    origin: "http://localhost:5173",
    // origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
})
app.register(routes, { prefix: "/api" });


export default app

// localStorage:3001/api/categories
// apidevbills.com.br/api/categories