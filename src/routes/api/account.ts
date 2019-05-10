import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import AccountData, { IAccountData } from "../../models/AccountData";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel } from "../../models/Job";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";
import auth from "../../middleware/auth";

import * as joi from "joi";
import UserData, { IUserData } from "../../models/UserData";
import UserProfile, { IUserProfile } from "../../models/UserProfile";
import User, { IUser } from "../../models/User";

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
          if (!accountData) return rej(apiError("Неверный логин или пароль", 400));

          const isMatch = await bcrypt.compare(password, accountData.password);
          if (!isMatch) return rej(apiError("Неверный логин или пароль", 400));

          const user = await User.findById(accountData.userId).exec();
          if (!user.verifed) return rej(apiError("Аккаунт не активирован", 401));
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
        });
      }
    },
    data: {
      // schema: {},
      access: ApiAccess.TOKEN,
      execute: async ({ id }) => {
        return await AccountData.findOne({ userId: id })
          .select("-password -_id -__v")
          .exec();
      }
    },
    changePassword: {
      schema: {
        oldPassword: joi.string().required(),
        newPassword: joi
          .string()
          .min(8)
          .required()
      },
      access: ApiAccess.TOKEN,
      execute: async ({ id, oldPassword, newPassword }) => {
        const account = await AccountData.findOne({ userId: id }).exec();
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) throw apiError("Неверный пароль");
        // const account = await AccountData.updateOne({ userId: id }, { username, email }).exec();
        await account.updateOne({ password: await genHash(newPassword) }).exec();
        return;
        // return await AccountData.findOne({ userId: id })
        //   .select("-password -_id -__v")
        //   .exec();
      }
    },
    edit: {
      schema: { email: joi.string().email(), username: joi.string().min(4) },
      access: ApiAccess.TOKEN,
      execute: async ({ id, email, username }) => {
        const exists = await AccountData.findOne({ $or: [{ email }, { username }] }).exec();
        if (exists) throw apiError("user with this email or username already exists");
        // const account = await AccountData.updateOne({ userId: id }, { username, email }).exec();
        const account = await AccountData.findOne({ userId: id }).exec();
        account.updateOne({ email: email || account.email, username: username || account.username }).exec();
        return;
        // return await AccountData.findOne({ userId: id })
        //   .select("-password -_id -__v")
        //   .exec();
      }
    },
    verify: {
      schema: {
        hash: joi.string().required(),
        salt: joi.string()
      },
      access: ApiAccess.GUEST,
      execute: async ({ hash, salt: id }) => {
        if (await bcrypt.compare(process.env.JWT_SECRET, hash)) {
          const user = await User.findById(id).exec();

          if (!user || user.verifed) throw apiError("access denied", 401);
          else user.verifed = true;

          await user.save();
          return await new Promise((res, rej) =>
            jwt.sign(
              {
                id: user.id
              },
              process.env.JWT_SECRET,
              { expiresIn: "10h" },
              (err, token) => {
                if (err) rej(err);
                res({ token });
              }
            )
          );
        } else throw apiError("access denied");
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
              // const user = await User.findById(userId).exec();
              // const accountData = await AccountData.findOne({ userId }).exec();
              // if(!accou)
              return res({ token });
            }
          });
        });
      }
    },
    create: {
      schema: {
        email: joi
          .string()
          .email()
          .required(),
        username: joi
          .string()
          .required()
          .min(5),
        password: joi
          .string()
          .required()
          .min(8),
        firstName: joi
          .string()
          .required()
          .max(20),
        secondName: joi
          .string()
          .required()
          .max(20),
        description: joi
          .string()
          .required()
          .min(10),
        thirdName: joi.string().max(20),
        dob: joi.date().required(),
        city: joi
          .string()
          .required()
          .min(2),
        socialUrl: joi.string(),
        tags: joi.array().max(5)
      },
      access: ApiAccess.GUEST,
      execute: async ({ username, description, password, email, firstName, secondName, thirdName, dob, city, socialUrl, tags }, req) => {
        const existingUser = await AccountData.findOne()
          .or([{ username }, { email: email }])
          .exec();
        if (existingUser) throw apiError("Пользователь уже существует", 400);

        const user = await new User().save().catch(err => console.log(err));
        if (!user) throw "WHATA FUCK";

        const pass = await genHash(password);

        const accountData: IAccountData = {
          username,
          email,
          password: pass,
          userId: user.id
        };

        const userDataDoc: IUserData = {
          dob: new Date(dob),
          firstName,
          secondName,
          thirdName,
          city,
          socialUrl,
          userId: user.id,
          tags,
          description
        };

        const userProfile: IUserProfile = {
          dor: new Date(),
          userId: user.id
        };

        const fullUser = await Promise.all([new UserProfile(userProfile).save(), new UserData(userDataDoc).save(), new AccountData(accountData).save()]);

        // const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(process.env.JWT_SECRET, await bcrypt.genSalt(11));
        const url = `${req.protocol}://${req.get("host")}/account/verify?hash=${hash}&salt=${user.id}`;

        req.smtp.sendMail({
          from: "rehirer@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Добро пожаловать на Rehirer!", // Subject line
          // text: "Hello world?", // plain text body
          html: `<p><b>Активируйте аккаунт, пройдя по этой ссылке</b></p><a href='${url}'>${url}</a>`
        });
        // let info =

        // const dev = await bcrypt.compare("token", hash);

        // return await new Promise((res, rej) => {

        // });
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
