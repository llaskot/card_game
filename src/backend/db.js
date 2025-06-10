// export mysql = require('mysql2/promise');
// const config = require('./config.json');
import mysql from 'mysql2/promise';
import config from './config.json' with { type: 'json' };

export const pool = mysql.createPool(config);

// module.exports = pool;



// USE
// const pool1 = require('./db');
//
//
// pool1.query('SELECT * FROM users')
//     .then(([rows]) => {
//         console.log(rows); // выводит данные
//         return pool.end();
//     })
//     .catch(err => {
//         console.error('Ошибка:', err);
//     });