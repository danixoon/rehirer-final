import * as express from "express";
import * as multer from "multer";
import Image from "../../models/Image";

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
import * as fs from "fs";

import * as streamifier from "streamifier";

import * as Datauri from "datauri";
import * as path from "path";

const datauri = new Datauri();
import * as cloudinary from "cloudinary";
const cloud = cloudinary.v2;

// import * as path from "path";
// import { apiError } from "../../middleware — backup/api";

const router = Router();

// const storage = multer.diskStorage({
//   destination: async (req: any, file, cb) => {
//     const p = `./upload/images/${req.userId}/`;
//     if (!fs.existsSync(p)) await new Promise((res, rej) => fs.mkdir(p, err => (err ? rej(err) : res())));
//     cb(null, p);
//   },
//   filename: async (req: any, file, cb) => {
//     const re = /(?:\.([^.]+))?$/;
//     const ext = re.exec(file.originalname)[1];
//     cb(null, `${await bcrypt.genSalt(10)}_${Date.now()}.${ext}`);
//   }
// });

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
          // const file =
          // streamifier.createReadStream(request.file.buffer, { encoding: "binary" }).pipe(stream);
          // datauri
          // fs.createReadStream("./icon.png", { encoding: "binary" }).pipe(stream);
        });

        // req.userId = id;
        // const err = await new Promise(next => upload.single("data")(req, res, next));
        // if (err) throw err;
        // if (!req.body.name || !req.file) throw apiError("data required", 400);
        // const newImage = new Image({ name: req.body.name, data: req.file.path });
        // const result = (await newImage.save()) as any;
        // return { url: result.data };
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

// export default

// const ImageRouter = express.Router();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./upload/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
//   else cb(null, false);
// };

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter
// });

// ImageRouter.route("/image").post(upload.single("data"), async (req, res, next) => {
//   console.log(req.body);
//   if (!req.body.name || !req.file) return res.status(400).send({ msg: "incorrect query" });
//   const newImage = new Image({ name: req.body.name, data: req.file.path });
//   try {
//     const result = await newImage.save();
//     res.status(200).send({ document: result });
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// export default ImageRouter;
