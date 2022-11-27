const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
const dotenv = require("dotenv");
dotenv.config({ path:"./config.env" });
require("./Connection");
app.use(require("./Routing"));
require("./Model");

if( process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve( __dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(process.env.PORT || 5000,(req,res)=>{
    console.log(`app is running at ${process.env.PORT}`)
});