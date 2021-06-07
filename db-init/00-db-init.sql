SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `userId` MEDIUMINT NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `email` varchar(255),
  PRIMARY KEY (`id`),
  UNIQUE KEY (`userId`)
);
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `postId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `caption` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`postId`),
  CONSTRAINT `fk_posts_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
);
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `commentId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `postId` MEDIUMINT NOT NULL,
  `review` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`commentId`),
  CONSTRAINT `fk_comments_posts` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`)
);
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `likeId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `postId` MEDIUMINT NOT NULL,
  `like_post` BOOLEAN DEFAULT true,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`likeId`),
  CONSTRAINT `fk_likes_posts` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`)
);
DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `videoId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `postId` MEDIUMINT NOT NULL,
  `filename` varchar(255),
  `url` varchar(255),
  `contentType` varchar(255),
  PRIMARY KEY (`id`)
);
INSERT INTO users
VALUES (
    1,
    1,
    "sfitzroy0",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    2,
    2,
    "wwalsom1",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    3,
    3,
    "flepine2",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "tbiggen2@bloglines.com"
  ),
  (
    4,
    4,
    "graxworthy3",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    5,
    5,
    "rscoines4",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "meet@outlook.com"
  ),
  (
    6,
    6,
    "agerrelts5",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    7,
    7,
    "cdebrett6",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "ggarthshore6@latimes.com"
  ),
  (
    8,
    8,
    "rtewkesbury7",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "bstokey7@list-manage.com"
  ),
  (
    9,
    9,
    "mtremathick8",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "jskynner8@economist.com"
  ),
  (
    10,
    10,
    "cwardingley9",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "ncorter9@pcworld.com"
  ),
  (
    11,
    11,
    "bruea",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    12,
    12,
    "skulicb",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "blampettb@sphinn.com"
  ),
  (
    13,
    13,
    "ddohertyc",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "emallockc@nasa.gov"
  ),
  (
    14,
    14,
    "nklimtd",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "ljurasekd@sakura.ne.jp"
  ),
  (
    15,
    15,
    "fhayhoee",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "heheha@gmial.com"
  ),
  (
    16,
    16,
    "lbartsf",
    "$2a$08$hSs9WABu6az107iJZ1aUMer2Uny1mLNymSjnZv5f/Su1/1Il2CKeC",
    "aslocomf@arstechnica.com"
  );
INSERT INTO posts
VALUES (
    1,
    1,
    1,
    "Cras non velit nec nisi vulputate nonummy."
  ),
  (
    2,
    2,
    2,
    "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  ),
  (3, 3, 3, "Nunc purus."),
  (
    4,
    4,
    4,
    "Suspendisse potenti. In eleifend quam a odio."
  ),
  (
    5,
    5,
    5,
    "Mauris ullamcorper purus sit amet nulla."
  ),
  (
    6,
    6,
    6,
    "Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl."
  ),
  (
    7,
    7,
    7,
    "Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo."
  ),
  (8, 8, 8, "Cras pellentesque volutpat dui."),
  (9, 9, 9, "Donec ut dolor."),
  (10, 10, 10, "Aliquam erat volutpat."),
  (
    11,
    11,
    11,
    "Etiam vel augue. Vestibulum rutrum rutrum neque."
  ),
  (12, 12, 12, "Proin risus."),
  (13, 13, 13, "Nunc purus."),
  (
    14,
    14,
    14,
    "Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede."
  ),
  (15, 15, 15, "Quisque porta volutpat erat."),
  (
    16,
    16,
    15,
    "Vivamus vel nulla eget eros elementum pellentesque."
  ),
  (
    17,
    17,
    1,
    "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet."
  ),
  (18, 18, 1, "Duis mattis egestas metus."),
  (
    19,
    19,
    2,
    "Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus."
  ),
  (20, 20, 2, "In hac habitasse platea dictumst."),
  (21, 21, 3, "Morbi non lectus."),
  (22, 22, 4, "Aenean sit amet justo."),
  (
    23,
    23,
    3,
    "Proin leo odio, porttitor id, consequat in, consequat ut, nulla."
  ),
  (24, 24, 4, "Maecenas rhoncus aliquam lacus."),
  (25, 25, 5, "Sed ante."),
  (26, 26, 6, "Praesent blandit. Nam nulla."),
  (
    27,
    27,
    7,
    "Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam."
  ),
  (
    28,
    28,
    8,
    "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante."
  ),
  (29, 29, 4, "Suspendisse potenti."),
  (30, 30, 3, "Maecenas pulvinar lobortis est.");
INSERT INTO comments
VALUES (
    1,
    1,
    7,
    17,
    "In est risus, auctor sed, tristique in, tempus sit amet, sem."
  ),
  (
    2,
    2,
    15,
    1,
    "Maecenas tincidunt lacus at velit."
  ),
  (
    3,
    3,
    3,
    19,
    "Maecenas ut massa quis augue luctus tincidunt."
  ),
  (
    4,
    4,
    10,
    20,
    "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo."
  ),
  (
    5,
    5,
    1,
    5,
    "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus."
  ),
  (
    6,
    6,
    6,
    6,
    "Curabitur at ipsum ac tellus semper interdum."
  ),
  (
    7,
    7,
    1,
    7,
    "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio."
  ),
  (
    8,
    8,
    8,
    21,
    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc."
  ),
  (9, 9, 9, 22, "Integer ac leo."),
  (10, 10, 10, 2, "Praesent lectus."),
  (11, 11, 11, 1, "Proin eu mi."),
  (12, 12, 4, 3, "Phasellus sit amet erat."),
  (13, 13, 9, 17, "Curabitur gravida nisi at nibh."),
  (
    14,
    14,
    12,
    29,
    "In hac habitasse platea dictumst."
  ),
  (
    15,
    15,
    11,
    15,
    "Maecenas pulvinar lobortis est."
  );
INSERT INTO likes
VALUES (1, 1, 15, 17, true),
  (2, 2, 2, 30, true),
  (3, 3, 9, 1, true),
  (4, 4, 5, 27, true),
  (5, 5, 1, 24, true),
  (6, 6, 12, 29, true),
  (7, 7, 9, 18, true),
  (8, 8, 13, 8, true),
  (9, 9, 1, 9, true),
  (10, 10, 2, 23, true);