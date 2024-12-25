import express from "express";
import pool from "./db.js"

const app = express();
const port = 3000;


app.use(express.json());

app.get("/", (req, res) => {
    res.send('Server is running!');;
});

//Create API endpoints for funtions

//get users
app.get("/users", (req,res) =>{
    //DB SELECT  into users to get 
})

//get events
app.get("/events", (req,res) =>{
    //DB SELECT  into users to get 
})

//insert new event
app.post("/events", (req, res)=>{
// DB INSERT request into event table

});

//insert new user
app.post("/users", async (req,res)=>{
    // DB INSERT request into user table
});

//insert new attend
app.post("/attends", (req, res)=>{
    // DB INSERT request into attend table
})

//delete event
app.delete("/events", (req, res) => {
    // DB DELETE req into event table
});

//delete user
app.delete("/users", (req, res)=>{
    // DB DELETE request into user table

});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
