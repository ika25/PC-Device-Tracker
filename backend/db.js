// PostgreSQL connection
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "pc_assets",
    password: "password",
    port: 5432
});

// Export database connection
module.exports = pool;