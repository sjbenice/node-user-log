"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// db.ts
const pg_1 = require("pg");
// Create a new pool instance with your database connection information
const pool = new pg_1.Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'users',
    port: 5432,
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait before timing out when connecting a new client
});
exports.default = pool;
