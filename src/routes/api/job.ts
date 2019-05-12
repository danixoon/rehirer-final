import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel, IJob } from "../../models/Job";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";
import UserData from "../../models/UserData";
import JobRespond from "../../models/JobRespond";
import AccountData from "../../models/AccountData";
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
        search: joi.string().allow(""),
        count: joi
          .number()
          .integer()
          .default(100),
        offset: joi
          .number()
          .integer()
          .default(0),
        tags: joi.array(),
        minPrice: joi.number(),
        maxPrice: joi.number(),
        priceSort: joi
          .number()
          .valid(1, -1)
          .default(1)
          .optional(),
        // labelSort: joi
        //   .number()
        //   .valid(1, -1)
        //   .default(1)
        //   .optional()
      },
      execute: async ({ search, count, offset, tags, minPrice, maxPrice, priceSort }) => {
        // let total = Job.find()
        //   .count()
        //   .exec();
        const findJobs = () => {
          let query = Job.find();
          if (search)
            query = query.find({
              $or: [{ label: { $regex: search } }, { description: { $regex: search } }]
            });
          if (tags) query = query.find({ tags: { $all: tags } });
          if (minPrice) query = query.find({ price: { $gte: minPrice } });
          if (maxPrice) query = query.find({ price: { $lte: maxPrice } });

          query = query.sort({ price: priceSort });
          // if (priceSort) query = query.sort({ price: priceSort });
          return query;
        };

        const total = findJobs().count();
        const jobs = findJobs()
          .skip(offset)
          .limit(count)
          .select("city tags description timespan price label authorId");

        // await new Promise(res => setTimeout(res, 5000));
        return { count: await total.exec(), items: (await jobs.exec()).map(j => j.toObject()) };
      }
    },
    byId: {
      access: ApiAccess.TOKEN,
      schema: {
        ids: joi.array().required()
      },
      execute: async ({ ids }) => {
        const findJobs = () => {
          return Job.find({ _id: { $in: ids } }).select("city tags description timespan price label authorId");
        };
        const total = findJobs().count();
        // const jobs =

        // await new Promise(res => setTimeout(res, 5000));
        return { count: await total.exec(), items: await findJobs().exec() };
      }
    },
    create: {
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
    secret: {
      access: ApiAccess.TOKEN,
      schema: {
        jobId: joi.string().required()
        // respondId: joi.string().required(),
        // status: joi.string().valid(["APPROVED", "DECLINED", "CANCELED"])
      },
      execute: async ({ jobId, id }, req) => {
        const job = await Job.findById(jobId).exec();
        if (!job) return apiError("Invalid Job Id");

        const respond = await JobRespond.findOne({ jobId, authorId: id }).exec();
        if (!respond) return apiError("Access Denied");

        const jobAuthor = await UserData.findOne({ userId: job.authorId }).exec();
        const jobUser = await AccountData.findOne({ userId: job.authorId }).exec();

        return { secretInfo: job.secretInfo, socialURL: jobAuthor.socialUrl, email: jobUser.email, respondId: respond.id };

        // const respond = await JobRespond.findById(respondId).exec();
        // const job = await Job.findById(respond.jobId).exec();
        // if ((status === "CANCELED" && respond.authorId.toString() !== id) || job.authorId.toString() !== id) throw apiError("Access denied");
        // if (respond.status !== "PENDING") throw apiError("Already " + respond.status.toLowerCase());
        // await respond.updateOne({ status }).exec();
        // return (await JobRespond.findById(respond.id).exec()).toObject();
        // return respond;
        // await respond.remove();
        // return "yeah";
        // const respond = await new JobRespond({ message, jobId, respondUserId: id });
        // return { id: respond.id };
      }
    },
    user: {
      access: ApiAccess.TOKEN,
      schema: {
        type: joi.valid("pending", "completed").default("pending")
      },
      execute: async ({ id, type }): Promise<any> => {
        const jobs = await Job.find({ authorId: id })
          .select("_id")
          .exec();
        return !jobs ? [] : jobs.map(j => j._id);
        // await new Promise(res => setTimeout(res, 5000));
        // const account = await AccountData.findOne({ username }).exec();
        // const user = await User.findOne({ accountDataId: account.id }).exec();
        // const user = await User.findById(id).exec();
        // const data = await UserData.findOne({ userId: userId || id }).exec();
        // if (data) return data.toObject();
        // else throw apiError("user not found", 404);
        // result.toJSON();
      }
    },
    delete: {
      access: ApiAccess.TOKEN,
      schema: {
        jobId: joi.string().required()
      },
      execute: async ({ jobId, id }): Promise<any> => {
        const job = await Job.findById(jobId).exec();
        if (!job) throw apiError("Invalid respondId");
        if (job.authorId.toString() !== id) throw apiError("Access denied");
        await JobRespond.deleteMany({ jobId }).exec();
        await job.remove();
        return { deletedId: job.id };
        // const responds = await JobRespond.find({ jobId }).exec();
        // return responds.map(r => r.toObject());
        // await new Promise(res => setTimeout(res, 5000));
        // const account = await AccountData.findOne({ username }).exec();
        // const user = await User.findOne({ accountDataId: account.id }).exec();
        // const user = await User.findById(id).exec();
        // const data = await UserData.findOne({ userId: userId || id }).exec();
        // if (data) return data.toObject();
        // else throw apiError("user not found", 404);
        // result.toJSON();
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
