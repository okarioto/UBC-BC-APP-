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

    const query = `SELECT eid, TO_CHAR(event_date, 'yyyy-mm-dd') as event_date, event_time, event_location FROM events WHERE event_date = ${event_date} AND event_time = ${event_time} AND event_location = ${event_location} `;
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




export { getUsers, getEvents, getSignUps };