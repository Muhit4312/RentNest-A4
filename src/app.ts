import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express"
import cors from "cors"
import config from "./config/env.config";
import { userRoutes } from "./modules/user/user.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/property/property.route";
import { publicProperyRoutes } from "./modules/public/publicPropery.route";

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use("/api/auth", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/landlord", propertyRoutes)
app.use("/api/properties", publicProperyRoutes)



export default app