// require('dotenv').config()

import dotenv from "dotenv"
import connectDB from "./database/index.js";

dotenv.config(
    {
        path: "./env"
    }
)

connectDB();












/*
import express from "express"
const app = express()
const port = process.env.PORT || 8000

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        // handle error
        app.on("error", (error) => {
            console.log(`app can't connect to Database :: ${error}`);
            throw error
        })

        // listen
        app.listen(port, () => {
            console.log(`app listening on port ${port}`);
        })
    } catch (error) {
        console.error(`Database connection error :: ${error}`);
        throw error;
    }
})()

*/
