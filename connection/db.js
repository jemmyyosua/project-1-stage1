// import package pg
const { Pool } = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'tugas-week-3',
    port: 5432,
    user: 'postgres',
    password: 'n1csalie'
})

// export dbPool
module.exports = dbPool