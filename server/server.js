import express from "express";
import { getUsers, getEvents, getSignUps, insertUser, insertEvent, insertSignUp, deleteUser, deleteEvent, deleteSignUp, updateUsers, updateEvent } from "./db.js"
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cors from 'cors';
import env from "dotenv";



const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

env.config();
const app = express();
const port = 3000;
const secretKey = process.env.JWT_KEY

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));


app.get("/", (req, res) => {
    res.send('Server is running!');;
});

function isValidName(name) {
    const nameRegex = /^[\p{L}]+([\p{L} '-]*[\p{L}]+)?$/u; // Regex for names
    return nameRegex.test(name.trim()) && name.length <= 100 && name.length >= 2;
}

//Create API endpoints for funtions

/**
 * Gets users.
 * Provide direction and column in query of request
 * Default value is uid and ASC 
 * Provide any of user attributes in query of request if wanting to get a specific group. 
 * @returns Array of users
 */
app.get("/users", async (req, res) => {
    var { direction = 'ASC', column = 'uid', uid = '0', email = '', fname = '', lname = '', user_level = '0', user_password = '', noshow_count = '-1', isAdmin = '' } = req.query;
    direction ||= 'ASC';
    column ||= 'uid';
    uid ||= '0';
    uid = parseInt(uid);
    email ||= '';
    fname ||= '';
    lname ||= '';
    user_level ||= '0';
    user_level = parseInt(user_level);
    user_password ||= '';
    noshow_count ||= '-1';
    noshow_count = parseInt(noshow_count);
    isAdmin ||= '';


    const validColumns = ['uid', 'fname', 'lname', 'user_level', 'noshow_count', 'isAdmin'];
    const validDirections = ['ASC', 'DESC'];
    if (Number.isNaN(uid)) return res.status(400).send('Invalid User ID');
    if (email != '' && !email.includes('@')) return res.status(400).send('Invalid email');
    if (fname != '' && !isValidName(fname)) return res.status(400).send('Invalid first name');
    if (lname != '' && !isValidName(lname)) return res.status(400).send('Invalid last name');
    if (Number.isNaN(user_level)) return res.status(400).send('Invalid user_level');
    if (user_password != '' && user_password.includes(';')) return res.status(400).send('Invalid user_password');
    if (Number.isNaN(noshow_count)) return res.status(400).send('Invalid no show count');
    if (isAdmin !== 'false' && isAdmin !== 'true' && isAdmin !== '') return res.status(400).send('Invalid isAdmin');

    if (!validColumns.includes(column) || !validDirections.includes(direction)) {
        return res.status(400).send('Invalid Column or Direction');
    }
    try {
        const result = await getUsers(direction, column, uid, email, fname, lname, user_level, user_password, noshow_count, isAdmin);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
 * Gets events.
 * Provide eid, event_date, event_time, event_location, event_name in query of request as 
 * 'YYYY-MM-DD' and 'HH:MM:SS' and 'location' and 'name' as needed
 * @returns Array of events
 */
app.get("/events", async (req, res) => {
    var { eid = '0', event_date = '', event_time = '', event_location = '', event_name = '' } = req.query;
    eid ||= '0';
    eid = parseInt(eid);

    if (Number.isNaN(eid)) return res.status(400).send('Invalid Event ID');
    if (event_date !== '' && (event_date.includes(';') || !event_date.includes('-') || event_date.length !== 10)) return res.status(400).send('Invalid Date');
    if (event_time !== '' && (event_time.includes(';') || !event_time.includes(':') || event_time.length !== 8)) return res.status(400).send('Invalid Time');
    if (event_location !== '' && (event_location.includes(';') || event_location.length > 255)) return res.status(400).send('Invalid location');
    if (event_name !== '' && (event_location.includes(';') || event_name.length > 255)) return res.status(400).send('Invalid event name');


    try {
        const result = await getEvents(eid, event_date, event_time, event_location, event_name);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

/**
 * Gets sign-ups.
 * Provide eid and uid in query of request as needed
 * @returns Array of sign-ups 
 */
app.get("/sign-ups", async (req, res) => {
    var { uid = '0', eid = '0' } = req.query;
    eid ||= '0';
    uid ||= '0';
    eid = parseInt(eid);
    uid = parseInt(uid);

    if (Number.isNaN(eid)) return res.status(400).send('Invalid Event ID');
    if (Number.isNaN(uid)) return res.status(400).send('Invalid User ID');

    try {
        const result = await getSignUps(uid, eid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }


})


/**
 * Inserts new user.
 * Provide fname, lname, user_level, and password of user in request body as
 * {email: '', fname: '', lname: '', user_level: '', user_password: ''}
 * Encrypts password using argon2id
 * @returns JSON object of new user
 */
app.post("/register", async (req, res) => {
    var { email = '', fname = '', lname = '', user_level = '', user_password = '' } = req.body;
    user_level = parseInt(user_level);
    if (!email || !email.includes('@')) return res.status(400).send('Invalid email');
    if (!fname || fname.includes(';') || fname.length > 255) return res.status(400).send('Invalid fname');
    if (!lname || lname.includes(';') || lname.length > 255) return res.status(400).send('Invalid lname');
    if (Number.isNaN(user_level) || user_level < 1 || user_level > 3) return res.status(400).send('Invalid level');
    if (user_password.includes(';') || user_password.length > 255 || !user_password) return res.status(400).send('Invalid password');

    try {
        var hashed_password = await argon2.hash(user_password);
    } catch (error) {
        res.status(500).send(error)
    }


    try {
        const result = await insertUser(email, fname, lname, user_level, hashed_password);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

/**
 * Inserts event.
 * Provide location, date, time of event in request body as
 * {event_location: '', event_date: '', event_time: '', event_name: ''}
 * Defualt event name is DROP-IN
 * @returns JSON object of new event
 */
app.post("/events", async (req, res) => {
    var { event_location, event_date, event_time, event_name = 'DROP-IN' } = req.body;
    event_name ||= 'DROP-IN';


    if (!event_date || event_date.includes(';') || !event_date.includes('-') || event_date.length !== 10) return res.status(400).send('Invalid Date');
    if (!event_time || event_time.includes(';') || !event_time.includes(':') || event_time.length !== 8) return res.status(400).send('Invalid Time');
    if (!event_location || event_location.includes(';') || event_location.length > 255) return res.status(400).send('Invalid location');
    if (!event_name || event_name.includes(';') || event_name.length > 255) return res.status(400).send('Invalid event name');


    try {
        const result = await insertEvent(event_date, event_time, event_location, event_name);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


/**
 * Inserts sign up.
 * Provide uid of user and eid of event in request body as
 * {uid: '', eid: ''}
 * @returns JSON object of new sign up with attendance being false
 */
app.post("/sign-ups", async (req, res) => {
    var { uid, eid } = req.body;
    uid = parseInt(uid);
    eid = parseInt(eid);

    if (Number.isNaN(uid)) return res.status(400).send('Invalid uid');
    if (Number.isNaN(eid)) return res.status(400).send('Invalid eid');

    try {
        const result = await insertSignUp(uid, eid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


/**
 * Deletes event.
 * Provide eid of event in request parameter
 * @returns {boolean} True if sucessful delete
 */
app.delete("/events/:eid", async (req, res) => {
    var { eid } = req.params;
    eid = parseInt(eid);

    if (eid === 0 || Number.isNaN(eid)) return res.status(400).send('Invalid event ID');

    try {
        const result = await deleteEvent(eid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

/**
 * Deletes user.
 * Provide uid of user in request parameter
 * @returns {boolean} True if sucessful delete
 */
app.delete("/users/:uid", async (req, res) => {
    var { uid } = req.params;
    uid = parseInt(uid);

    if (uid === 0 || Number.isNaN(uid)) return res.status(400).send('Invalid user ID');

    try {
        const result = await deleteUser(uid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

/**
 * Deletes sign up.
 * Provide uid of user and eid of event in query of request
 * @returns {boolean} True if sucessful delete
 */
app.delete("/sign-ups", async (req, res) => {
    var { uid, eid } = req.query;
    uid = parseInt(uid);
    eid = parseInt(eid);

    if (uid === 0 || Number.isNaN(uid)) return res.status(400).send('Invalid user ID');
    if (eid === 0 || Number.isNaN(eid)) return res.status(400).send('Invalid event ID');

    try {
        const result = await deleteSignUp(uid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

/**
 * Updates users
 * Provide uid of user to update, and at least one value to be updated in query of request
 * If no uid is provided, all users will be updated
 * @requires values to be of the correct type
 * @returns JSON object of updated user
 */
app.patch("/users", async (req, res) => {
    var { uid = '0', email = '', fname = '', lname = '', user_level = '0', user_password = '', noshow_count = '-1' } = req.query;
    uid ||= '0';
    uid = parseInt(uid);
    email ||= '';
    fname ||= '';
    lname ||= '';
    user_level ||= '0';
    user_level = parseInt(user_level);
    user_password ||= '';
    noshow_count ||= '-1';
    noshow_count = parseInt(noshow_count);

    if (Number.isNaN(uid)) return res.status(400).send('Invalid User ID');
    if (email != '' && (!email.includes('@') && email != 'email')) return res.status(400).send('Invalid email');
    if (fname != '' && !isValidName(fname)) return res.status(400).send('Invalid first name');
    if (lname != '' && !isValidName(lname)) return res.status(400).send('Invalid last name');
    if (Number.isNaN(user_level) || user_level > 3 || user_level < 0) return res.status(400).send('Invalid user_level');
    if (user_password != '' && user_password.includes(';'));
    if (Number.isNaN(noshow_count)) return res.status(400).send('Invalid no show count');

    try {
        const result = await updateUsers(uid, email, fname, lname, user_level, user_password, noshow_count);
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

/**
 * Updates events
 * Provide eid of event to update, and at least one value to be updated in query of request
 * as 'YYYY-MM-DD' and 'HH:MM:SS' and 'location' and 'name'
 * If no eid is provided, all events will be updated
 * @returns JSON object of updated event
 */
app.patch("/events", async (req, res) => {
    var { eid = '0', event_date = '', event_time = '', event_location = '', event_name = '' } = req.query;
    eid ||= '0';
    eid = parseInt(eid);
    event_date ||= '';
    event_location ||= '';
    event_time ||= '';
    event_name ||= '';
    if (Number.isNaN(eid)) return res.status(400).send('Invalid Event ID');
    if (event_date !== '' && (event_date.includes(';') || !event_date.includes('-') || event_date.length !== 10)) return res.status(400).send('Invalid Date');
    if (event_time !== '' && (event_time.includes(';') || !event_time.includes(':') || event_time.length !== 8)) return res.status(400).send('Invalid Time');
    if (event_location !== '' && (event_location.includes(';') || event_location.length > 255)) return res.status(400).send('Invalid location');
    if (event_name !== '' && (event_name.includes(';') || event_name.length > 255)) return res.status(400).send('Invalid event name');

    try {
        const result = await updateEvent(eid, event_date, event_time, event_location, event_name);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


/**
 * Authenticates users
 * Provide email and password of user is request body 
 * as {email: , user_password: }
 * @returns JWT with payload {uid: ,email: , isAdmin: }
 */
app.post("/login", async (req, res) => {
    const { email, user_password } = req.body;
    if (email === '' || !email.includes('@')) return res.status(400).send('Invalid email');
    if (user_password === '' || user_password.includes(';')) return res.status(400).send('Invalid user_password');

    try {
        var result = await getUsers("ASC", "uid", 0, email, "", "", 0, "", 0, "");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    if (result.length === 0) return res.status(400).send('user not found');
    const stored_pass = result[0].user_password;

    try {
        if (await argon2.verify(stored_pass, user_password)) {
            // password match
            const payload = {
                uid: result[0].uid,
                email: result[0].email,
                isAdmin: result[0].isadmin,
            };

            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
            res.send({ token });
        } else {
            // password did not match
            return res.status(401).send("wrong password");
        }
    } catch (err) {
        // internal failure
        console.log(err);
        return res.status(500).send(err);
    }



})





app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
