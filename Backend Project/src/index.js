// require('dotenv').config({path: './.env'});

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import connectDB from './db/index.js';


connectDB()

/*

// arrow function for db connection
// this semicoln is for 
;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on('error',(error)=>{
              console.error('Error connecting to the database',error);
              throw error;
       })
       app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
       })
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
})()

*/