import {Room} from "colyseus";
import {UserController} from "./gameRoomSet/userController.js";
import {Game} from "./gameRoomSet/game.js";

export class GameRoom extends Room {
    maxClients = 2;
    // state = new MyRoomState();
    users = []
    game = null;


    async onAuth(client, options, authContext) {
        const token = options.token;
        this.broadcast("status", "broadcast: some one trying to connect");

        this.onMessage("table", (client, message) => {
            this.game.updateTable(client.sessionId, message.table);
        });

        this.onMessage("attack", (client, message) => {
            this.game.attack(client.sessionId, message.table);
        });

        this.onMessage("moveEnd", (client) => {
            this.game.countdownControl.stop()
        })

        const id = UserController.check_token(token);
        if (!id) {
            this.broadcast("status", "broadcast: token problem");
            throw new Error("Unauthorized user"); // отклонить подключение
        }
        if (this.users.length === 1 && this.users[0].id === id) {
            this.broadcast("status", `broadcast: User ${id} already in room`);
            throw new Error(`User ${id} already in room`);
        }

        let user = await UserController.getUserByI(id);
        user['client'] = client
        this.users.push(user);
        this.broadcast("status", `broadcast: user ${id} added`);
        return true; // разрешить подключение
    }


    onJoin(client, options, auth) {
        this.broadcast("status", `broadcast: user ${client.sessionId}  joined ${this.roomId} room`);

        if (this.clients.length === 1) {
            this.users[0].client.send("status", "wait");
        } else {
            this.broadcast("status", `broadcast: game start`);

            this.game = new Game(this.users[0], this.users[1], this);
            this.users[0].client.send("enemy", {
                enemy: {
                    name: this.users[1].name,
                    avatar: this.users[1].avatar,
                }
            });
            this.users[1].client.send("enemy", {
                enemy: {
                    name: this.users[0].name,
                    avatar: this.users[0].avatar,
                }
            });
            this.game.countDown_acync(5)
                .then(() => this.game.sendStage())
                .then(() => this.game.game_host())

        }
        this.broadcast("status", `broadcast: users: ${this.users.map(user => user.id).join(', ')}`)
    }

    onCreate(options) {
        this.autoDispose = 0;
    }


    onLeave(client, consented) {
        if (this.clients.length === 0) {
            this.disconnect().then(); // немедленно закрывает комнату
            return;
        }

        this.broadcast("status", `broadcast: user ${client.sessionId} left`);
        let curUser = null;
        if (this.game) {
            curUser = [this.game.user1, this.game.user2].find(user => user.client.sessionId === client.sessionId);
        }
        // Можно очистить комнату если нужно
        this.allowReconnection(client, 10) // ждём до 10 секунд
            .then(newClient => {
                if (curUser) {
                    curUser.client = newClient;
                    this.game.sendStage();
                }

                this.broadcast("status", `broadcast: user ${client.sessionId} get back`);
                // клиент вернулся
            })
            .catch(async () => {
                this.broadcast("status", `broadcast: user ${client.sessionId} get lost`);
                curUser = [this.game.user1, this.game.user2].find(user => user.client.sessionId === client.sessionId);
                const winner = curUser === this.game.user1 ? this.game.user2 : this.game.user1;
                if (this.clients.length === 0) {
                    await this.disconnect();
                    return;
                }
                this.game.final(winner, curUser)
                setTimeout(async () => {
                    this.users = [];
                    await this.disconnect();
                }, 2000)



            });
    }

    onDispose() {
        console.log("Room disposed");
        this.broadcast("status", "room disposed");
    }
}
