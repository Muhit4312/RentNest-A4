import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), ".env")

})


const config = {

    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refress_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expairs_in: process.env.JWT_ACCESS_EXPAIRS_IN!,
    jwt_refresh_expairs_in: process.env.JWT_REFRESH_EXPAIRS_IN!,
    stripe_product_id: process.env.STRIPE_PRODUCT_ID!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,

}

export default config