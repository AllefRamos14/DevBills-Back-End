import app from "./app";
import { prismaConnect } from "./config/prisma";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";

const PORT = Number(process.env.PORT) || env.PORT || 3001;

initializeFirebaseAdmin();

const startServer = async () => {
    try {
        await prismaConnect();

        await app.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        console.log(`Servidor Rodando Na Port ${PORT}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();