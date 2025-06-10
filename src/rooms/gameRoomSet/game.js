import {User} from "../../backend/models/user.js";

export class Game {
    deck = [
        {
            id: 0,
            hp: 600,
            damage: 650,
            price: 700,
            name: 'spider-man'
        },
        {
            id: 1,
            hp: 550,
            damage: 700,
            price: 750,
            name: 'iron man'
        },
        {
            id: 2,
            hp: 700,
            damage: 600,
            price: 650,
            name: 'captain america'
        },
        {
            id: 3,
            hp: 700,
            damage: 750,
            price: 800,
            name: 'thor'
        },
        {
            id: 4,
            hp: 450,
            damage: 550,
            price: 500,
            name: 'black widow'
        },
        {
            id: 5,
            hp: 750,
            damage: 800,
            price: 800,
            name: 'hulk'
        },
        {
            id: 6,
            hp: 550,
            damage: 650,
            price: 700,
            name: 'doctor strange'
        },
        {
            id: 7,
            hp: 650,
            damage: 600,
            price: 650,
            name: 'black panther'
        },
        {
            id: 8,
            hp: 500,
            damage: 700,
            price: 750,
            name: 'scarlet witch'
        },
        {
            id: 9,
            hp: 750,
            damage: 650,
            price: 700,
            name: 'wolverine'
        },
        {
            id: 10,
            hp: 650,
            damage: 700,
            price: 750,
            name: 'captain marvel'
        },
        {
            id: 11,
            hp: 700,
            damage: 600,
            price: 650,
            name: 'deadpool'
        },
        {
            id: 12,
            hp: 550,
            damage: 600,
            price: 650,
            name: 'storm'
        },
        {
            id: 13,
            hp: 550,
            damage: 550,
            price: 600,
            name: 'loki'
        },
        {
            id: 14,
            hp: 650,
            damage: 600,
            price: 700,
            name: 'vision'
        },
        {
            id: 15,
            hp: 550,
            damage: 650,
            price: 600,
            name: 'moon knight'
        },
        {
            id: 16,
            hp: 550,
            damage: 700,
            price: 650,
            name: 'shang-chi'
        },
        {
            id: 17,
            hp: 600,
            damage: 650,
            price: 700,
            name: 'america chavez'
        },
        {
            id: 18,
            hp: 650,
            damage: 750,
            price: 750,
            name: 'ghost rider'
        },
        {
            id: 19,
            hp: 550,
            damage: 600,
            price: 650,
            name: 'gambit'
        }
    ]


    constructor(user1, user2, room) {
        this.room = room;
        this.user1 = user1;
        this.user2 = user2;
        this.user1.laydOut = 0;
        this.user2.laydOut = 0;
        this.user1.turn = Math.random() < 0.5;
        this.user2.turn = !this.user1.turn;
        this.user1.hp = 5000;
        this.user2.hp = 5000;
        this.user1.energy = 1500;
        this.user2.energy = 1500;
        this.user1.cards = this.getDesk();
        this.user2.cards = this.getDesk();
        this.user1.hand = this.user1.cards.splice(-4);
        this.user2.hand = this.user2.cards.splice(-4);
        this.user1.cards_on_table = [];
        this.user2.cards_on_table = [];
        this.user1.cards_conditions = [];
        this.user2.cards_conditions = [];
        this.fight = false;
        this.countdownControl = null;
        this.switch = this.switcher();


    }

    setCardsConditions(currUser) {
        const diff = currUser.cards_on_table.filter(x => !currUser.cards_conditions.map(x => x.id).includes(x));
        for (const ind of diff) {
            currUser.cards_conditions.push({...this.deck[ind]});
        }

    }

    getDesk() {
        const numbers = [...Array(20).keys()];
        return numbers.sort(() => Math.random() - 0.5);
    }

    sendStage() {
        this.user1.client.send("stage", {
            my: {
                turn: this.user1.turn,
                fight: this.fight,
                hp: this.user1.hp,
                energy: this.user1.energy,
                hand: this.user1.hand,
                table: this.user1.cards_on_table,
                table_conditions: this.user1.cards_conditions,
            },
            his: {
                hp: this.user2.hp,
                energy: this.user2.energy,
                table: this.user2.cards_on_table,
                table_conditions: this.user2.cards_conditions,

            }
        });
        this.user2.client.send("stage", {
            my: {
                turn: this.user2.turn,
                fight: this.fight,
                hp: this.user2.hp,
                energy: this.user2.energy,
                hand: this.user2.hand,
                table: this.user2.cards_on_table,
                table_conditions: this.user2.cards_conditions,
            },
            his: {
                hp: this.user1.hp,
                energy: this.user1.energy,
                table: this.user1.cards_on_table,
                table_conditions: this.user1.cards_conditions,
            }

        });
    }

