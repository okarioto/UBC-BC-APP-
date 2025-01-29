import express from "express";
import { getUsers, getEvents, getSignUps, insertUser, insertEvent, insertSignUp, deleteUser, deleteEvent, deleteSignUp, updateUsers, updateEvent, getEventSignUps, getUpcomingPastEvents, getWatilist } from "./db.js"
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cors from 'cors';
import env from "dotenv";
import nodemailer from "nodemailer";



const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

env.config();
const app = express();
const port = 3000;
const secretKey = process.env.JWT_KEY

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use((req, res, next) => {
res.setHeader("Access-Control-Allow-Origin", "*");
next();
});


app.get("/", (req, res) => {
    res.send('Server is running!');;
});

function isValidName(name) {
    const nameRegex = /^[\p{L}]+([\p{L} '-]*[\p{L}]+)?$/u; // Regex for names
    return nameRegex.test(name.trim()) && name.length <= 100 && name.length >= 2;
}

function containsBoolean(str) {
    const lowerStr = str.toLowerCase();
    return lowerStr === "true" || lowerStr === "false";
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
    var { direction = 'ASC', column = 'uid', uid = '0', email = '', fname = '', lname = '', user_level = '0', user_password = '', noshow_count = '-1', isadmin = '', isverified = '' } = req.query;
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
    isadmin ||= '';
    isverified ||= '';


    const validColumns = ['uid', 'fname', 'lname', 'user_level', 'noshow_count', 'isadmin', 'isverified'];
    const validDirections = ['ASC', 'DESC'];
    if (Number.isNaN(uid)) return res.status(400).send('Invalid User ID');
    if (email != '' && !email.includes('@')) return res.status(400).send('Invalid email');
    if (fname != '' && !isValidName(fname)) return res.status(400).send('Invalid first name');
    if (lname != '' && !isValidName(lname)) return res.status(400).send('Invalid last name');
    if (Number.isNaN(user_level)) return res.status(400).send('Invalid user_level');
    if (user_password != '' && user_password.includes(';')) return res.status(400).send('Invalid user_password');
    if (Number.isNaN(noshow_count)) return res.status(400).send('Invalid no show count');
    if (isadmin !== '' && !containsBoolean(isadmin)) return res.status(400).send('Invalid isAdmin');
    if (isverified !== '' && !containsBoolean(isverified)) return res.status(400).send('Invalid isVerified');

    if (!validColumns.includes(column) || !validDirections.includes(direction)) {
        return res.status(400).send('Invalid Column or Direction');
    }
    try {
        const result = await getUsers(direction, column, uid, email, fname, lname, user_level, user_password, noshow_count, isadmin, isverified);
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
 * @returns Array of events (includes # of signups)
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
 * @returns Array of sign-ups (includes user names)
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
 * Gets the number of sign-ups for a specific event
 * Provide eid in query, where eid >= 1
 * @returns 8-byte signed int of the number of sign-ups for the specified event
 */
app.get("/sign-ups/count", async (req, res) => {
    var {eid} = req.query;
    eid ||= '0';
    eid = parseInt(eid);

    if (Number.isNaN(eid)) return res.status(400).send('Invalid Event ID');
    if (eid <= 0) return res.status(400).send('Event ID needs to be greater than or equal to 1');

    try {
        const result = await getEventSignUps(eid);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


/**
 * Gets waitlist.
 * Provide eid in query of request as needed
 * @returns Array of sign-ups (includes user names) in order of first to last
 */
app.get("/waitlist", async (req, res) => {
    var { eid = '0' } = req.query;
    eid ||= '0';

    eid = parseInt(eid);


    if (Number.isNaN(eid)) return res.status(400).send('Invalid Event ID');

    try {
        const result = await getWatilist(eid);
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
    if (!fname || fname.includes(';') || fname.length > 255) return res.status(400).send('Invalid first name');
    if (!lname || lname.includes(';') || lname.length > 255) return res.status(400).send('Invalid last name');
    if (Number.isNaN(user_level) || user_level < 1 || user_level > 3) return res.status(400).send('Invalid level');
    if (user_password.includes(';') || user_password.length > 255 || !user_password) return res.status(400).send('Invalid password');

    try {
        var hashed_password = await argon2.hash(user_password);
    } catch (error) {
        res.status(500).send(error);
    }


    try {
        const result = await insertUser(email, fname, lname, user_level, hashed_password);
        res.send(result);
    } catch (error) {
        if(error.cause.code === "23505"){
            res.status(404).send("User already exists");
        }else{
            res.status(500).send("Something went wrong");
        }
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
 * @returns JSON object of new sign up
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
    var { uid="0", eid="0" } = req.query;
    uid = parseInt(uid);
    eid = parseInt(eid);

    if (uid === 0 || Number.isNaN(uid)) return res.status(400).send('Invalid user ID');
    if (eid === 0 || Number.isNaN(eid)) return res.status(400).send('Invalid event ID');

    try {
        const result = await deleteSignUp(uid, eid);
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
    var { uid = '0', email = '', fname = '', lname = '', user_level = '0', user_password = '', noshow_count = '-1', isadmin = '', isverified = '' } = req.body;
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
    isadmin ||= '';
    isverified ||= '';


    if (Number.isNaN(uid)) return res.status(400).send('Invalid User ID');
    if (email != '' && (!email.includes('@') && email != 'email')) return res.status(400).send('Invalid email');
    if (fname != '' && !isValidName(fname)) return res.status(400).send('Invalid first name');
    if (lname != '' && !isValidName(lname)) return res.status(400).send('Invalid last name');
    if (Number.isNaN(user_level) || user_level > 3 || user_level < 0) return res.status(400).send('Invalid user_level');
    if (user_password != '' && user_password.includes(';')) return res.status(400).send('Invalid password');
    if (Number.isNaN(noshow_count)) return res.status(400).send('Invalid no show count');
    if (isadmin != '' && !containsBoolean(isadmin)) return res.status(400).send('Invalid isAdmin');
    if (isverified !== '' && !containsBoolean(isverified)) return res.status(400).send('Invalid isVerified');

    if (user_password != '') {
        try {
            var hashed_password = await argon2.hash(user_password);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    try {
        const result = await updateUsers(uid, email, fname, lname, user_level, hashed_password, noshow_count, isadmin, isverified);
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
    var { eid = '0', event_date = '', event_time = '', event_location = '', event_name = '' } = req.body;
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
 * @returns JWT with payload {uid: ,email: , isAdmin:, isVerified: }
 */
app.post("/login", async (req, res) => {
    const { email, user_password } = req.body;
    if (email === '' || !email.includes('@')) return res.status(400).send('Invalid email');
    if (user_password === '' || user_password.includes(';')) return res.status(400).send('Invalid password');

    try {
        var result = await getUsers("ASC", "uid", 0, email, "", "", 0, "", 0, "");
    } catch (error) {
        console.log("from get");
        console.log(error);
        return res.status(500).send(error);
    }
    if (result.length === 0) return res.status(404).send('User not found');
    const stored_pass = result[0].user_password;

    try {
        if (await argon2.verify(stored_pass, user_password)) {
            // password match
            const payload = {
                uid: result[0].uid,
                fname: result[0].fname,
                lname: result[0].lname,
                email: result[0].email,
                isAdmin: result[0].isadmin,
                isVerified: result[0].isverified,
            };

            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
            res.send({ token });
        } else {
            // password did not match
            return res.status(401).send("Wrong Password");
        }
    } catch (err) {
        // internal failure
        console.log("from argon");
        console.log(err);
        return res.status(500).send(err);
    }
})

/**
 * Gets the upcoming and past events associated with a given date and time.
 * Events on the given date and given time are treated as upcoming
 * Provide the date as 'yyyy-mm-dd', time as 'hh:mm:ss'. 
 * @requires values to be of the correct type and not null
 * @returns an array of two JSON arrays, first entry is upcoming events,
 * second entry is past events
 */
app.get("/events/upcoming-and-past", async (req, res) => {
    var { event_date = '', event_time = '' } = req.query;

    if (event_date !== '' && (event_date.includes(';') || !event_date.includes('-') || event_date.length !== 10)) return res.status(400).send('Invalid Date');
    if (event_time !== '' && (event_time.includes(';') || !event_time.includes(':') || event_time.length !== 8)) return res.status(400).send('Invalid Time');

    try {
        const result = await getUpcomingPastEvents(event_date, event_time);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

function sendRecoveryEmail({ recipient_email, OTP }) {
    return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
        user: "83d6f8001@smtp-brevo.com",
        pass: "djGE978p12UQHgfD",
        },
    });
    const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: "UBCBC PASSWORD RECOVERY",
        html: `<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #A9A9A9;text-decoration:none;font-weight:600">UBCBC</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Use the following one time code to complete your Password Recovery Procedure. The code is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />UBC Badminton Club</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>UBC Badminton Club</p>
        <p>The University of British Columbia</p>
        <p>Vancouver, BC, Canada </p>
    </div>
    </div>
</div>
<!-- partial -->
    
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
        });
    });
}

app.post("/send_recovery_email", (req, res) => {
    sendRecoveryEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});


function sendVerificationEmail({ recipient_email, OTP }) {
    return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
        user: "83d6f8001@smtp-brevo.com",
        pass: "djGE978p12UQHgfD",
        },
    });
    const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: "UBCBC EMAIL VERIFICATION",
        html: `<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #A9A9A9;text-decoration:none;font-weight:600">UBCBC</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Use the following one time code to complete your Email Verification Procedure. The code is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />UBC Badminton Club</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>UBC Badminton Club</p>
        <p>The University of British Columbia</p>
        <p>Vancouver, BC, Canada </p>
    </div>
    </div>
</div>
<!-- partial -->
    
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
        });
    });
}

app.post("/send_verification_email", (req, res) => {
    sendVerificationEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
