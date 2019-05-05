import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Jobs";
import createApiMiddleware, { ApiAccess, IAPI } from "../../middleware/api";

const router = Router();

const API: IAPI = {
  get: {
    getJobs: {
      access: ApiAccess.GUEST,
      execute: async (query: any): Promise<IJobModel[]> => {
        const jobs = await Job.find({})
          .select("-_id -__v")
          .exec();
        return jobs;
      }
    }
  }
}; 

// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = createApiMiddleware(API);
router.all("/:method", middleware);

export default router;
