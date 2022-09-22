import Users from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ["id", "name", "email"],
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
};

export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPass,
        });
        res.json({ msg: "Success" });
    } catch (error) {
        console.log(error);
    }
};

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email,
            },
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.sendStatus(400).json({ msg: "Wrong password" });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign(
            { userId, name, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "10s", //10 detik
            }
        );
        const refreshToken = jwt.sign(
            { userId, name, email },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "30s",
            }
        );
        await Users.update(
            {
                refresh_token: refreshToken,
            },
            {
                where: {
                    id: userId,
                },
            }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 hari / 
        });
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.sendStatus(404).json({ msg: "Email not found" });
    }
};

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken,
        },
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, { where: { id: userId } });
    res.clearCookie(refreshToken);
    return res.sendStatus(200);
};
