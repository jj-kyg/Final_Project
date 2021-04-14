// build and export unconnected client

const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/final_project-dev',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});


module.exports = client;