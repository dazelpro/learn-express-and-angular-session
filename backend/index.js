import express from "express";
import db from "./configs/database.js";
import router from "./routers/index.js";

const app = express();

try {
    await db.authenticate();
    console.log("Database connected...");
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(router);

app.listen(8000, () => {
    console.log("Server running in port 8000");
});
