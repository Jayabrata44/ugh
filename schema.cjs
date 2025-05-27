const { Pool } = require("pg");
const { default: pool } = require("./db");

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Bangalore_tech_jobs (
        id SERIAL PRIMARY KEY,
        job_url TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) ,
        date_posted DATE,
        is_remote BOOLEAN ,
        description TEXT ,
        llm_response TEXT,
        experience VARCHAR(255)
    );
`;

pool
  .query(createTableQuery)
  .then((res) => {
    console.log("Bangalore_tech_jobs Table is successfully created");
    // pool.end();
  })
  .catch((err) => {
    console.error(err);
    // pool.end();
  });

const createTableQuery2 = `
    CREATE TABLE IF NOT EXISTS us.Tech_jobs (
        id SERIAL PRIMARY KEY,
        job_url TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) ,
        date_posted DATE,
        is_remote BOOLEAN ,
        description TEXT ,
        llm_response TEXT,
        experience VARCHAR(255)
    );
`;

pool
  .query(createTableQuery2)
  .then((res) => {
    console.log("Tech_jobs Table is successfully created");
    pool.end();
  })
  .catch((err) => {
    console.error(err);
    pool.end();
  });
