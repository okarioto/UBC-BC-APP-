import pg from "pg";
import env from "dotenv";

env.config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
/**
 * Gets users
 * @requires Direction, column, and all inputs are sanitized 
 * @requires use '' or 0 for arguements as wildcard when needed
 * @param {string} direction - ASC or DESC.
 * @param {string} column - Column to sort by.
 * @param {int} uid - uid to get by
 * @param {string} email - email to get by
 * @param {string} fname - first name to get by
 * @param {string} lname - last name to get by
 * @param {int} user_level - user level to get by
 * @param {string} user_password - user password to get by
 * @param {int} noshow_count - no show count to get by 
 * @param {string} isAdmin - admin privellege to get by
 * @returns {Array} Array of user objects
 */
async function getUsers(direction, column, uid, email, fname, lname, user_level, user_password, noshow_count, isadmin) {
    uid ||= 'uid';
    email = email.toUpperCase();
    email = email ? "'" + email + "'" : "email";
    fname = fname.toUpperCase();
    fname = fname ? "'" + fname + "'" : "fname";
    lname = lname.toUpperCase();
    lname = lname ? "'" + lname + "'" : "lname";
    user_level ||= 'user_level';
    user_password = user_password.toUpperCase();
    user_password = user_password ? "'" + user_password + "'" : "user_password";
    noshow_count ||= 'noshow_count';
    isadmin ||= "isadmin";

    const query = `SELECT * FROM users WHERE uid = ${uid} AND email = ${email} AND fname = ${fname} AND lname = ${lname} AND user_level = ${user_level} AND user_password = ${user_password} AND noshow_count = ${noshow_count} AND isadmin = ${isadmin} ORDER BY ${column} ${direction}`
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Gets events
 * @requires All imputs are sanitized
 * @requires Use '' for arguments as wildcard when needed
 * @param {string} event_date - 'YYYY-MM-DD'.
 * @param {string} event_time - 'HH:MM:SS'.
 * @param {string} event_location
 * @returns {Array} Array of event objects with specific event_date, event_time, event_location if specified
 */
async function getEvents(event_date, event_time, event_location) {
    event_date = event_date ? "'" + event_date + "'" : "event_date";
    event_time = event_time ? "'" + event_time + "'" : "event_time";
    event_location = event_location.toUpperCase();
    event_location = event_location ? "'" + event_location + "'" : "event_location";

    const query = `SELECT eid, TO_CHAR(event_date, 'yyyy-mm-dd') as event_date, event_time, event_location FROM events WHERE event_date = ${event_date} AND event_time = ${event_time} AND event_location = ${event_location}`;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}


/**
 * Gets sign ups
 * @requires All imputs are sanitized
 * @requires Use 0 for arguments as wildcard when needed
 * @param {int} uid - user ID.
 * @param {int} eid - event ID.
 * @returns {Array} Array of signup objects for certain uid or eid (if specified)
 */
async function getSignUps(uid, eid) {
    uid ||= 'uid';
    eid ||= 'eid';
    const query = `SELECT * FROM sign_ups WHERE uid = ${uid} AND eid = ${eid}`
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Insert User
 * @requires All inputs are sanitized
 * @param {string} fname - first name.
 * @param {string} lname - last name .
 * @param {int} level - user level .
 * @param {string} password - user password .
 * @returns {JSON} The new user object
 */
async function insertUser(fname, lname, level, password) {
    const query = `INSERT INTO users (fname, lname, user_level, user_password) VALUES (UPPER('${fname}'), UPPER('${lname}'), ${level}, '${password}') RETURNING *`
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }

}

/**
 * Insert Event
 * @requires All imputs are sanitized
 * @param {string} event_location - event location .
 * @param {string} event_date - event date 'YYYY-MM-DD'.
 * @param {string} event_time - event time 'HH:MM:SS' .
 * @returns {JSON} The new event object
 */
async function insertEvent(event_date, event_time, event_location) {
    const query = `INSERT INTO events (event_location, event_time, event_date) VALUES (UPPER('${event_location}'), '${event_time}', '${event_date}') RETURNING eid, TO_CHAR(event_date, 'yyyy-mm-dd') as event_date, event_time, event_location`
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Insert Sign-Up
 * @requires All imputs are sanitized
 * @param {int} uid - user id.
 * @param {int} eid - event id.
 * @returns {JSON} The new sign-up object
 */
async function insertSignUp(uid, eid) {
    const query = `INSERT INTO sign_ups (uid, eid) VALUES (${uid}, ${eid}) RETURNING *`
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Delete user
 * @requires All imputs are sanitized
 * @param {int} uid - user id.
 * @returns {boolean} Result of deletion (true or false)
 */
async function deleteUser(uid) {
    const query = `DELETE FROM users WHERE uid = ${uid}`;

    try {
        const result = await pool.query(query);
        return (result.rowCount === 1)
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Delete Event
 * @requires All imputs are sanitized
 * @param {int} eid - event id.
 * @returns {boolean} Result of deletion (true or false)
 */
async function deleteEvent(eid) {
    const query = `DELETE FROM events WHERE eid = ${eid}`;

    try {
        const result = await pool.query(query);
        return (result.rowCount === 1)
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Delete sign up
 * @requires All imputs are sanitized
 * @param {int} uid - user id.
 * @param {int} eid - event id.
 * @returns {boolean} Result of deletion (true or false)
 */
async function deleteSignUp(uid, eid) {
    const query = `DELETE FROM sign_ups WHERE uid = ${uid} AND eid = ${eid}`;

    try {
        const result = await pool.query(query);
        return (result.rowCount === 1)
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Update user
 * @requires All inputs are sanitized
 * @requires use '' for arguements as wildcard when needed
 * @param {int} uid - uid to update by
 * @param {string} email - email to update to
 * @param {string} fname - first name to update to 
 * @param {string} lname - last name to update to
 * @param {int} user_level - user level to update to 
 * @param {string} user_password - user password to update to
 * @param {int} noshow_count - no show count to update to 
 */
async function updateUsers(uid, email, fname, lname, user_level, user_password, noshow_count) {
    uid ||= 'uid';
    email = email ? "'" + email + "'" : "email";
    fname = fname ? "'" + fname + "'" : "fname";
    lname = lname ? "'" + lname + "'" : "lname";
    user_level ||= 'user_level';
    user_password = user_password ? "'" + user_password + "'" : "user_password";
    if (noshow_count === -1) {
        noshow_count = 'noshow_count';
    } else {
        noshow_count = noshow_count;
    }

    const query = `UPDATE users SET email = UPPER(${email}), fname = UPPER(${fname}), lname = UPPER(${lname}), user_level = ${user_level}, user_password = ${user_password}, noshow_count = ${noshow_count} WHERE uid = ${uid} RETURNING *`;
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Update event
 * @requires All inputs are sanitized 
 * @requires use '' for arguements as wildcard when needed
 * @param {int} eid - event id of event to update
 * @param {string} event_location - event location .
 * @param {string} event_date - event date 'YYYY-MM-DD'.
 * @param {string} event_time - event time 'HH:MM:SS' .
 * @returns {JSON} The new event object
 */
async function updateEvent(eid, event_date, event_time, event_location) {
    console.log(event_location);
    event_date = event_date ? "'" + event_date + "'" : "event_date";
    event_time = event_time ? "'" + event_time + "'" : "event_time";
    event_location = event_location ? "'" + event_location + "'" : "event_location";
    console.log(event_location);

    const query = `UPDATE events SET event_date = ${event_date}, event_time = ${event_time}, event_location = UPPER(${event_location}) WHERE eid = ${eid} RETURNING eid, TO_CHAR(event_date, 'yyyy-mm-dd') as event_date, event_time, event_location`;
    console.log(query);
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}




export { getUsers, getEvents, getSignUps, insertUser, insertEvent, insertSignUp, deleteUser, deleteEvent, deleteSignUp, updateUsers, updateEvent };