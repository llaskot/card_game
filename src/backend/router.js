import express from "express";
import {UserContr} from "./controllers/user.js";

export function backendRouter() {
    const router = express.Router();
    router.use('/user', userRouter);
    // router.use('/card', cardRouter);
    return router;
}

const userRouter = express.Router();
const userContr = new UserContr();
// const cardRouter = express.Router();
userRouter.route('/')
    .get((req, res) => userContr.get(req, res))
    .put((req, res) => userContr.put(req, res))
    .post((req, res) => userContr.post(req, res))
    .delete((req, res) => userContr.delete(req, res))
    .patch((req, res) => userContr.patch(req, res));
userRouter.route('/:id')
    .get((req, res) => userContr.getUserByI(req, res));
userRouter.route('/refresh')
    .post((req, res) => userContr.refresh(req, res));
userRouter.route('/upload')
    .put((req, res) => userContr.uploadAvatar(req, res))
userRouter.route('/password_change')
    .post((req, res) => userContr.password_change(req, res))
userRouter.route('/all/rate')
    .get((req, res) => userContr.get_all_users(req, res))

// cardRouter.route('/')
//     .get((req, res) => res.json({aaa: 'card hello'}));
