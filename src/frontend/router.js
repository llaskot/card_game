import express from "express";
import {Page} from "./controllers/controller.js";
// import {UserContr} from "./controllers/user.js";

export function frontendRouter() {
    const router = express.Router();
    router.use('/', gameRouter);
    return router;
}

const gameRouter = express.Router();
const page = new Page();
gameRouter.route('/:smth')
    .get((req, res) => page.getPage(req, res))

gameRouter.use('/:smth', (req, res, next) => page.serveStatic(req, res, next));

// gameRouter.route('/')
//     .get((req, res) => {console.log('4444444444')})


//     .put((req, res) => userContr.put(req, res))
//     .post((req, res) => userContr.post(req, res))
//     .delete((req, res) => userContr.delete(req, res))
//     .patch((req, res) => userContr.patch(req, res));
// userRouter.route('/:id')
//     .get((req, res) => userContr.getUserByI(req, res));
// userRouter.route('/refresh')
//     .post((req, res) => userContr.refresh(req, res));