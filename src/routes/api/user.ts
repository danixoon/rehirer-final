import { Router, RequestHandler, Response } from "express";
import UserData from "../../models/UserData";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";
import * as joi from "joi";
import UserProfile from "../../models/UserProfile";
const router = Router();
const API: IAPI = {
  get: {
    edit: {
      access: ApiAccess.TOKEN,
      schema: {
        firstName: joi.string(),
        secondName: joi.string(),
        thirdName: joi.string(),
        dob: joi.string(),
        description: joi.string(),
        city: joi.string(),
        socialUrl: joi.string(),
        avatarUrl: joi.string(),
        tags: joi.array()
      },
      execute: async ({ id, firstName, secondName, thirdName, dob, description, city, avatarUrl, socialUrl, tags }): Promise<any> => {
        const user = await UserData.findOne({ userId: id }).exec();
        if (!user) throw apiError("user not found", 404);

        const doc = {
          firstName: firstName || user.firstName,
          secondName: secondName || user.secondName,
          thirdName: thirdName || user.thirdName,
          dob: dob || user.dob,
          description: description || user.description,
          city: city || user.city,
          tags: tags || user.tags,
          socialUrl: socialUrl || user.socialUrl,
          avatarUrl: avatarUrl || user.avatarUrl
        };

        await user.updateOne(doc);
        return await UserData.findById(user.id).exec();
      }
    },
    profile: {
      access: ApiAccess.TOKEN,
      execute: async ({ id, userId }): Promise<any> => {
        const profile = await UserProfile.findOne({ userId: userId || id }).exec();
        if (profile) return profile.toObject();
        else throw apiError("user not found", 404);
      }
    },
    data: {
      access: ApiAccess.TOKEN,
      schema: {
        userId: joi.string()
      },
      execute: async ({ id, userId }): Promise<any> => {
        const data = await UserData.findOne({ userId: userId || id }).exec();
        if (data) return data.toObject();
        else throw apiError("user not found", 404);
      }
    }
  }
};
const middleware = createApiMiddleware(API);
router.all("/:method", middleware);
export default router;
