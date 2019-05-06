import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel, IJob } from "../../models/Job";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";
import UserData from "../../models/UserData";
import JobRespond from "../../models/JobRespond";
// import { apiError } from "../../middleware — backup/api";

const router = Router();

function isEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || !str.trim();
}

const API: IAPI = {
  get: {
    find: {
      access: ApiAccess.TOKEN,
      schema: {
        count: joi
          .number()
          .integer()
          .default(100),
        offset: joi
          .number()
          .integer()
          .default(0)
      },
      execute: async ({ count, offset }): Promise<IJobModel[]> => {
        const jobs = await Job.find()
          .skip(offset)
          .limit(count)
          .select("city tags description timespan price label authorId")
          .exec();
        // await new Promise(res => setTimeout(res, 5000));
        return jobs;
      }
    },
    byId: {
      access: ApiAccess.TOKEN,
      schema: {
        ids: joi.array().required()
      },
      execute: async ({ ids }): Promise<IJobModel[]> => {
        const jobs = await Job.find({ _id: { $in: ids } })
          .select("city tags description timespan price label authorId")
          .exec();
        // await new Promise(res => setTimeout(res, 5000));
        return jobs;
      }
    },
    new: {
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
      execute: async ({ label, description, city, timespan, tags, secretInfo, price, id }, req) => {
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
        if (isEmpty(city)) {
          const data = await UserData.findOne({ userId: id }).exec();
          jobDoc.city = data.city;
        }
        const job = await new Job(jobDoc).save();
        return { jobId: job.id };
      }
    },
    respond: {
      access: ApiAccess.TOKEN,
      schema: {
        jobId: joi.string().required(),
        message: joi.string().required()
      },
      execute: async ({ jobId, message, id }, req) => {
        const responded = await JobRespond.find({ jobId, authorId: id }).exec();
        if (responded.length > 0) throw apiError("You already responded");

        const respond = await new JobRespond({ message, jobId, authorId: id }).save();
        return respond.toObject();
      }
    },
    changeRespondStatus: {
      access: ApiAccess.TOKEN,
      schema: {
        respondId: joi.string().required(),
        status: joi.string().valid(["APPROVED", "DECLINED"])
      },
      execute: async ({ respondId, id, status }, req) => {
        const respond = await JobRespond.findById(respondId).exec();
        if (respond.authorId.toString() !== id) throw apiError("Access denied");
        if (respond.status !== "PENDING") throw apiError("Already " + respond.status.toLowerCase());
        await respond.updateOne({ status }).exec();
        return (await JobRespond.findById(respond.id).exec()).toObject();
        // return respond;
        // await respond.remove();
        // return "yeah";
        // const respond = await new JobRespond({ message, jobId, respondUserId: id });
        // return { id: respond.id };
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
