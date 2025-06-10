// const Model = require('../model');
// const pool = require("../db");

import {Model} from "../model.js";
import {pool} from "../db.js";


export class User extends Model {
    static table = 'users';
    static fields = ['id', 'login', 'password', 'name', 'email', 'games_qty', 'victories_qty', 'avatar'];

    constructor(attrs = {}) {
        super();
        for (const field of User.fields) {
            this[field] = null;
        }
        Object.assign(this, attrs);
    }

    async restore(value) {
        const [rows] = await pool.query(
            `SELECT id, login, password, email
             FROM ${this.constructor.table}
             WHERE login = ?
                OR email = ?`,
            [value, value]
        );
        if (rows.length === 0) return null;
        Object.assign(this, rows[0]);
        return this;
    }

    static async restore(value) {
        const [rows] = await pool.query(
            `SELECT ${this.fields.join(', ')}
             FROM ${this.table}
             WHERE login = ?
                OR email = ?`,
            [value, value]
        );
        if (rows.length === 0) return null;
        return new this(rows[0]);
    }

    static async changePassword(id, old, new_pas) {
        const [rows] = await pool.query(
            `UPDATE ${this.table}
             SET password = ?
             WHERE id = ? AND password = ?`,
            [new_pas, id, old]
        );
        if (rows.affectedRows === 0)
        return {
            success: false
        };
        return {
            success: true,
        };
    }


}

// module.exports = User;


/**
 * TESTS EXAMPLES
 */

// (async () => {
// let hero2 = await new User({
//     name: 'TestHero3',
//     login: 3,
//     password: 'healer',
//     email: 'From test script',
// })
// await hero2.save()
// console.log(hero2);     //name: 'TestHero3'
//     let id = await hero2.id;
//
//     let hero = await User.find(1);
//     console.log(hero);     //name: 'TestHero3'
//
//     hero = await new Hero();
//     await console.log(hero);   //all NULL
//     hero.name = 'TestHero4';
//     hero.description = 'From test script';
//     hero.class_role = 'tankman';
//     await hero.save();
//     id  = await hero.id;
//     console.log(hero);   //'TestHero4'
//
//
//     hero = await new Hero();
//     await hero.find(id);
//     hero.name = 'Vasya Pupkin';
//     await hero.save()
//     await hero.find(id);
//     await console.log(hero);  //  name: 'Vasya Pupkin',
//
//     await hero.delete();
//     await console.log("NULL EXPECTED");
//     hero = await hero.find(id);
//     await console.log(hero);       //NULL
//
//
//     await pool.end();
// })();