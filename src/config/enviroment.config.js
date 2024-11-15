import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  FRONT_URL: process.env.FRONT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TIME: process.env.JWT_TIME,
  GMAIL_PASS: process.env.GMAIL_PASS,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  MYSQL: {
    USERNAME: process.env.MYSQL_USERNAME,
    PASSWORD: process.env.MYSQL_PASSWORD,
    HOST: process.env.MYSQL_HOST,
    DATABASE: process.env.MYSQL_DATABASE,
  },
};

export default ENV;
