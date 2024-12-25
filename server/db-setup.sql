CREATE TABLE users (
id	serial PRIMARY KEY,
fname varchar(255) NOT NULL,
lname varchar(255) NOT NULL,
level INT,
password varchar(255) NOT NULL
);

CREATE TABLE events (
id	serial PRIMARY KEY,
location varchar(255) NOT NULL,
datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE attends(
    uid INT,
    eid INT,
    PRIMARY KEY (uid, eid),
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (eid) REFERENCES events(id) ON DELETE CASCADE
);