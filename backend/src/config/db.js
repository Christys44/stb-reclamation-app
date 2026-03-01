//const { Pool } = require('pg');
//require('dotenv').config();

//const pool = new Pool({
  //host: process.env.DB_HOST,
  //port: process.env.DB_PORT,
  //database: process.env.DB_NAME,
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
//});

//pool.connect()
  //.then(() => console.log('✅ Connecté à PostgreSQL'))
  //.catch((err) => console.error('❌ Erreur de connexion PostgreSQL :', err));

//module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('✅ Connecté à PostgreSQL'))
  .catch((err) => console.error('❌ Erreur de connexion PostgreSQL :', err));

module.exports = pool;