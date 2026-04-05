// PostgreSQL connection
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "pc_assets",
    password: "0000",
    port: 5432
});

// Export database connection
module.exports = pool;