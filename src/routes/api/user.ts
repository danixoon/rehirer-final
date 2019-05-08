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
    profile: {
      access: ApiAccess.TOKEN,
      execute: async ({ id, userId }): Promise<any> => {
        // const account = await AccountData.findOne({ username }).exec();
        // const user = await User.findOne({ accountDataId: account.id }).exec();
        // const user = await User.findById(id).exec();
        const profile = await UserProfile.findOne({ userId: userId || id }).exec();
        if (profile) return profile.toObject();
        else throw apiError("user not found", 404);
        // result.toJSON();
      }
    },
    data: {
      access: ApiAccess.TOKEN,
      schema: {
        userId: joi.string()
      },
      execute: async ({ id, userId }): Promise<any> => {
        // await new Promise(res => setTimeout(res, 5000));
        // const account = await AccountData.findOne({ username }).exec();
        // const user = await User.findOne({ accountDataId: account.id }).exec();
        // const user = await User.findById(id).exec();
        const data = await UserData.findOne({ userId: userId || id }).exec();
        if (data) return data.toObject();
        else throw apiError("user not found", 404);
        // result.toJSON();
      }
    },
    
  }
};

// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = createApiMiddleware(API);
router.all("/:method", middleware);

export default router;
