import * as bcrypt from "bcrypt";
import * as config from "config";
import { Router, RequestHandler, Response } from "express";
import AccountData from "../../models/AccountData";
import UserData from "../../models/UserData";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Jobs";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";
import User from "../../models/User";

const router = Router();

const API: IAPI = {
  get: {
    info: {
      schema: {
        username: joi.string().required()
      },
      access: ApiAccess.GUEST,
      execute: async ({ username }): Promise<any> => {
        const account = await AccountData.findOne({ username }).exec();
        const user = await User.findOne({ accountDataId: account.id }).exec();
        const result = await UserData.findById(user.userDataId)
          .select("-_id -__v")
          .exec();
        if (result) return result.toObject();
        else throw apiError(404, "user not found");
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
