CREATE TABLE user (
    id int NOT NULL PRIMARY KEY,
    user VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    photo TEXT NOT NULL
);

CREATE TABLE album(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) 
);

CREATE TABLE photoalbum(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    photo TEXT,
    album_id INT NOT NULL,
    FOREIGN KEY (album_id) REFERENCES album(id)
);
CREATE TABLE photoprofile(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    photo TEXT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);