import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
    try {
        await prisma.$connect();
        console.log("✅ DB conectado com sucesso!");
    } catch (error) {
        console.log("🚨 Falha ao conectar o DB", error);
        process.exit(1);
    }
}


export default prisma;