    updateTable(client, table) {
        const curUser = [this.user1, this.user2].find(user => user.client.sessionId === client);
        // console.log("table = ", table)
        curUser.laydOut +=1;
        if (curUser.cards_on_table.length >=4) {
            curUser.client.send("warning", "There is MAX 4 cards on table");
            return;
        }
        const diff = table.filter(x => !curUser.cards_on_table.includes(x));
        if (diff.every(val => curUser.hand.includes(val))) {
            let tempEnergy = curUser.energy;
            tempEnergy -= diff.map(x => this.deck[x].price).reduce((a, b) => a + b);
            if (tempEnergy < 0) {
                curUser.client.send("warning", "You don't have enough energy to play this card");
                return;
            }
            curUser.energy = tempEnergy;
            for (const card of diff) {
                curUser.hand.splice(curUser.hand.indexOf(card), 1);
            }
            curUser.cards_on_table.push(...diff);
            this.setCardsConditions(curUser);
        } else {
            curUser.client.send("warning", "You are a fucking cheater");
            return;
        }
        this.sendStage();
    }

    /**
     *
     * @param client do Not send
     * @param table array of card_id
     * //[card_id, card_id] or [card_id, -1]
     *
     * table[0] - card_id attacker
     * table[1] - card_id defender or -1 if defender does not exist and player will be attacked
     *
     */

    attack(client, table) {
        const abuser = [this.user1, this.user2].find(user => user.client.sessionId === client);
        if (!abuser.turn){
            abuser.client.send("warning", "It's not your turn fucking cheater");
            return;
        }
        const victim = abuser === this.user1 ? this.user2 : this.user1;
        if (table[1]<0 && victim.cards_on_table.length > 0) {
            abuser.client.send("warning", "You can not attack enemy if he has cards that protect him");
            return;
        }
        const attacker = abuser.cards_conditions.find(x => x.id === table[0]);
        let defender;
        if (table[1] >= 0) {
            defender = victim.cards_conditions.find(x => x.id === table[1]);
            defender.hp = defender.hp - attacker.damage;
            if (defender.hp <= 0) {
                const index = victim.cards_on_table.indexOf(defender.id);
                if (index !== -1) {
                    victim.cards_on_table.splice(index, 1);
                    victim.cards_conditions.splice(index, 1);
                }
            }
        } else if (table[1] < 0 ) {
            victim.hp -= attacker.damage;
        }

        if ((victim.hp <= 0) || victim.cards_on_table.length + victim.hand.length + victim.cards.length <= 0) {
            this.sendStage();
            void this.final(abuser, victim);
        }
        this.countdownControl.stop()
    }

    async final(abuser, victim) {
        abuser.client.send("status", "You win");
        victim.client.send("status", "You lose");
        const us = new User();
        us.find(abuser.id)
            .then(user => {
                delete user.password;
                user.games_qty += 1;
                user.victories_qty += 1;
                return user;
            }).then(user => {
            user.save();
        });
        us.find(victim.id)
            .then(user => {
                delete user.password;
                user.games_qty += 1;
                return user;
            }).then(user => {
            user.save();
        })
            .then(
                this.countDown_acync(3)
                    .then(() => {
                        abuser.client.send("status", "Combat is over");
                        victim.client.send("status", "Combat is over");
                        this.room.disconnect();
                    })
            )
    }


    * gen(seconds) {
        for (let i = seconds; i >= 0; i--) {
            yield i;
        }
    }

    countDown(seconds) {
        const gener = this.gen(seconds);
        const timer = setInterval(() => {
            let current = gener.next().value;
            this.user1.client.send("countdown", current);
            this.user2.client.send("countdown", current);
            if (current === 0) {
                clearInterval(timer);
            }
        }, 1000)
    }




    countDown_acync(seconds) {
        const gener = this.gen(seconds);
        this.countdownControl = {gener};

        return new Promise((resolve) => {

            const timer = setInterval(() => {
                const {value, done} = gener.next();
                this.user1.client.send("countdown", value);
                this.user2.client.send("countdown", value);
                if (done || value === 0) {
                    clearInterval(timer);
                    resolve(); // отсчёт завершён
                }
            }, 1000);
            this.countdownControl.stop = () => {
                clearInterval(timer);
                gener.return(); // завершить генератор штатно
                resolve();
            };
        });
    }


    * switcher() {
        while (true) {
            this.user1.turn = !this.user1.turn;
            this.user2.turn = !this.user2.turn;
            this.fight = false;
            yield;

            this.user1.turn = !this.user1.turn;
            this.user2.turn = !this.user2.turn;
            this.fight = true;
            yield;

            this.user1.turn = !this.user1.turn;
            this.user2.turn = !this.user2.turn;
            this.fight = true;
            yield;

            this.fight = false;
            this.user1.energy += 600;
            this.user2.energy += 600;
            // console.log('this.user1.laydOut = ', this.user1.laydOut)
            // console.log('this.user2.laydOut = ', this.user2.laydOut)


            for (let i = 0; i < this.user1.laydOut; i++) {
                if (this.user1.cards.length > 0 && this.user1.hand.length < 4) {
                    this.user1.hand.push(this.user1.cards.pop());

                }
            }
            this.user1.laydOut = 0;
            for (let i = 0; i < this.user2.laydOut; i++) {
                if (this.user2.cards.length > 0 && this.user2.hand.length < 4) {
                    this.user2.hand.push(this.user2.cards.pop());
                }
            }
            this.user2.laydOut = 0;
            yield;

        }
    }


    async game_host() {
        while (true) {
            await this.countDown_acync(30);
            this.switch.next();
            this.sendStage();
        }
    }


}