import {pool} from "./db.js";

/**
 * BEFORE ALL RUN:
 *    npm install mysql2
 */


export class Model {
    constructor(objAttrs = {}) {
        for (const key of Object.keys(objAttrs)) {
            this[key] = objAttrs[key];
        }
    }

    static async signIn(login, password) {
        const [rows] = await pool.query(`SELECT ${this.fields.filter(f => f !== 'password').join(', ')}
                                         FROM ${this.table}
                                         WHERE login = CAST(? AS BINARY) AND password = CAST(? AS BINARY)`,
            [login, password]
        );
        if (rows.length === 0) {
            return null;
        }
        return new this(rows[0]);
    }


    async signIn(login, password) {
        const [rows] = await pool.query(`SELECT ${this.constructor.fields.filter(f => f !== 'password').join(', ')}
                                         FROM ${this.constructor.table}
                                         WHERE login = CAST(? AS BINARY) AND password = CAST(? AS BINARY)`,
            [login, password]
        );
        if (rows.length === 0) return null;
        Object.assign(this, rows[0]);
        return this;
    }




    async find(id) {
        const [rows] = await pool.query(`SELECT ${this.constructor.fields.filter(f => f !== 'password').join(', ')}
                                     FROM ${this.constructor.table}
                                     WHERE id = ?`, [id]);
        if (rows.length === 0) return null;
        Object.assign(this, rows[0]);
        return this;
    }


    static async find(id) {
        const [rows] = await pool.query(`SELECT ${this.fields.filter(f => f !== 'password').join(', ')}
                                         FROM ${this.table}
                                         WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return null;
        }
        return new this(rows[0]);
    }



    static async findAll() {
        const [rows] = await pool.query(`SELECT ${this.fields.filter(f => f !== 'password' && f !== 'login' && f !== 'email').join(', ')}
                                         FROM ${this.table}`
        );
        if (rows.length === 0) {
            return [];
        }
        return rows;
    }

    async save() {
        const table = this.constructor.table;
        const fields = this.constructor.fields;

        if (!this.id) {
            const dataFields = fields.filter(f => f !== 'id' && this[f]);
            const placeholders = dataFields.map(() => '?').join(', ');
            const values = dataFields.map(f => this[f]);
            const sql = `INSERT INTO ${table} (${dataFields.join(', ')})
                         VALUES (${placeholders})`;
            try {
                const [result] = await pool.query(sql, values);
                this.id = result.insertId;
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            let dataFields = fields.filter(f => this[f] !== undefined && f !== 'id');
            const values = dataFields.map(f => this[f]);
            dataFields = dataFields.map(f => `${f} = ?`);
            const sql = `UPDATE ${table}
                         SET ${dataFields.join(', ')}
                         WHERE id = ${this.id}`;
            try {
                const [result] = await pool.query(sql, values);
                if (result.affectedRows > 0) {
                    const [rows] = await pool.query(`SELECT *
                                                     FROM ${table}
                                                     WHERE id = ?`, [this.id]);
                    if (rows.length) {
                        Object.assign(this, rows[0]);
                    }
                }
            } catch (err) {
                console.error(err);
                throw err;
            }

        }
        return this;
    }

    static async delete(id) {
        try {
            const [rows] = await pool.query(`DELETE
                                             FROM ${this.table}
                                             WHERE id = ?`,
                [id]
            );
            if (rows.affectedRows === 0) {
                return null;
            }
        } catch (err) {
            console.error(err);
            return null;
        }

        return {
            success: true,
        };
    }

    async delete() {
        if (!this.id) return null;
        return this.constructor.delete(this.id);
    }


}

// module.exports = Model;



