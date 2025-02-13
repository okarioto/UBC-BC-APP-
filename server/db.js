import pg from "pg";
import env from "dotenv";
import { query } from "express";

env.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
/**
 * Get users
 * @requires Direction, column, and all inputs are sanitized
 * @requires use 0 for wildcard for uid and user_level
 * @requires use '' for wildcard for string arguements
 * @requires use -1 for arguement as wildcard for no_show
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
async function getUsers(
  direction,
  column,
  uid,
  email,
  fname,
  lname,
  user_level,
  user_password,
  noshow_count,
  isadmin,
  isverified
) {
  uid ||= "uid";
  email = email ? "'" + email + "'" : "email";
  fname = fname ? "'" + fname + "'" : "fname";
  lname = lname ? "'" + lname + "'" : "lname";
  user_level ||= "user_level";
  user_password = user_password ? "'" + user_password + "'" : "user_password";
  noshow_count === -1 && (noshow_count = "noshow_count");
  isadmin ||= "isadmin";
  isverified ||= "isverified";

  const query = `SELECT * FROM users WHERE uid = ${uid} AND email = UPPER(${email}) AND fname = UPPER(${fname}) AND lname = UPPER(${lname}) AND user_level = ${user_level} AND user_password = ${user_password} AND noshow_count = ${noshow_count} AND isadmin = ${isadmin} AND isverified = ${isverified} ORDER BY ${column} ${direction}`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get events
 * @requires All imputs are sanitized
 * @requires Use '' for arguments as wildcard when needed
 * @param {int} eid
 * @param {string} event_date - 'YYYY-MM-DD'.
 * @param {string} event_time - 'HH:MM:SS'.
 * @param {string} event_location
 * @param {string} event_name
 * @returns {Array} Array of event objects (with count of signups) with specific event_date, event_time, event_location, event_name if specified
 */
