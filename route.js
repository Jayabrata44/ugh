import express from "express";
import {
  getAllJobs,
  getJobById,
  getJobsWithFilters,
  getFilterTest,
  getFilteredJobs,
} from "./controller.js";

const router = express.Router();

// router.get('/', getData);
// router.post('/', postData);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
// router.get('/jobs/:exp', getZeroExperienceJobs);
router.post("/filter", getJobsWithFilters);
router.post("/testFilter", getFilterTest);
router.post("/getFilteredJobs", getFilteredJobs);

// router.get('/jobs/:exp', getOneExperienceJobs);

// router.get('/upload', uploadCSVToDatabase);

// router.delete('/:id', deleteData);
// router.put('/:id', updateData)
// router.get('/all', deleteAll)

export default router;
