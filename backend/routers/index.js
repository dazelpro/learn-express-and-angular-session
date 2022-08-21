import express from "express";
import {
    getUsers,
    Login,
    Register,
    Logout,
} from "../controllers/controller.user.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/controller.refresh.token.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);

router.get("/refresh-token", refreshToken);

router.delete("/logout", Logout);

export default router;