async function getEvents(
  eid,
  event_date,
  event_time,
  event_location,
  event_name
) {
  eid ||= "e.eid";
  event_date = event_date ? "'" + event_date + "'" : "event_date";
  event_time = event_time ? "'" + event_time + "'" : "event_time";
  event_location = event_location
    ? "'" + event_location + "'"
    : "event_location";
  event_name = event_name ? "'" + event_name + "'" : "event_name";

  const query = `
    SELECT e.eid, COUNT(s.uid), event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location 
    FROM events e LEFT JOIN sign_ups s ON e.eid = s.eid 
    WHERE e.eid = ${eid} AND event_date = ${event_date} AND event_time = ${event_time} AND event_location = UPPER(${event_location}) AND event_name = UPPER(${event_name}) 
    GROUP BY e.eid`;
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
 * @returns {Array} Array of signup objects (with user names) for certain uid or eid (if specified)
 */
async function getSignUps(uid, eid) {
  uid ||= "s.uid";
  eid ||= "s.eid";
  const query = `
    SELECT s.uid, s.eid, u.fname, u.lname 
    FROM sign_ups s JOIN users u ON s.uid = u.uid 
    WHERE s.uid = ${uid} AND s.eid = ${eid} AND s.iswaitlist=FALSE`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

/* !!! add get waitlist */

/**
 * Gets waitlist
 * @requires All imputs are sanitized
 * @requires Use 0 for arguments as wildcard when needed
 * @param {int} eid - event ID.
 * @returns {Array} Array of signup objects (with user names) for certain eid (if specified)
 */
async function getWatilist(eid) {
  eid ||= "s.eid";
  const query = `
    SELECT s.uid, s.eid, u.fname, u.lname 
    FROM sign_ups s JOIN users u ON s.uid = u.uid 
    WHERE s.eid = ${eid} AND s.iswaitlist=TRUE
    ORDER BY s.insert_order`;
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
 * @param {string} email - email.
 * @param {string} fname - first name.
 * @param {string} lname - last name .
 * @param {int} user_level - user level .
 * @param {string} user_password - user password .
 *
 * @returns {JSON} The new user object
 */
async function insertUser(email, fname, lname, user_level, user_password) {
  const query = `INSERT INTO users (email, fname, lname, user_level, user_password) VALUES (UPPER('${email}'), UPPER('${fname}'), UPPER('${lname}'), ${user_level}, '${user_password}') RETURNING *`;
  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    throw new Error("In DB:", {
      cause: { code: error.code, detail: error.detail },
    });
  }
}

/**
 * Insert Event
 * @requires All imputs are sanitized
 * @param {string} event_name - event name .
 * @param {string} event_location - event location .
 * @param {string} event_date - event date 'YYYY-MM-DD'.
 * @param {string} event_time - event time 'HH:MM:SS' .
 * @returns {JSON} The new event object
 */
async function insertEvent(event_date, event_time, event_location, event_name) {
  const query = `INSERT INTO events (event_location, event_time, event_date, event_name) VALUES (UPPER('${event_location}'), '${event_time}', '${event_date}', UPPER('${event_name}')) RETURNING eid, event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location`;
  console.log(query);
  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Inserts default Events
 * @returns {JSON} The new event object
 */
async function insertDefaultEvent() {
  function getUpcomingDate(targetDay) {
    const today = new Date();
    const currentDay = today.getDay();
    const daysToAdd = (targetDay - currentDay + 7) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const nextWednesday = getUpcomingDate(3);
  const nextFriday = getUpcomingDate(5);

  const defaultWedFormData ={
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextWednesday,
    time: "16:30:00",
  };

  const defaultFriOneFormData = {
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextFriday,
    time: "18:30:00",
  };

  const defaultFriTwoFormData = {
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextFriday,
    time: "20:45:00",
  };

  const query = `
  INSERT INTO events (event_location, event_time, event_date, event_name) 
  VALUES (UPPER('${defaultWedFormData.location}'), '${defaultWedFormData.time}', '${defaultWedFormData.date}', UPPER('${defaultWedFormData.name}')),
  VALUES (UPPER('${defaultFriOneFormData.location}'), '${defaultFriOneFormData.time}', '${defaultFriOneFormData.date}', UPPER('${defaultFriOneFormData.name}')),
  VALUES (UPPER('${defaultFriTwoFormData.location}'), '${defaultFriTwoFormData.time}', '${defaultFriTwoFormData.date}', UPPER('${defaultFriTwoFormData.name}')) 
  
  RETURNING eid, event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location`;

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
  const query = `INSERT INTO sign_ups (uid, eid) VALUES (${uid}, ${eid}) RETURNING *`;
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
    return result.rowCount === 1;
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
    return result.rowCount === 1;
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
    return result.rowCount === 1;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Update user
 * @requires All inputs are sanitized
 * @requires use 0 for uid to change all users
 * @requires use 0 for user_level as no change to user_level
 * @requires use '' for arguements as no change to string arguments
 * @requires use -1 for arguement as no change for no_show
 * @param {int} uid - uid to update by
 * @param {string} email - email to update to
 * @param {string} fname - first name to update to
 * @param {string} lname - last name to update to
 * @param {int} user_level - user level to update to
 * @param {string} user_password - user password to update to
 * @param {int} noshow_count - no show count to update to
 * @param {boolean} isadmin - is the user an admin
 * @param {boolean} isverified is the user verified
 */
async function updateUsers(
  uid,
  email,
  fname,
  lname,
  user_level,
  user_password,
  noshow_count,
  isadmin,
  isverified,
  user_notes
) {
  uid ||= "uid";
  email = email ? "'" + email + "'" : "email";
  fname = fname ? "'" + fname + "'" : "fname";
  lname = lname ? "'" + lname + "'" : "lname";
  user_level ||= "user_level";
  user_password = user_password ? "'" + user_password + "'" : "user_password";
  user_notes = user_notes ? "'" + user_notes + "'" : "user_notes";
  if (noshow_count === -1) {
    noshow_count = "noshow_count";
  } else {
    noshow_count = noshow_count;
  }
  isadmin ||= "isadmin";
  isverified ||= "isverified";

  const query = `UPDATE users SET email = UPPER(${email}), fname = UPPER(${fname}), lname = UPPER(${lname}), user_level = ${user_level}, user_password = ${user_password}, noshow_count = ${noshow_count}, isadmin = ${isadmin}, isverified = ${isverified}, user_notes = ${user_notes} WHERE uid = ${uid} RETURNING *`;
  console.log(query);
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
 * @requires use 0 for eid to change all events
 * @requires use '' for arguements as no change to string arguments
 * @param {int} eid - event id of event to update
 * @param {string} event_location - event location .
 * @param {string} event_name - event name .
 * @param {string} event_date - event date 'YYYY-MM-DD'.
 * @param {string} event_time - event time 'HH:MM:SS' .
 * @returns {JSON} The new event object
 */
async function updateEvent(
  eid,
  event_date,
  event_time,
  event_location,
  event_name
) {
  eid = eid ? "'" + eid + "'" : "eid";
  event_date = event_date ? "'" + event_date + "'" : "event_date";
  event_time = event_time ? "'" + event_time + "'" : "event_time";
  event_location = event_location
    ? "'" + event_location + "'"
    : "event_location";
  event_name = event_name ? "'" + event_name + "'" : "event_name";

  const query = `UPDATE events SET event_date = ${event_date}, event_time = ${event_time}, event_location = UPPER(${event_location}), event_name = UPPER(${event_name}) WHERE eid = ${eid} RETURNING eid, event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @requires All inputs are sanitized
 * @requires uid to be a real uid 
 * @param {Array} uid - uid of user to update 
 * @returns {JSON} the updated user
 */
async function updateAttendance(uid) {
    const query = `Update users SET noshow_count = noshow_count + 1 WHERE uid = ${uid}`

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Get sign-ups of specific event
 * @requires All inputs are sanitized
 * @requires eid to be a real integer >= 1
 * @param {int} eid - event id to get number of sign-ups for
 * @returns {8 byte signed int} number of sign-ups for specified event
 */
async function getEventSignUps(eid) {
  const query = `SELECT COUNT(uid) FROM sign_ups WHERE eid = ${eid}`;
  try {
    const result = await pool.query(query);
    return result.rows[0].count;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get users singed up to a specific event
 * @requires All inputs are sanitized
 * @requires eid to be a real integer >= 1
 * @param {int} eid - event id to get users signed up for
 * @returns {Array} Array of JSON objects where each entry is a user signed up to the specified event
 */
async function getSignedUpUsers(eid) {
  const query = `SELECT users.* FROM sign_ups INNER JOIN users ON sign_ups.uid = users.uid WHERE sign_ups.eid = ${eid} AND sign_ups.iswaitlist = 'false'`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get upcoming and past events based on given date and time
 * @requires All inputs are sanitized
 * @param {string} event_date - date to get upcoming and past events by
 * @returns {Array} array of two JSON arrays, first entry is upcoming events,
 * second entry is past events
 */
async function getUpcomingPastEvents(event_date, event_time) {
  event_date = event_date ? "'" + event_date + "'" : "event_date";
  event_time = event_time ? "'" + event_time + "'" : "event_date";

  const query1 = `
    SELECT e.eid, COUNT(s.uid), event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location 
    FROM events e LEFT JOIN sign_ups s ON e.eid = s.eid
    WHERE event_date >= ${event_date} OR (event_date = ${event_date} AND event_time >= ${event_time})
    GROUP BY e.eid
    ORDER BY e.eid ASC`;
  const query2 = `SELECT e.eid, COUNT(s.uid), event_name, TO_CHAR(event_date, 'FMMonth DD, YYYY') AS event_date, TO_CHAR(event_time, 'HH:MI AM') as event_time, event_location 
    FROM events e LEFT JOIN sign_ups s ON e.eid = s.eid
    WHERE event_date < ${event_date} OR (event_date = ${event_date} AND event_time < ${event_time})
    GROUP BY e.eid
    ORDER BY e.eid ASC`;

  try {
    const result1 = await pool.query(query1);
    const result2 = await pool.query(query2);
    const result = [result1.rows, result2.rows];
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export {
  getUsers,
  getEvents,
  getSignUps,
  getWatilist,
  insertUser,
  insertEvent,
  insertSignUp,
  insertDefaultEvent,
  deleteUser,
  deleteEvent,
  deleteSignUp,
  updateUsers,
  updateEvent,
  getEventSignUps,
  getUpcomingPastEvents,
  getSignedUpUsers,
  updateAttendance
};
