DROP TABLE users CASCADE;
DROP TABLE events CASCADE;
DROP TABLE sign_ups CASCADE;

CREATE TABLE users (
uid	serial PRIMARY KEY,
email varchar(225) UNIQUE,
fname varchar(255) NOT NULL,
lname varchar(255) NOT NULL,
user_level INT,
user_password varchar(255) NOT NULL UNIQUE,
noshow_count INT DEFAULT 0,
isadmin bool DEFAULT false
);

CREATE TABLE events (
eid	serial PRIMARY KEY,
event_location varchar(255) NOT NULL,
event_date date,
event_time time
);

CREATE TABLE sign_ups(
    uid INT,
    eid INT,
    PRIMARY KEY (uid, eid),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE
);


INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('RIOTO@EMAIL.COM', 'RIOTO', 'OKA', 1, 'RIOTOPASS', 0, true);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('DOM@EMAIL.COM', 'DOM', 'HUANG', 4, 'DOMPASS', 0, true);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('KATHY@EMAIL.COM', 'KATHY', 'NGUYEN', 1, 'KATHYPASS', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('TY@EMAIL.COM', 'TY', 'SEMBA', 4, 'TYPASS', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('KEVIN@EMAIL.COM', 'KEVIN', 'TANG', 2, 'KEVINPASS', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('ANGUS@EMAIL.COM', 'ANGUS', 'LEUNG', 2, 'ANGUSPASS', 0, false);


INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-01', 'WAR MEMORIAL', '17:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-01', 'WAR MEMORIAL', '19:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'HARRY OSBORNE', '17:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'HARRY OSBORNE', '19:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'SRC', '18:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'SRC', '16:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-05', 'SRC', '20:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-05', 'HARRY OSBORNE', '17:30:00');


INSERT INTO sign_ups (uid, eid)
VALUES (1,1);
INSERT INTO sign_ups (uid, eid)
VALUES (1,2);
INSERT INTO sign_ups (uid, eid)
VALUES (1,3);
INSERT INTO sign_ups (uid, eid)
VALUES (1,4);
INSERT INTO sign_ups (uid, eid)
VALUES (1,5);
INSERT INTO sign_ups (uid, eid)
VALUES (1,6);
INSERT INTO sign_ups (uid, eid)
VALUES (1,7);
INSERT INTO sign_ups (uid, eid)
VALUES (1,8);
INSERT INTO sign_ups (uid, eid)
VALUES (2,1);
INSERT INTO sign_ups (uid, eid)
VALUES (3,1);
INSERT INTO sign_ups (uid, eid)
VALUES (4,1);
INSERT INTO sign_ups (uid, eid)
VALUES (5,1);
INSERT INTO sign_ups (uid, eid)
VALUES (6,1);
INSERT INTO sign_ups (uid, eid)
VALUES (3,3);
INSERT INTO sign_ups (uid, eid)
VALUES (2,6);
INSERT INTO sign_ups (uid, eid)
VALUES (2,4);
INSERT INTO sign_ups (uid, eid)
VALUES (3,5);
INSERT INTO sign_ups (uid, eid)
VALUES (3,2);
INSERT INTO sign_ups (uid, eid)
VALUES (4,4);
INSERT INTO sign_ups (uid, eid)
VALUES (4,2);
INSERT INTO sign_ups (uid, eid)
VALUES (5,5);
