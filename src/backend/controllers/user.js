import {User} from "../models/user.js";
// import jwt from "jsonwebtoken"
import {Controller} from "./controller.js";

import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';


export class UserContr extends Controller {


    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(UserContr.__filename);

    static storage = multer.diskStorage({
        destination: path.join(UserContr.__dirname, '../upload'),
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + path.extname(file.originalname);
            cb(null, uniqueName);
        }
    });

    upload = multer({storage: UserContr.storage});
    _salt = '1010'

    async uploadAvatar(req, res) {
        let user_id;
        try {
            const data = this.check_token(req, res);
            user_id = data.id;
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }

        this.upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            if (!req.file) {
                return res.status(400).json({error: 'No file uploaded'});
            }
            const user = await User.find(user_id)
            if (user.password === null || user.password === undefined) {
                delete user.password;
            }

            user.avatar = '/upload/' + req.file.filename;
            await user.save();
            res.json({success: true, filename: req.file.filename});
        });


    }


    async getUserByI(req, res) {
        try {
            this.check_token(req, res);
            const id = parseInt(req.params.id);
            let user = await User.find(id)
            if (!user) return res.status(404).json(this.err_resp('User not found.'));
            for (const key of ['login', 'password', 'email']) delete user[key];
            return res.status(200).json({user: user, success: true});
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
    }

    async get(req, res) {
        try {
            const data = this.check_token(req, res);
            let hero = await User.find(data.id)
            return res.status(200).json({user: hero, success: true});
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
    }

    async delete(req, res) {
        try {
            const data = this.check_token(req, res);
            const result = await User.delete(data.id);
            if (!result) return res.status(404).json(this.err_resp('User not found.'));
            return res.status(200).json({success: true, message: `User ${data.id} deleted.`});
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
    }

    put(req, res) {
        const body = req.body;
        body.avatar = '/upload/avatar.jpg'; // если файл не отправлен — значение по умолчанию
        if (body.password && (body.password.length < 4 || body.password.length > 32)) {
            return res.status(400).send(this.err_resp('Password must be between 4 and 32 characters long.'))
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return res.status(400).send(this.err_resp('Email is not valid.'))
        }
        body.password = this.set_password_token(body.password)
        const user = new User(body);
        user.save()
            .then((result) => {
                result.games_qty = 0;
                result.victories_qty = 0;
                res.status(201).json({
                    user: result,
                    token: this.set_token(result.id),
                    refresh: this.set_refresh(result.id, result.email),
                    success: true});
            })
            .catch(err => {
                console.error(err.message);
                res.status(400).json(this.err_resp(err.message));
            });
    }

    post(req, res) {
        const body = req.body;
        if (!body.password || (body.password.length < 4 || body.password.length > 32)) {
            return res.status(400).json(this.err_resp('Invalid password.'))
        }
        body.password = this.set_password_token(body.password)
        const user = new User();
        user.signIn(body.login, body.password)
            .then((result) => {
                if (result === null) {
                    return res.status(400).json(this.err_resp('Invalid login or password.'))
                } else {
                    res
                        // .setHeader('Set-Cookie', `token=${this.set_token(user.id)}; Max-Age=600; Path=/`)
                        .status(200)
                        .json({
                            token: this.set_token(user.id),
                            refresh: this.set_refresh(user.id, user.email),
                            user: result
                        });
                }
            })
            .catch(err => {
                console.error(err.message);
                res.status(400).json(this.err_resp(err.message));
            });

    }

    patch(req, res) {
        let user;
        try {
            const data = this.check_token(req, res);
            const body = req.body;

            if (body.password) {
                delete body.password;
            }
            body.id = data.id;
            user = new User(req.body);
            for (const key of ['password', 'games_qty', 'victories_qty']) delete user[key];
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
        user.save()
            .then((result) => {
                res.status(200).json({user: result, success: true});
            })
            .catch(err => {
                console.error(err.message);
                res.status(400).json(this.err_resp(err.message));
            });
    }

    refresh(req, res) {
        try {
            const data = this.check_refresh(req, res);
            return res.status(200).json({
                token: this.set_token(data.id),
                refresh: this.set_refresh(data.id, data.mail),
                success: true
            });
        } catch (err) {
            if (err.message === '__refresh_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
    }


    async password_change(req, res) {
        try {
            const data = this.check_token(req, res);
            const body = req.body;
            const new_password = this.set_password_token(body.new_pas);
            const old_password = this.set_password_token(body.old_pas);
            const result = await User.changePassword(data.id, old_password, new_password)
            if (result.success){
                res.status(200).json({success: true, message: 'Password changed.'});
            } else {
                res.status(400).json({success: false, message: 'Incorrect login or password.'});
            }

        }catch {
            res.status(500).json({success: false, message: 'something went wrong'})
        }


    }

    async get_all_users(req, res) {
        try {
            this.check_token(req, res);
            let users = await User.findAll()
            if (!users) return res.status(404).json(this.err_resp('Users not found.'));
            return res.status(200).json({users: users, success: true});
        } catch (err) {
            if (err.message === '__token_failed__') return;
            console.error(err.message);
            return res.status(400).json(this.err_resp(err.message));
        }
    }
}