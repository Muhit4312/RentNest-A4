import app from "./app"
import config from "./config/env.config"
import { prisma } from "./lib/prisma"

const main = async () => {
    try {
        await prisma.$connect()
        console.log("Database successfully connected.")
        app.listen(config.port, () => {
            console.log(`Server app listening on port ${config.port}`)
        })

    } catch (error) {
        console.log("Error starting the server:", error)
        await prisma.$disconnect()
        process.exit(1)

    }
}


main()