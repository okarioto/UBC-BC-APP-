DROP TABLE users CASCADE;
DROP TABLE events CASCADE;
DROP TABLE sign_ups CASCADE;

CREATE TABLE users (
uid	serial PRIMARY KEY,
email varchar(225) UNIQUE,
fname varchar(255) NOT NULL,
lname varchar(255) NOT NULL,
user_level INT,
user_password varchar(255) NOT NULL,
noshow_count INT DEFAULT 0,
isadmin BOOLEAN DEFAULT false NOT NULL,
isverified BOOLEAN DEFAULT false NOT NULL
user_notes TEXT 
);

CREATE TABLE events (
eid	serial PRIMARY KEY,
event_name varchar(255) DEFAULT 'DROP-IN',
event_location varchar(255) NOT NULL,
event_date date,
event_time time
);

CREATE TABLE sign_ups(
    uid INT,
    eid INT,
    iswaitlist BOOLEAN DEFAULT FALSE,
    insert_order serial,
    PRIMARY KEY (uid, eid),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE
);

ALTER TABLE users
ADD user_notes TEXT;

CREATE OR REPLACE FUNCTION enforce_max_sign_ups()
RETURNS TRIGGER AS $$
DECLARE
    max_sign_ups INT := 50; 
    current_count INT;       
BEGIN
    SELECT COUNT(*) INTO current_count
    FROM sign_ups
    WHERE eid = NEW.eid;

    IF current_count >= max_sign_ups THEN
        NEW.iswaitlist = TRUE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_max_sign_ups
BEFORE INSERT ON sign_ups
FOR EACH ROW
EXECUTE FUNCTION enforce_max_sign_ups();



CREATE OR REPLACE FUNCTION add_from_waitlist()
RETURNS TRIGGER AS $$
DECLARE
    max_sign_ups INT := 50; 
    current_count INT;  
    waitlisted_uid INT;   
    isOldOnWaitlist BOOLEAN;  
BEGIN
    SELECT COUNT(*) INTO current_count
    FROM sign_ups
    WHERE eid = OLD.eid AND iswaitlist=FALSE;

    SELECT iswaitlist INTO isOldOnWaitlist
    FROM sign_ups
    WHERE uid = OLD.uid AND eid=OLD.eid;

    IF current_count <= max_sign_ups AND isOldOnWaitlist=FALSE THEN
        SELECT uid INTO waitlisted_uid
        FROM sign_ups
        WHERE eid = OLD.eid AND iswaitlist = TRUE
        ORDER BY insert_order
        LIMIT 1;

        IF waitlisted_uid IS NOT NULL  THEN
            UPDATE sign_ups
            SET iswaitlist = FALSE
            WHERE uid = waitlisted_uid AND eid = OLD.eid;
        END IF;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_if_space_available
BEFORE DELETE ON sign_ups
FOR EACH ROW
EXECUTE FUNCTION add_from_waitlist();




