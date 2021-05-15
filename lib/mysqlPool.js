const mysql = require('mysql2/promise');

const mysqlHost = process.env.MYSQL_HOST || 'localhost';
const mysqlPort = process.env.MYSQL_PORT || 3306;
const mysqlDb = process.env.MYSQL_DB || "instagram";
const mysqlUser = process.env.MYSQL_USER || "instagram";
const mysqlPassword = process.env.MYSQL_PASSWORD || "group8";


const mysqlPool = mysql.createPool({
  connectionLimit: 10,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDb,
  user: mysqlUser,
  password: mysqlPassword
});

module.exports = mysqlPool;

/*
docker run -d --name instagram-mysql-server \
> --network instagram-api \
> -v instagram-data \
> -p "3306:3306" \
> -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" \
> -e "MYSQL_DATABASE=instagram" \
> -e "MYSQL_USER=instagram" \
> -e "MYSQL_PASSWORD=group8" \
> mysql
*/

/*
docker run --rm -it \
> --network instagram-api \
> -v instagram-data \
> mysql \
> mysql -h instagram-mysql-server -u instagram -p
*/