import * as multer from "multer";import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";

import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";
import * as Datauri from "datauri";
import * as path from "path";

const datauri = new Datauri();
import * as cloudinary from "cloudinary";
const cloud = cloudinary.v2;

const router = Router();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
  else cb(null, false);
};

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});
const API: IAPI = {
  post: {
    image: {
      access: ApiAccess.TOKEN,
      schema: {},
      execute: async ({ count, offset, id }, request, response) => {
        return new Promise(async (res, rej) => {
          // request.userId = id;
          await new Promise(next => upload.single("data")(request, response, next)).catch(err => rej(apiError("invalid image")));
          if (!request.body.name || !request.file) rej(apiError("data required", 400));
          // const newImage = new Image({ name: request.body.name, data: request.file.path });
          // upload
          cloud.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
          const extname = path.extname(request.file.originalname);
          const public_id = `${id}_${await bcrypt.genSalt(10)}_${Date.now()}`;

          datauri.format(extname, request.file.buffer);
          cloud.uploader.upload(datauri.content, { public_id }, function(err, i) {
            if (err) rej(err);
            res({ url: "/upload/images/" + public_id + extname });
          });
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