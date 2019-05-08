import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import AccountData from "../../models/AccountData";
import UserData from "../../models/UserData";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Job";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";
import User from "../../models/User";
import UserProfile from "../../models/UserProfile";
import JobRespond from "../../models/JobRespond";

const router = Router();

const API: IAPI = {
  get: {
    user: {
      access: ApiAccess.TOKEN,
      execute: async ({ id }): Promise<any> => {
        const respond = await JobRespond.find({ authorId: id }).exec();
        return respond;
      }
    },
    job: {
      access: ApiAccess.TOKEN,
      schema: {
        jobId: joi.string().required()
      },
      execute: async ({ jobId, id }): Promise<any> => {
        const job = await Job.findById(jobId).exec();
        if (!job) throw apiError("Invalid jobId");
        if (job.authorId.toString() !== id) throw apiError("Access denied");
        const responds = await JobRespond.find({ jobId }).exec();
        return responds.map(r => r.toObject());
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
        respondId: joi.string().required()
      },
      execute: async ({ respondId, id }): Promise<any> => {
        const respond = await JobRespond.findById(respondId).exec();
        if (!respond) throw apiError("Invalid respondId");
        if (respond.authorId.toString() !== id) throw apiError("Access denied");
        await respond.remove();
        return { deletedId: respondId };
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
    },
    create: {
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
    setStatus: {
      access: ApiAccess.TOKEN,
      schema: {
        respondId: joi.string().required(),
        status: joi.string().valid(["APPROVED", "DECLINED", "CANCELED"])
      },
      execute: async ({ respondId, id, status }, req) => {
        const respond = await JobRespond.findById(respondId).exec();
        const job = await Job.findById(respond.jobId).exec();
        if ((status === "CANCELED" && respond.authorId.toString() !== id) || job.authorId.toString() !== id) throw apiError("Access denied");
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
