import { Sequelize } from "sequelize";
import db from "../configs/database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
    "users",
    {
        name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        password: { type: DataTypes.TEXT },
        refresh_token: { type: DataTypes.TEXT },
    },
    { freezeTableName: true }
);

export default Users;
