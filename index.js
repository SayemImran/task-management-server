require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// create pool of connections to the database
const pool = new Pool({
    connectionString:process.env.DB_URL,
    ssl:{
        rejectUnauthorized:false,
    },
})


//lets test database connection here
pool.connect((err,client, release)=>{
    if(err){
        return console.error('Error acquiring client', err.stack);
    }
    console.log("Connected to neon PostgreSQL");
    release();
})



app.get('/', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM users');
        res.json({
            success:true,
            users: result.rows,
            count: result.rows.length,
        });
    } catch (err) {
        console.error('Error fetching users', err.stack);
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});