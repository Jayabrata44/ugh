import fs from "fs";
import csv from "csv-parser";
import pool from "./db.js";

// export const uploadCSVToDatabase = async (filePath) => {
//     try {
//         const results = [];

//         // Read CSV file
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (data) => {
//                 // Collect each row in an array
//                 results.push(data);
//             })
//             .on('end', async () => {
//                 console.log(`CSV file ${filePath} successfully read.`);

//                 // Prepare insertion queries
//                 const query =
//                     `INSERT INTO Bangalore_tech_jobs (job_url, title, company, location, date_posted, is_remote, description, llm_response, experience)
//                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//                      ON CONFLICT DO NOTHING`;

// for (const row of results) {
//     // Validate and sanitize the date_posted value
//     let datePosted = row.date_posted;
//     if (!datePosted || isNaN(Date.parse(datePosted))) {
//         datePosted = null; // Set to NULL if invalid or empty
//     }
//     const values = [
//         row.job_url,
//         row.title,
//         row.company,
//         row.location,
//         datePosted,
//         row.is_remote.toLowerCase() === 'true', // Convert 'true'/'false' strings to boolean
//         row.description,
//                         row.llm_response || null, // Handle empty fields
//                         row.experience || null,
//                     ];

//                     try {
//                         await pool.query(query, values);
//                         console.log(`Row inserted: ${row.title}`);
//                     } catch (err) {
//                         console.error(`Failed to insert row: ${row.title}`, err.message);
//                     }
//                 }

//                 console.log('All data has been uploaded to the database.');
//                 // pool.end(); // Close the pool connection
//             });
//     } catch (error) {
//         console.error('Error uploading CSV to database:', error.message);
//     }
// };

// // Call the function
// const csvFilePath = './result.csv'; // Path to your CSV file
// uploadCSVToDatabase(csvFilePath);
export const getFilteredJobs = async (req, res) => {
  try {
    const { data } = req;
    console.log(req.data);
    // Send the result as a JSON response
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(`Error fetching jobs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs from the database.",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    // Query only the required fields from the jobs table
    const query = `SELECT id, title, company, location, experience, date_posted FROM Bangalore_tech_jobs`;
    const result = await pool.query(query);

    // Send the result as a JSON response
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(`Error fetching jobs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs from the database.",
    });
  }
};

export const getJobById = async (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters

  try {
    // Query the database for the specific job
    const query = `SELECT * FROM Bangalore_tech_jobs WHERE id = $1`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${id} not found`,
      });
    }

    // Send the job data as a response
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(`Error fetching job with ID ${id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job from the database.",
    });
  }
};

export const getJobsWithFilters = async (req, res) => {
  try {
    // Extract filters from the request body or query parameters
    const { experience, jobType, jobModel, location, jobTitle } = req.body;

    // Base query
    let query = `SELECT id, title, company, location, experience, date_posted FROM Bangalore_tech_jobs WHERE 1=1`;

    // Array to hold query parameters
    const queryParams = [];

    // Dynamically add filters to the query
    if (experience) {
      query += ` AND experience = $${queryParams.length + 1}`;
      queryParams.push(experience);
    }

    if (jobType) {
      query += ` AND job_type = $${queryParams.length + 1}`;
      queryParams.push(jobType);
    }

    if (jobModel) {
      query += ` AND job_model = $${queryParams.length + 1}`;
      queryParams.push(jobModel);
    }

    if (location) {
      query += ` AND location = $${queryParams.length + 1}`;
      queryParams.push(location);
    }

    if (jobTitle) {
      query += ` AND title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${jobTitle}%`);
    }

    if (salary) {
      query += ` AND salary_range = $${queryParams.length + 1}`;
      queryParams.push(salary);
    }

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Send the result as a JSON response
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(`Error fetching filtered jobs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs with filters from the database.",
    });
  }
};

// export const getZeroExperienceJobs = async (req, res) => {
//     try {
//         const { exp } = req.params;
//         // Query the database for jobs with "0 year" experiece
//         const query = `SELECT * FROM Bangalore_tech_jobs WHERE experience = $1`;
//         const result = await pool.query(query, ['exp']);
//         console.log(exp);
//         console.log(typeof exp);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No jobs found with {exp} year experience',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: result.rows,
//         });
//     } catch (error) {
//         console.error(`Error fetching 0 year experience jobs: ${error.message}`);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch jobs from the database.',
//         });
//     }
// };

// export const getOneExperienceJobs = async (req, res) => {
//     try {
//         // Query the database for jobs with "0 year" experience
//         const query = `SELECT * FROM Bangalore_tech_jobs WHERE experience = $1`;
//         const result = await pool.query(query, ['1.0']);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No jobs found with 1 year experience',
//             });
//         }

//         // Send the filtered jobs as a response
//         res.status(200).json({
//             success: true,
//             data: result.rows,
//         });
//     } catch (error) {
//         console.error(`Error fetching 1 year experience jobs: ${error.message}`);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch jobs from the database.',
//         });
//     }
// };
export const getFilterTest = async (req, res) => {
  try {
    // Query the database for the specific job

    // Send the job data as a response
    res.status(200).json({
      success: true,
      data: req,
    });
  } catch (error) {
    console.error(`Error fetching job with ID ${id}: ${error.message}`);
  }
};
