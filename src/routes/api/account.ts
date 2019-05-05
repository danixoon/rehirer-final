import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import AccountData, { IAccountData } from "../../models/AccountData";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Jobs";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";
import auth from "../../middleware/auth";

import * as joi from "joi";
import AccountType, { workerUserScope } from "../../models/AccountType";
import UserData, { IUserData } from "../../models/UserData";
import UserProfile, { IUserProfile } from "../../models/UserProfile";
import User, { IUser } from "../../models/User";
import JobTag from "../../models/JobTag";

const router = Router();

function genHash(password: string): Promise<string> {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return rej(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return rej(err);
        return res(hash);
      });
    });
  });
}
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
          const accountData = await AccountData.findOne()
            .or([{ username: login }, { email: login }])
            .exec();
          if (!accountData) rej(apiError("Неверный логин или пароль", 400));

          const isMatch = await bcrypt.compare(password, accountData.password);
          if (!isMatch) rej(apiError("Неверный логин или пароль", 400));

          if (accountData) {
            const isMatch = await bcrypt.compare(password, accountData.password);
            if (!isMatch) rej(apiError("Неверный логин или пароль", 400));

            const user = await User.findOne({ accountDataId: accountData.id }).exec();
            jwt.sign(
              {
                id: user.id
              },
              process.env.JWT_SECRET,
              { expiresIn: "10h" },
              (err, token) => {
                if (err) rej(err);
                res({
                  token,
                  ...accountData.toObject()
                });
              }
            );
          } else rej(apiError("Неверный логин или пароль", 400));
        });
      }
    },
    checkToken: {
      schema: {
        token: joi.string().required()
      },
      access: ApiAccess.GUEST,
      execute: ({ token }): Promise<any> => {
        return new Promise((res, rej) => {
          auth(token, async (err, userId) => {
            if (err) rej(err);
            else {
              const user = await User.findById(userId).exec();
              const accountData = await AccountData.findById(user.accountDataId).exec();
              return res({ ...accountData.toObject(), token });
            }
          });
        });
      }
    },
    create: {
      schema: {
        email: joi.string().required(),
        username: joi.string().required(),
        password: joi.string().required(),
        firstName: joi.string().required(),
        secondName: joi.string().required(),
        thirdName: joi.string().required(),
        dob: joi.date().required()
      },
      access: ApiAccess.GUEST,
      execute: async ({ username, password, email, firstName, secondName, thirdName, dob }) => {
        const existingUser = await AccountData.findOne()
          .or([{ username }, { email: email }])
          .exec();
        if (existingUser) throw apiError("Пользователь уже существует", 400);

        const pass = await genHash(password);

        const accountData: IAccountData = {
          username,
          email,
          password: pass,
          avatarURL: "https://pp.userapi.com/c840225/v840225382/7839a/kQV6BpB5yAg.jpg",
          accountTypeId: (await AccountType.findOne({ label: "admin" }).exec()).id
        };

        const account = await new AccountData(accountData).save();

        const userDataDoc: IUserData = {
          dob: new Date(dob),
          firstName: firstName,
          secondName: secondName,
          thirdName: thirdName
        };
        const userData = await new UserData(userDataDoc).save();

        const userProfile: IUserProfile = {
          dor: new Date()
        };

        const profile = await new UserProfile(userProfile).save();

        const userDoc: IUser = {
          userProfileId: profile.id,
          accountDataId: account.id,
          userDataId: userData.id
        };
        const user = await new User(userDoc).save();

        return await new Promise((res, rej) => {
          jwt.sign(
            {
              id: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: "10h" },
            (err, token) => {
              if (err) rej(err);
              res({
                token,
                user: userData
              });
            }
          );
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
