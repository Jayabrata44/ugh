import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../db.js";
import bodyParser from "body-parser";
import router from "../route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Check neon db connection
async function getPgVersion() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT version()");
      console.log(result.rows[0]);
      console.log("Database connected");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Initialize database connection
getPgVersion();

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to the AI Job Portal API");
});
// For local development
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }

// Export for Vercel
export default app;
