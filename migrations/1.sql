DROP DATABASE IF EXISTS lum;
CREATE DATABASE lum;
USE lum;

CREATE TABLE users (
    userid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL UNIQUE,
    password BINARY(60) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now() ON UPDATE now(),
    PRIMARY KEY (userid)
);

CREATE TABLE posts (
    postid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    userid INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (postid),
    FOREIGN KEY (userid) REFERENCES users (userid)
);

CREATE TABLE comments (
    commentid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    postid INT UNSIGNED NOT NULL,
    userid INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now() ON UPDATE now(),
    PRIMARY KEY (commentid),
    FOREIGN KEY (postid) REFERENCES posts (postid),
    FOREIGN KEY (userid) REFERENCES users (userid)
);

CREATE TABLE votes (
    voteid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    type ENUM("favorite", "up", "down"),
    postid INT UNSIGNED NOT NULL,
    userid INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (voteid),
    CONSTRAINT post_user UNQIUE (postid, userid),
    FOREIGN KEY (postid) REFERENCES posts (postid),
    FOREIGN KEY (userid) REFERENCES users (userid)
);

CREATE TABLE tags (
    tagid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (tagid)
);

CREATE TABLE post_tags (
    ptid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    postid INT UNSIGNED NOT NULL,
    tagid INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT post_tag UNIQUE (postid, tagid),
    PRIMARY KEY (ptid)
);
