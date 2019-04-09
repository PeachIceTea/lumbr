CREATE TABLE user (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL UNIQUE,
    password BINARY(60) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now() ON UPDATE now(),
    PRIMARY KEY (id)
);

CREATE TABLE post (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE post_vote (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    type ENUM("up", "down"),
    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT uc_post_user UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES post (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE comment (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now() ON UPDATE now(),
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE comment_vote (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    type ENUM("up", "down"),
    comment_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT uc_post_user UNIQUE (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES comment (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE favorite (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT uc_post_user UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES post (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE tag (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE post_tag (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    post_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT uc_post_tag UNIQUE (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES post (id),
    FOREIGN KEY (tag_id) REFERENCES tag (id),
    PRIMARY KEY (id)
);

CREATE TABLE category (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE tag_category (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tag_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT uc_tag_category UNIQUE (tag_id, category_id),
    FOREIGN KEY (tag_id) REFERENCES tag (id),
    FOREIGN KEY (category_id) REFERENCES category (id)
);
