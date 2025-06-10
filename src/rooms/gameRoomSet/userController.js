import jwt from "jsonwebtoken";
import {User} from "../../backend/models/user.js";

export class UserController {
    static _secretKey = 'fuck you';

    static check_token(token) {
        try {
            const obj = jwt.verify(token, this._secretKey);
            return obj.id;
        } catch (err) {
            return null;
        }
    }

    static async getUserByI(id) {
        try {
            let user = await User.find(id)
            if (!user) return null;
            for (const key of ['login', 'password', 'email']) delete user[key];
            return user;
        } catch (err) {
            console.error(err.message);
            return null;
        }
    }
}