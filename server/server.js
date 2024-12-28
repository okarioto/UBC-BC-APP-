import express from "express";
import { getUsers, getEvents, getSignUps } from "./db.js"

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.send('Server is running!');;
});

//Create API endpoints for funtions

/**
 * Gets users.
 * Provide direction and column in query of request
 * Default value is uid and ASC 
 * @returns Array of users
 */
app.get("/users", async (req, res) => {
    var { direction = 'ASC', column = 'uid' } = req.query;
    direction ||= 'ASC';
    column ||= 'uid';

    const validColumns = ['uid', 'fname', 'lname', 'user_level', 'noshow_count'];
    const validDirections = ['ASC', 'DESC'];

    if (!validColumns.includes(column) || !validDirections.includes(direction)) {
        res.status(400).send('Invalid Column or Direction');
    }

    try {
        const result = await getUsers(direction, column);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
 * Gets events.
 * Provide date, time, location in query of request as 
 * 'YYYY-MM-DD' and 'HH:MM:SS' and 'address' if needed
 * @returns Array of events
 */
app.get("/events", async (req, res) => {
    var { date = '', time = '', location = '' } = req.query;

    if (date !== '' && (date.includes(';') || !date.includes('-') || date.length !== 10)) res.status(400).send('Invalid Date');
    if (time !== '' && (time.includes(';') || !time.includes(':') || time.length !== 8)) res.status(400).send('Invalid Time');
    if (location !== '' && (address.includes(';') || address.length > 255)) res.status(400).send('Invalid Address');


    try {
        const result = await getEvents(date, time, location);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

/**
 * Gets sign-ups.
 * Provide eid and uid in query of request as int if needed
 * @returns Array of sign-ups 
 */
app.get("/sign-ups", async (req, res) => {
    var { uid = '0', eid = '0' } = req.query;
    eid ||= '0';
    uid ||= '0';
    eid = parseInt(eid);
    uid = parseInt(uid);

    if (Number.isNaN(eid)) res.status(400).send('Invalid Event ID');
    if (Number.isNaN(uid)) res.status(400).send('Invalid User ID');

    try {
        const result = await getSignUps(uid, eid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }


})

//insert new event
app.post("/events", (req, res) => {
    // DB INSERT request into event table

});

//insert new user
app.post("/users", async (req, res) => {
    // DB INSERT request into user table
});

//insert new sign up
app.post("/sign-ups", (req, res) => {
    // DB INSERT request into attend table
})

//delete event
app.delete("/events", (req, res) => {
    // DB DELETE req into event table
});

//delete user
app.delete("/users", (req, res) => {
    // DB DELETE request into user table

});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
