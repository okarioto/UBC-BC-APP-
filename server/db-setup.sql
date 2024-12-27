CREATE TABLE users (
uid	serial PRIMARY KEY,
fname varchar(255) NOT NULL,
lname varchar(255) NOT NULL,
user_level INT,
user_password varchar(255) NOT NULL,
noshow_count INT DEFAULT 0
);

CREATE TABLE events (
eid	serial PRIMARY KEY,
event_location varchar(255) NOT NULL,
event_date date,
event_time time
);

CREATE TABLE signed_up(
    uid INT,
    eid INT,
	attends bool DEFAULT false NOT NULL,
    PRIMARY KEY (uid, eid),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE
);
