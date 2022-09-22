import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./configs/database.js";
import router from "./routers/index.js";

dotenv.config();

const app = express();

try {
    await db.authenticate();
    console.log("Database connected...");
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(router);

app.listen(8000, () => {
    console.log("Server running in port 8000");
});
