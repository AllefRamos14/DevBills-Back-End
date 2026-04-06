import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID é obrigatório"),
    FIREBASE_PRIVATE_KEY: z.string().min(1, "FIREBASE_PRIVATE_KEY é obrigatório"),
    FIREBASE_CLIENT_EMAIL: z.string().min(1, "FIREBASE_CLIENT_EMAIL é obrigatório"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Variaveis de ambiente INVÁLIDAS");
    console.error(_env.error.format());
    process.exit(1);
}

export const env = _env.data;