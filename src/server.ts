import app from "./app";
import { prismaConnect } from "./config/prisma";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
const PORT = env.PORT;



initializeFirebaseAdmin();

const startServer = async () => {
    try {
        await prismaConnect();

        await app.listen({ port: PORT }).then(() => {
            console.log(`Servidor Rodando Na Port ${PORT}`)
        })
    } catch (error) {

        console.log(error)
    }
}
startServer()


