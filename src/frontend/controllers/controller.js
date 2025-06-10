import path from "path";
import { fileURLToPath } from 'url';
import express from 'express';





export class Page {
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(this.__filename);


    getPage(req, res) {
        const page = req.params.smth;
        res.sendFile(path.join(this.__dirname, '..', 'views',`${page}`, `index.html`));

    }

    serveStatic(req, res, next) {
        const page = req.params.smth; // папка с файлами
        const staticMiddleware = express.static(path.join(this.__dirname, '..', 'views', page));
        staticMiddleware(req, res, next);
    }
}