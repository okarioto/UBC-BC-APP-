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
 * @requires Direction and column are sanitized 
 * @param {string} direction - ASC or DESC.
 * @param {string} column - Column to sort by.
 * @returns {Array} Array of user objects
 */
async function getUsers(direction, column) {
    const query = `SELECT * FROM users ORDER BY ${column} ${direction}`
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
    event_location = event_location ? "'" + event_location + "'" : "event_location";

    const query = `SELECT eid, TO_CHAR(event_date, 'yyyy-mm-dd') as event_date, event_time, event_location FROM events WHERE event_date = ${event_date} AND event_time = ${event_time} AND event_location = UPPER(${event_location}) `;
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
 * @requires All imputs are sanitized
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






export { getUsers, getEvents, getSignUps, insertUser, insertEvent, insertSignUp };