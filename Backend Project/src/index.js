

import connectDB from './db/index.js';
import {app} from './app.js'
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`sever started at port:${process.env.PORT || 8000}`);
    }) 
    app.on('error',(error)=>{
              console.error('Error connecting to the database',error);
              throw error;
    })
    app.get('/', (req, res) => {
        res.send('Hello World!');
    })
})
.catch((err)=>{
    console.error('Database connection failed:', err)})

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