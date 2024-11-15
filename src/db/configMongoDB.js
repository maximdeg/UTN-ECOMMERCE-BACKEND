import mongoose from "mongoose";
import ENV from "../config/enviroment.config.js";

mongoose
  .connect(ENV.DB_URL)
  .then(() => {
    console.log("Connected to the MongoDB database 🦾");
  })
  .catch(() => {
    console.error("ERROR connecting to database");
  });

export default mongoose;
