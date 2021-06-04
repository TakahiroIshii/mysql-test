---- drop ----
DROP TABLE IF EXISTS `user`;

---- create ----
create table IF not exists `user`
(
 `id`               VARCHAR(255),
 `firstName`        VARCHAR(20) NOT NULL,
 `lastName`         VARCHAR(20) NOT NULL,
 `age`              INT(20) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
