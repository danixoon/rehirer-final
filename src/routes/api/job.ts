import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel, IJob } from "../../models/Jobs";
import createApiMiddleware, { ApiAccess, IAPI } from "../../middleware/api";

import * as joi from "joi";
import UserData from "../../models/UserData";

const router = Router();

const API: IAPI = {
  get: {
    jobs: {
      access: ApiAccess.TOKEN,
      schema: {
        count: joi.number().integer(),
        offset: joi.number().integer()
      },
      execute: async ({ count, offset }): Promise<IJobModel[]> => {
        const jobs = await Job.find()
          .skip(offset)
          .limit(count)
          .select("city tags description timespan price label authorId")
          .exec();
        await new Promise(res => setTimeout(res, 5000));
        return jobs;
      }
    }
  },
  post: {
    job: {
      access: ApiAccess.TOKEN,
      schema: {
        label: joi
          .string()
          .min(5)
          .required(),
        description: joi
          .string()
          .min(10)
          .required(),
        city: joi.string(),
        timespan: joi
          .number()
          .integer()
          .required(),
        tags: joi.array(),
        secretInfo: joi.string(),
        // userId: joi.string(),
        price: joi.number().required()
      },
      execute: async ({ label, description, city, timespan, tags, secretInfo, price, id }) => {
        const jobDoc: IJob = {
          authorId: id,
          description,
          label,
          tags,
          secretInfo,
          price,
          city,
          timespan
        };
        if (!city) {
          const data = await UserData.findOne({ userId: id }).exec();
          jobDoc.city = data.city;
        }
        const job = await new Job(jobDoc).save();
        return { jobId: job.id };
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
