import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./routes";
import { env } from "./config/env";
import cors from "@fastify/cors";

const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === "production" ? "info" : "debug",
    },
});

app.decorateRequest("userId", undefined);

app.register(cors, {
    origin:
        env.NODE_ENV === "production"
            ? ["https://seu-frontend.vercel.app"]
            : ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

// rota base
app.get("/", async () => {
    return { message: "API DevBills rodando 🚀" };
});

// health check
app.get("/health", async () => {
    return { status: "ok" };
});

app.register(routes, { prefix: "/api" });

export default app;