import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import AccountData from "../../models/AccountData";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Jobs";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";

const router = Router();

const API: IAPI = {
  get: {
    auth: {
      schema: {
        login: joi.string().required(),
        password: joi.string().required()
      },
      access: ApiAccess.GUEST,
      execute: ({ login, password }): Promise<any> => {
        return new Promise(async (res, rej) => {
          const user = await AccountData.findOne()
            .or([{ username: login }, { email: login }])
            .and([{ password }])
            .select("-_id -__v")
            .exec();
          if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) rej(apiError(400, "invalid credentials"));
            jwt.sign(
              {
                id: user.id
              },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) rej(err);
                res({
                  token,
                  ...user.toObject()
                });
              }
            );
          } else rej(apiError(400, "invalid credentials"));
        });
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