--PASSWORD IS SAME AS FNAME
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('RIOTO@EMAIL.COM', 'RIOTO', 'OKA', 1, '$argon2id$v=19$m=65536,t=3,p=4$b8GbVXfG+/Zjvg1EaSzrtQ$ux69PKmoQ6W1lxvpqAF3PhTpD3xwG48Zj8bHd6sxbdw', 0, true, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('DOM@EMAIL.COM', 'DOM', 'HUANG', 3, '$argon2id$v=19$m=65536,t=3,p=4$b0XKD0UPMZxJ0lzdktdr7g$IEjKvqIL7FCY3voQjFawBH+1aYkNtKNLIBcGEURknXE', 0, true, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('KATHY@EMAIL.COM', 'KATHY', 'NGUYEN', 1, '$argon2id$v=19$m=65536,t=3,p=4$nSiX3FGn2xMUq8c31Bbj0Q$K3yPuToZARsNDpiFVILjySVF/bKBQmBt4JuGyoVAFEM', 0, false, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('TY@EMAIL.COM', 'TY', 'SEMBA', 3, '$argon2id$v=19$m=65536,t=3,p=4$MhWwk6RbDs/zlku/4xKSgA$A2DR+612wV9FrKYPHHDLbY2ma7Bx8qWYxeBnGK7BWNk', 0, false, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('KEVIN@EMAIL.COM', 'KEVIN', 'TANG', 2, '$argon2id$v=19$m=65536,t=3,p=4$K349pyr7t1FHPGCS0GjLcg$fmfSEN/xjWNojNPT3v+asmLNl4L4SGxX4qPWbP+s4qU', 0, false, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('ANGUS@EMAIL.COM', 'ANGUS', 'LEUNG', 2, '$argon2id$v=19$m=65536,t=3,p=4$7Ss9Cf5CuigjRveAzx/vmg$7mJffXRfp16ji7+PAFL0nJmuv7wg4k3HnBlBrcfGl8I', 0, false, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('KELVIN@EMAIL.COM', 'KELVIN', 'LOW', 2, '$argon2id$v=19$m=65536,t=3,p=4$557yvAllYHulVFE4n/idyw$e0vJLVP/6zU4f66dxK8C52sS0pirG4QnBTChB99BpG0', 0, false, true, "");
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('AUSTIN@EMAIL.COM', 'AUSTIN', 'KOBAYASHI', 1, '$argon2id$v=19$m=65536,t=3,p=4$84GuPhY+7gCAM8iLdYN2uQ$wSMdFD5lWO4MKq0+gyhf06ToxqO3SDZZdxkjXofxgA0', 0, false, true);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin, isVerified)
VALUES ('10thuser@EMAIL.COM', 'number10', 'number10', 1, '10', 0, false, true);

INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-01', 'WAR MEMORIAL', '17:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-01', 'WAR MEMORIAL', '19:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'HARRY OSBORNE', '17:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-03', 'HARRY OSBORNE', '19:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-13', 'SRC', '18:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-13', 'SRC', '16:00:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-15', 'SRC', '20:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-17', 'HARRY OSBORNE', '17:30:00');
INSERT INTO events (event_date, event_location, event_time)
VALUES ('2025-01-17', 'WAR MEMORIAL', '17:30:00');

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



--FOR TESTING 50 MAX

INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('10EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('11@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('12@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('13@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('14@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('15@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('16@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('17@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('18@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('19@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('20@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('21@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('22@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('23@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('24@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('25@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('26@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('27@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('28@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('29@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('30@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('31@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('32@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('33@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('34@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('35@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('36@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('37@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('38@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('39@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('40@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('41@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('42@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('43@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('44@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('45@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('46@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('47@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('48@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('49@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('50@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('51@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('52@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('53@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('54@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('55@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('56@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('57@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('58@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('59@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('60@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('61@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);
INSERT INTO users (email, fname, lname, user_level, user_password, noshow_count, isAdmin)
VALUES ('62@EMAIL.COM', 'Test', 'User', 1, 'user1', 0, false);






INSERT INTO sign_ups (uid, eid)
VALUES (10,9);
INSERT INTO sign_ups (uid, eid)
VALUES (11,9);
INSERT INTO sign_ups (uid, eid)
VALUES (12,9);
INSERT INTO sign_ups (uid, eid)
VALUES (13,9);
INSERT INTO sign_ups (uid, eid)
VALUES (14,9);
INSERT INTO sign_ups (uid, eid)
VALUES (15,9);
INSERT INTO sign_ups (uid, eid)
VALUES (16,9);
INSERT INTO sign_ups (uid, eid)
VALUES (17,9);
INSERT INTO sign_ups (uid, eid)
VALUES (18,9);
INSERT INTO sign_ups (uid, eid)
VALUES (19,9);
INSERT INTO sign_ups (uid, eid)
VALUES (20,9);
INSERT INTO sign_ups (uid, eid)
VALUES (21,9);
INSERT INTO sign_ups (uid, eid)
VALUES (22,9);
INSERT INTO sign_ups (uid, eid)
VALUES (23,9);
INSERT INTO sign_ups (uid, eid)
VALUES (24,9);
INSERT INTO sign_ups (uid, eid)
VALUES (25,9);
INSERT INTO sign_ups (uid, eid)
VALUES (26,9);
INSERT INTO sign_ups (uid, eid)
VALUES (27,9);
INSERT INTO sign_ups (uid, eid)
VALUES (28,9);
INSERT INTO sign_ups (uid, eid)
VALUES (29,9);
INSERT INTO sign_ups (uid, eid)
VALUES (30,9);
INSERT INTO sign_ups (uid, eid)
VALUES (31,9);
INSERT INTO sign_ups (uid, eid)
VALUES (32,9);
INSERT INTO sign_ups (uid, eid)
VALUES (33,9);
INSERT INTO sign_ups (uid, eid)
VALUES (34,9);
INSERT INTO sign_ups (uid, eid)
VALUES (35,9);
INSERT INTO sign_ups (uid, eid)
VALUES (36,9);
INSERT INTO sign_ups (uid, eid)
VALUES (37,9);
INSERT INTO sign_ups (uid, eid)
VALUES (38,9);
INSERT INTO sign_ups (uid, eid)
VALUES (39,9);
INSERT INTO sign_ups (uid, eid)
VALUES (40,9);
INSERT INTO sign_ups (uid, eid)
VALUES (41,9);
INSERT INTO sign_ups (uid, eid)
VALUES (42,9);
INSERT INTO sign_ups (uid, eid)
VALUES (43,9);
INSERT INTO sign_ups (uid, eid)
VALUES (44,9);
INSERT INTO sign_ups (uid, eid)
VALUES (45,9);
INSERT INTO sign_ups (uid, eid)
VALUES (46,9);
INSERT INTO sign_ups (uid, eid)
VALUES (47,9);
INSERT INTO sign_ups (uid, eid)
VALUES (48,9);
INSERT INTO sign_ups (uid, eid)
VALUES (49,9);
INSERT INTO sign_ups (uid, eid)
VALUES (50,9);
INSERT INTO sign_ups (uid, eid)
VALUES (51,9);
INSERT INTO sign_ups (uid, eid)
VALUES (52,9);
INSERT INTO sign_ups (uid, eid)
VALUES (53,9);
INSERT INTO sign_ups (uid, eid)
VALUES (54,9);
INSERT INTO sign_ups (uid, eid)
VALUES (55,9);
INSERT INTO sign_ups (uid, eid)
VALUES (56,9);
INSERT INTO sign_ups (uid, eid)
VALUES (57,9);
INSERT INTO sign_ups (uid, eid)
VALUES (58,9);
INSERT INTO sign_ups (uid, eid)
VALUES (59,9);





