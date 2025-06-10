import config from "@colyseus/tools";
import {monitor} from "@colyseus/monitor";
import {playground} from "@colyseus/playground";

/**
 * Import your Room files
 */
// import {MyRoom} from "./rooms/MyRoom.js";

import { GameRoom } from "./rooms/GameRoom.js";
import {backendRouter} from "./backend/router.js";
import {frontendRouter} from "./frontend/router.js";



import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        // gameServer.define('my_room', MyRoom);
        gameServer.define('my_room', GameRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/colyseus/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());

        app.use('/backend', backendRouter())

        app.use('/game', frontendRouter())

        app.use('/upload', express.static(path.join(__dirname, 'backend/upload')));



    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }

});
